;(function(){

var init = false;
var jsonLoaded = false;
var leaderboards_list = {};

var partner = {};
partner.name = "playgamea";

eventToFire.registerEvent('deviceready',function(){
	if(init){return;}
	init = true;
	window.eventToFire.fireEvent("leaderboard_addPartner", partner);

	loadLeaderboard();
});


partner.isReady = function(){
	try{
		return ((window.PlaygameaAPI && window.PlaygameaAPI.Scores && jsonLoaded) || false);
	}catch(e){
		return false;
	}
}

partner.canDisplay = function(){
	window.eventToFire.fireEvent("leaderboard:ICanDisplayLeaderboard",true);
}

partner.submitScore = function(leaderboard, score){
	if(!this.isReady()){return;}
	if(getLeaderboardCodePlatform(leaderboard) == ""){return;}
	PlaygameaAPI.Scores.save({score:score,board:getLeaderboardCodePlatform(leaderboard)}, function(response) {
		if(response.success) {
			eventToFire.fireEvent("playtouchLeaderboard_submit-succeededed");
		}else {
			eventToFire.fireEvent("playtouchLeaderboard_submit-failed");
		}
	});
}

partner.showLeaderboard = function(leaderboard,canFallback){
	if(!this.isReady()){return;}
	var leaderboard_code = getLeaderboardCodePlatform(leaderboard);
	if(leaderboard_code == ""){
        if(canFallback){

        }
		return;
	}
}

partner.showLeaderboards = function(){
	if(!this.isReady()){return;}
}

var maxTry = 15;
function loadLeaderboard(){
	try{
		var req = new XMLHttpRequest();

		req.onerror = function(err){
			//console.log("error : ",err);
			maxTry--;
			if(maxTry <= 0){return;}
			setTimeout(loadLeaderboard,1000);
		}

		req.onreadystatechange = function() {
		    if (this.readyState === 4) {
				var ac = JSON.parse(this.responseText);
				for (var i in ac) {
					leaderboards_list[ac[i]["leaderboard_code"]] = ac[i]["leaderboard_code_ios"];
				};
				jsonLoaded = true;
		    }
		};

		req.open('GET', 'js/leaderboard/leaderboards.json', true);
		req.send();
	}catch(e){}
}

function getLeaderboardCodePlatform(code){
	return leaderboards_list[code] || "";
}

}());
