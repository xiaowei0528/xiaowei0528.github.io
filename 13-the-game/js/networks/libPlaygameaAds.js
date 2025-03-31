var playgameaAds = {
	interstitial:{
		adUnitId:"",
		loaded:false,
		loading:false,
		isShown:false,
		time_betweenAds : 0,
		init : function(){
			this.adUnitId = "init";
			return this;
		},
		load : function(){
			if(this.adUnitId == ""){console.error("interstial not init !");return;}
			if(this.loaded){console.error("interstial already ready !");return;}
			if(this.loading){console.error("interstial is loading !");return;}
			if(this.isShown){console.error("interstial is playing !");return;}
			
			this.loaded = true;
			this.loading = false;
			eventToFire.fireEvent("playgamea.interstitial.load");
			return this;
		},
		show : function(){
			if(this.adUnitId == ""){console.error("interstial not init !");return;}
			if(!this.loaded){console.error("interstial not ready !");return;}
			if(typeof PlaygameaAPI == "undefined"){console.error("Lib not loaded!");return;}
			this.loaded = false;
			this.isShown = true;
			eventToFire.fireEvent("playgamea.interstitial.show");
			PlaygameaAPI.APIAds.show(()=>{
				this.isShown = false;
				eventToFire.fireEvent("playgamea.interstitial.dismiss");
			});
			return this;
		}
	},
	rewardvideo:{
		adUnitId:"",
		loaded:false,
		loading:false,
		isShown:false,
		callbackShowRewarded : undefined,
		init : function(){
			this.adUnitId = "init";
			return this;
		},
		load : function(){
			if(this.adUnitId == ""){console.error("rewarded not init !");return;}
			if(this.loaded){console.error("rewarded already ready !");return;}
			if(this.loading){console.error("rewarded is loading !");return;}
			if(this.isShown){console.error("rewarded is playing !");return;}
			
			this.loading = true;
			setTimeout(()=>{
				PlaygameaAPI.GEvents.reward((success,showAdFn)=>{
					// canShow
					this.loading = false;
					if(success){
						this.loaded = true;
						this.callbackShowRewarded = showAdFn;
						eventToFire.fireEvent("playgamea.rewarded.load");
					}else{
						eventToFire.fireEvent("playgamea.rewarded.loadfail");
					}
				},(success)=>{
					// rewarded
					this.isShown = false;
					if(success){
						eventToFire.fireEvent("playgamea.rewarded.reward");
					}
					eventToFire.fireEvent("playgamea.rewarded.dismiss");
				});
			},500);
			

			return this;
		},
		show : function(){
			if(this.adUnitId == ""){console.error("rewarded not init !");return;}
			if(!this.loaded){console.error("rewarded not ready !");return;}
			if(typeof PlaygameaAPI == "undefined"){console.error("Lib not loaded!");return;}

			this.loaded = false;
			this.isShown = true;
			eventToFire.fireEvent("playgamea.rewarded.show");
			this.callbackShowRewarded();
			this.callbackShowRewarded = undefined;
			return this;
		}
	},
	banner:{
		isShown:false,
		loaded:false,
		init : function(obj){
		},
		load : function(){
		},
		show : function(){
		},
		hide : function(){
		}
	}
}