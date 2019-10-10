import { Injectable } from '@angular/core';
import { Http, Response, RequestOptions, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import { AlertController, LoadingController, Platform, ToastController } from 'ionic-angular';
import { Observable } from 'rxjs/Rx';
import { Market } from '@ionic-native/market';
import { SocialSharing } from '@ionic-native/social-sharing';
import { AppRate } from '@ionic-native/app-rate';
import { AdMobFree, AdMobFreeBannerConfig, AdMobFreeInterstitialConfig, AdMobFreeRewardVideoConfig } from '@ionic-native/admob-free';
import { InAppBrowser } from '@ionic-native/in-app-browser';

@Injectable()
export class BasicProvider {
  
  public httpUrl = '';
  public httpsUrl = '';
  public imgUrl = "";
  public validation_msg = {};
  public loading;
  public alert;
  public appVersion = "8.0";
  public deviceType;
 // public alertTitle = '';
  public formLock: boolean = false;
  public commonData;
  public versionString="V0.1-1";
  public city_id = '';
  public deviceId = '';
  constructor(public http: Http, public platform: Platform, public alertCtrl: AlertController, public loadingController: LoadingController, private market: Market, private admobFree: AdMobFree, private socialSharing: SocialSharing, private appRate: AppRate, private iab: InAppBrowser, private toastCtrl: ToastController) {
    this.deviceType = this.platform.is('ios') ? 'i' : 'a';
    this.validation_msg = {
      'required': ' is required.',
      'pattern': ' not having valid pattern.',
      'minlength': ' not having minlength',
      'maxlength': ' not having maxlength'
    };
  }

  /*
     * Form lock Activate
     */
  public activateLock() {
    this.formLock = true;
  }

  /*
   * Form lock Deactivate
   */
  public deactivateLock() {
    this.formLock = false;
  }


  //Show General alert
  public showAlert(message, buttontxt = "OK", handler = () => {
  }, cancelButton: any = "", cancelHandler = () => {
  }, title = this.name) {
    let buttonsArr = [{
      text: buttontxt,
      handler: handler,
      cssClass: 'button-ios-orange1'
    }];

    if (cancelButton != "") {
      buttonsArr.push({
        text: cancelButton,
        handler: cancelHandler,
        cssClass: 'button-ios-orange1'
      });
    }
    message = message.replace(new RegExp('_', 'g'), " ");
    message = message.charAt(0).toUpperCase() + message.substr(1)
    this.alert = this.alertCtrl.create({
      title: title,
      subTitle: message,
      enableBackdropDismiss: false,
      buttons: buttonsArr
    });
    this.alert.present();
  }

  // Validation
  public validation(form, msg: any = '') {
    if (form.valid) {
      return true;
    }
    outer: for (const field in form.controls) {
      const control = form.get(field);
      if (control && (control.dirty || !control.valid)) {
        if (msg && msg[field]) {
          const messages = msg[field];
          for (const key in control.errors) {
            if (messages[key]) {
              this.showAlert(messages[key]);
            } else {
              if (this.validation_msg[key]) {
                this.showAlert(field + this.validation_msg[key]);
              } else {
                this.showAlert('Field have error:- ' + key);
              }
            }
            break outer;
          }
        } else {
          for (const key in control.errors) {
            const messages = this.validation_msg[key];
            if (messages) {
              this.showAlert(field + messages);
            } else {
              this.showAlert('Field have error:- ' + key);
            }
            break outer;
          }
        }
      }
    }
  }

  // Show loader
  public showLoader(content = '') {
    this.loading = this.loadingController.create({
      content: content
    });
    this.loading.present();
  }

  // Hide Loader
  public hideLoader() {
    if (this.loading != '' && this.loading != undefined) {
      this.loading.dismiss();
      this.loading = '';
    }
  }

  /*
     * 
     * Create Request Header
     */
  public createRequestOptions() {
    let header = new Headers();
    header.append("App-Version", this.appVersion);
    header.append("Device-Type", this.deviceType);
    header.append("Content-Type", "application/json"); 
    let options = new RequestOptions({ headers: header });
    return options;
  }

  /*
   * Get data from server
   */
  public hitApi(url: string, method: string, data, loader = true, header: boolean = false, httpUrl = this.httpUrl) {
    if (!this.formLock) {
      this.activateLock();
      if (loader == true) {
        this.showLoader();
      }

      let options: RequestOptions;
      if (header) {
        options = this.createRequestOptions();
      }
      console.log(options)
      if (method == 'POST') {
        return this.http.post(httpUrl + url, data, options)
          .map((res: Response) => this.successAPI(res))
          .catch((error: any) => this.errorAPI(error));
      } else if (method == 'GET') {
        return this.http.get(httpUrl + url + "?" + this.toQueryString(data), options)
          .map((res: Response) => this.successAPI(res))
          .catch((error: any) => this.errorAPI(error));
      }
    }
  }

  //Success Server Data
  public successAPI(res) {
    this.deactivateLock();
    this.hideLoader();
    return res.json();
  }

  //Error Server Data
  public errorAPI(error): Observable<any> {
    this.deactivateLock();
    this.hideLoader();
    if (error.status == 400) {
      return Observable.throw(400);
    } else if (error.status == 0) {
      this.showAlert('Network not found, Please check your connection.', 'OK', () => {
        return Observable.throw('Network not found, Please check your connection.');
      });
    } else if (error.status == 404) { 
      this.showAlert('New app version is available. Please update your app.', 'Update', () => {
        if(this.deviceType == 'i'){
          this.market.open('followmycal/id1183359559?mt=8');
        }else{
          this.market.open('com.sports.volleyball');
        }
      });
    }else {
      error = error.json();
      return Observable.throw(error.error || this.showAlert((error.replyMsg ? error.replyMsg : 'Server Error')));
    }
  }

  //Conver Data to query string
  public toQueryString(obj) {
    var parts = [];
    for (var i in obj) {
      if (obj.hasOwnProperty(i)) {
        parts.push(encodeURIComponent(i) + "=" + encodeURIComponent(obj[i]));
      }
    }
    return parts.join("&");
  }

  /*
   * Get image
   */
  public getImage(imgName: string, type: string, id = "") {
    switch (type) {
      case 'subcategory':
        return imgName != '' ? (this.imgUrl + 'uploads/categories/' + imgName) : '';
      case 'product':
        return imgName != '' ? (this.imgUrl + 'uploads/items/product_' + id + '/' + imgName) : '';
      case 'user':
        return imgName != '' ? (this.imgUrl + 'uploads/users/' + imgName) : './assets/no-user-icon-dark.png';
    }
  }

    //********LOCALSTORAGE************** */  
    set(key,value){
      window.localStorage[key] = value;
     }
   
     get(key,defaultValue){
      return window.localStorage[key] || defaultValue;
     }
   
     setObject(key,value){
      window.localStorage[key] = JSON.stringify(value);
     }
   
     getObject(key){
      return JSON.parse(window.localStorage[key] || '{}');
     }
   
     removeItem(key){
      window.localStorage.removeItem(key);
     }
   
     removeByIndex(index){
       window.localStorage.removeItem(window.localStorage.key(index));
     }
   
     clear(){
       window.localStorage.clear();
     }
   //********LOCALSTORAGE************* */ 

   timestampToDate(timestamp){
     return new Date(timestamp*1000).toString().split("GMT")[0];
   }

   updateVersion(){
    this.showAlert('New app version is available. Please update your app.', 'Update', () => {
      if(this.deviceType == 'i'){
        this.market.open('');// add app store url
      }else{
        this.market.open(this.appData.id);
      }
    });
   }

//************************ADMOB***************** */
 /**
 * @description
 * Show banner ads in footer.
 * @kind function 
 */
ConfigBanner(isShow = true) {
  const bannerConfig: AdMobFreeBannerConfig = {
     isTesting: false,
     autoShow: false,
     id : this.appData.admob.bannerId
   };
   this.admobFree.banner.config(bannerConfig);
   this.admobFree.banner.prepare()
   .then(() => {
      if(isShow){
        this.showBanner();
      } 
    })
   .catch(e =>{alert(JSON.stringify(e))});
}
showBanner(){
  this.admobFree.banner.show();
}
hideBanner(){
  this.admobFree.banner.hide();
}
/**
 * @description
 * Show Interstitial ads
 */
configInterstitial() {
  const interstitialConfig: AdMobFreeInterstitialConfig = {
     isTesting: false,
     autoShow: true,
     id : this.appData.admob.interstitialId
   };
   this.admobFree.interstitial.config(interstitialConfig);
   this.admobFree.interstitial.prepare()
   .then(() => {
    })
   .catch(e =>{alert(JSON.stringify(e))});
}
/**
 * @description
 * Show Rewarded video ads
 */
configRewarded() {
  const rewardedConfig: AdMobFreeRewardVideoConfig = {
     isTesting: false,
     autoShow: true,
     id : this.appData.admob.rewardedId
   };
   this.admobFree.rewardVideo.config(rewardedConfig);
   this.admobFree.rewardVideo.prepare()
   .then(() => {
    })
   .catch(e =>{alert(JSON.stringify(e))});
}

/**
 * @description
 * Social share
 */
  public socialShare(msg = this.appData.socialShare.msg, image = null, url =  this.appData.socialShare.url){
		this.socialSharing.share(msg, this.appData.socialShare.subject, image, url).then(() => {
		}).catch((error) => {
		  this.alert('Somthing went wrong.')
		});
  }
/**
 * @description
 * App rate
 */
  public appRating(){
    this.appRate.preferences.storeAppURL = {
      android: 'market://details?id='+this.appData.id
    };
    this.appRate.promptForRating(true);
  }
/*
   * openURL
   * Open browser link in inappbrowser 
   * @params:- link (required field having valid browser link)
   */
  public openURL(link) {
    this.iab.create(link);
}


/**
 * @description
 * Function to send push notification
 * @params:- data : push data
 */
  sendPush(data:any = {
    "deviceIds": this.deviceId,
    "page": "NewsPage",
    "message": "Checkout news",
    "params": {},
  }){
    data.apiKey = this.appData.pushApiKey;
    this.hitApi('sendPush.json', 'POST', data, false, false, this.appData.pushURL)
    .subscribe(success => {}, error => {})
  }

/**
 * Toast
 */
showToast(message = this.name, duration = 2000, position = 'bottom') {
  let toast = this.toastCtrl.create({
    message: message,
    duration: duration,
    position: position
  });

  toast.onDidDismiss(() => {
    console.log(message);
  });

  toast.present();
}
}