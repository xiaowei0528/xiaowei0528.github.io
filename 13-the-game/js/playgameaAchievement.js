;(function(){
var achievementsList = {};
var init = false;
eventToFire.registerEvent('deviceready', function() {
	if(init){return;}
	init = true;
	achievementsOffline.checkSave();
	loadAchievement();
});

window.eventToFire.registerEvent("c2:achievement_show",c2EventShow);
window.eventToFire.registerEvent("c2:achievement:show",c2EventShow);

window.eventToFire.registerEvent("c2:achievement_unlock",c2EventUnlock);
window.eventToFire.registerEvent("c2:achievement:unlock",c2EventUnlock);

window.eventToFire.registerEvent("c2:achievement_increment",c2EventIncrement);
window.eventToFire.registerEvent("c2:achievement:increment",c2EventIncrement);

function c2EventShow(obj){
	if(!PlaygameaAPI){return false;}
	PlaygameaAPI.Achievements.show()
}

function c2EventUnlock(obj){
	if(!achievementUnlock(obj)){
		achievementsOffline.unlock(obj.achievement_code);
	}
}

function c2EventIncrement(obj,increment){
	if(!achievementIncrement(obj,increment)){
		achievementsOffline.increment(obj, increment);
	}
};

//__________
function achievementUnlock(obj){
	if(!PlaygameaAPI){return false;}
	if(!achievementCodeExist(obj.achievement_code)){return false;}
	PlaygameaAPI.Achievements.save([getIdByCode(obj.achievement_code)], function(response){});
	return true;
}

function achievementIncrement(obj,increment){
	if(!PlaygameaAPI){return false;}
	if(!achievementCodeExist(obj.achievement_code)){return false;}
	if(obj.currentStep == obj.achievement_steps){
		achievementUnlock(obj);
	}
	return true;
}


//LOAD
function getIdByCode(code){
	if(!achievementCodeExist(code)){return "";}
	return achievementsList[code];
}

function achievementCodeExist(code){
	if(achievementsList[code]){return true;}
	return false;
}

var maxTry = 15;

function loadAchievement(){
	try{
		var req = new XMLHttpRequest();

		req.onerror = function(err){
			//console.log("error : ",err);
			maxTry--;
			if(maxTry <= 0){return;}
			setTimeout(loadAchievement,1000);
		}

		req.onreadystatechange = function() {
		    if (this.readyState === 4) {
		        var ac = JSON.parse(this.responseText);
				for (var i = 0; i < ac.length; i++) {
					achievementsList[ac[i]["achievement_code"]] = ac[i]["achievements-alias_name"];
				};
		    }
		};

		req.open('GET', 'js/achievements_list.json', true);
		req.send();
	}catch(e){}
}
//OFFLINE SAVE
var achievementsOffline = {};
achievementsOffline.init = function() {
	this.saveKey = "saveAchOffline";
	this.arrayNotif = {};
	this.load();
};

achievementsOffline.load = function() {
	this.arrayNotif = JSON.parse(autoGet(this.saveKey,"{}"));
};

achievementsOffline.save = function() {
	var count = 0;
	for(var i in this.arrayNotif){count++;break;}
	if(count == 0){return;}
	autoSet(this.saveKey,JSON.stringify(this.arrayNotif));
};

achievementsOffline.checkIfExist = function(achievement_code){
	if(!this.arrayNotif[achievement_code]){
		this.arrayNotif[achievement_code] = {};
	}
}

achievementsOffline.unlock = function (achievement_code){
	this.checkIfExist(achievement_code);
	this.arrayNotif[achievement_code].t = "u";
	this.save();
}

achievementsOffline.increment = function (obj,increment){
	this.checkIfExist(obj.achievement_code);
	this.arrayNotif[obj.achievement_code].t = "i";
	// this.arrayNotif[obj.achievement_code].q = (this.arrayNotif[obj.achievement_code].q || 0)+increment;
	this.arrayNotif[obj.achievement_code].c = obj.currentStep;
	this.arrayNotif[obj.achievement_code].a = obj.achievement_steps;
	this.save();
}

achievementsOffline.checkSave = function(){
	if(!PlaygameaAPI){return;}
	for(var i in this.arrayNotif){
		if(this.arrayNotif[i].t == "u"){
			if(achievementUnlock({achievement_code:i})){
				delete this.arrayNotif[i];
				continue;
			}
		}else{
			if(achievementIncrement({achievement_code:i,currentStep:this.arrayNotif[i].c,achievement_steps:this.arrayNotif[i].a})){
				delete this.arrayNotif[i];
				continue;
			}
		}
	}
	this.save();
}

achievementsOffline.init();

}());