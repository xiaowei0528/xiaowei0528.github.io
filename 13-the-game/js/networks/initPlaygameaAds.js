eventToFire.registerEvent('deviceready', function() {
	//check
	var activateInterstitial = parseInt("1") || 0;
	var activateRewardedVideo = parseInt("0") || 0;
	var activateBanner = parseInt("0") || 0;

	eventToFire.registerEvent("prepareAds",function(){
		// inter
		if(activateInterstitial){
			playgameaAds.interstitial.init().load();
		}
		// rewarded
		if(activateRewardedVideo){
			playgameaAds.rewardvideo.init().load();
		}
		if(activateBanner){
			// not exist
			// playgameaAds.banner.init({}).load();
		}
	});
}, false);
