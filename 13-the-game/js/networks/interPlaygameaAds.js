;(function(){
	var delayOnFail_timer = [10,30,60,300,600];
	var delayOnFail_actualTimer = 0;
	var delayOnFail_timerInter;
	
	var isAdAvailable = false;
	var network = {};
	network.name = "playgameaAds";
	network.callback = {
		load:undefined,
		close:undefined
	};
	
	eventToFire.registerEvent("deviceready",
		function(){
			eventToFire.fireEvent("adNetwork_Inter", network);
		}, false
	);
	
	eventToFire.registerEvent("prepareAds",function(){
		isAdAvailable = false;
	});
	
	network.isReady = function(eventName){
		return (parseInt("1") || 0);
	}
	
	network.isInterReady = function(){
		return isAdAvailable;
	}
	
	network.launchInter = function(){
		if(!this.isReady()){return false;}
		if(!this.isInterReady()){return false;}
		isAdAvailable = false;
		playgameaAds.interstitial.show();
		return true;
		
	}
	
	function closedInter(){
		if(typeof(network.callback.close) != 'undefined') network.callback.close();
		delayOnFail_actualTimer = 0;
		clearInterval(delayOnFail_timerInter);
		playgameaAds.interstitial.load();
	}
	
	function loadFail(){
		if(typeof(network.callback.close) != 'undefined') network.callback.close();
		delayOnFail_timerInter = setTimeout(
			function(){
				playgameaAds.interstitial.load();
			},
			delayOnFail_timer[delayOnFail_actualTimer]*1000
		);
		delayOnFail_actualTimer = Math.min(delayOnFail_actualTimer+1, delayOnFail_timer.length-1);
	}

	//-----------------------------------------------------------------
	
	eventToFire.registerEvent("playgamea.interstitial.load", (e) => {
		isAdAvailable = true;
		if(typeof(network.callback.load) != 'undefined') network.callback.load();
	});
	
	eventToFire.registerEvent("playgamea.interstitial.loadfail", (e) => {
		loadFail();
	});
	
	eventToFire.registerEvent("playgamea.interstitial.show", (e) => {
	});
	
	eventToFire.registerEvent("playgamea.interstitial.dismiss", (e) => {
		closedInter();
	});
		
}());
		