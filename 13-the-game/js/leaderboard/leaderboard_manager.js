;(function(){
window.playtouchLeaderboard_listPartner = [];
window.playtouchLeaderboard_list = {};

eventToFire.registerEvent("deviceready", 
	function(){
		loadLeaderboard();
	}, false
);

var maxTry = 15;
function loadLeaderboard(){
	try{
		var req = new XMLHttpRequest();
		req.onerror = function(err){
			maxTry--;
			if(maxTry <= 0){return;}
			setTimeout(loadLeaderboard,1000);
		}

		req.onreadystatechange = function() {
		    if (this.readyState === 4) {
				window.playtouchLeaderboard_list = JSON.parse(this.responseText);
		    }
		};

		req.open('GET', 'js/leaderboard/leaderboards.json', true);
		req.send();
	}catch(e){}
}

/*********************************************
			event from C2
*********************************************/
	eventToFire.registerEvent("c2:leaderboard:init",function(){
		canDisplayAllPartner();
	});

	eventToFire.registerEvent("c2:leaderboard:submitScore",function(leaderboard, score){
		submitScore(leaderboard, score,true);
	});

	eventToFire.registerEvent("c2:leaderboard:showLeaderboard",function(leaderboard, canFallback){
		showLeaderboard(leaderboard, canFallback);
	});

	eventToFire.registerEvent("c2:leaderboard:showLeaderboards",function(){
		showLeaderboards();
	});

/*********************************************
			event from partner
*********************************************/
	eventToFire.registerEvent("playtouchLeaderboard_submit-succeededed",function(){
		eventToFire.fireEvent("leaderboard:onSubmitScoreSucceeded");
	});

	eventToFire.registerEvent("playtouchLeaderboard_submit-failed",function(){
		eventToFire.fireEvent("leaderboard:onSubmitScoreFailed");
	});

/*********************************************
			function for partner
*********************************************/
	eventToFire.registerEvent("leaderboard_addPartner",function(partner){
		playtouchLeaderboard_listPartner.push(partner);
		partner.canDisplay();
	});

	function canDisplayAllPartner(){
		for (var i = 0; i < playtouchLeaderboard_listPartner.length; i++) {
			if(typeof(playtouchLeaderboard_listPartner[i].canDisplay) == "function"){
				playtouchLeaderboard_listPartner[i].canDisplay();
			}
		}
	}

	function submitScore(leaderboard, score,sendByOther){
		score = getBestScore(leaderboard, score);
		for (var i = 0; i < playtouchLeaderboard_listPartner.length; i++) {
			if(typeof(playtouchLeaderboard_listPartner[i].submitScore) == "function"){
				playtouchLeaderboard_listPartner[i].submitScore(leaderboard, score);
			}
		}
		//resend for all score saved
		if(sendByOther){
			for (var i in playtouchLeaderboard_list) {
				if(i == leaderboard){continue;}
				if(!savedLeaderboardScore[i]){continue;}
				submitScore(i,  savedLeaderboardScore[i], false);
			}
		}
	}

	function showLeaderboard(leaderboard,canFallback){
		for (var i = 0; i < playtouchLeaderboard_listPartner.length; i++) {
			if(typeof(playtouchLeaderboard_listPartner[i].showLeaderboard) == "function"){
				playtouchLeaderboard_listPartner[i].showLeaderboard(leaderboard,canFallback);
			}
		}
	}

	function showLeaderboards(){
		for (var i = 0; i < playtouchLeaderboard_listPartner.length; i++) {
			if(typeof(playtouchLeaderboard_listPartner[i].showLeaderboards) == "function"){
				playtouchLeaderboard_listPartner[i].showLeaderboards();
			}
		}
	}

/*********************************************
			offline gestion
*********************************************/
	var savedLeaderboardScore = JSON.parse(getLocalStorageItem("leaderboard_save",'{}'));

	eventToFire.registerEvent("playtouchLeaderboard_submit-succeededed",function(){
		setTimeout(flushLeaderboardScore,100);
	});

	function saveLeaderboardScore(){
		setLocalStorageItem("leaderboard_save",JSON.stringify(savedLeaderboardScore));
	}

	function flushLeaderboardScore(){
		savedLeaderboardScore = {};
		saveLeaderboardScore();
	}

	function getBestScore(leaderboard,score){
		if(!playtouchLeaderboard_list[leaderboard]){return score;}

		var retScore;
		if(!savedLeaderboardScore[leaderboard]){
			retScore = score;
		}
		else if(playtouchLeaderboard_list[leaderboard].leaderboard_valuesOrder == "Larger is better" ||
		   playtouchLeaderboard_list[leaderboard].leaderboard_valuesOrder == 0){
		   	retScore = (score > savedLeaderboardScore[leaderboard])?score:savedLeaderboardScore[leaderboard];
		}else{
			retScore = (score < savedLeaderboardScore[leaderboard])?score:savedLeaderboardScore[leaderboard];
		}

		savedLeaderboardScore[leaderboard] = retScore;
		saveLeaderboardScore();
		return retScore;
	}



}());