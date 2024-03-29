import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { AlertController, LoadingController, Platform, ToastController } from '@ionic/angular';
import { Router } from '@angular/router';

import { Market } from '@ionic-native/market/ngx';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { AppRate } from '@ionic-native/app-rate/ngx';
import { FCM } from '@ionic-native/fcm/ngx';
import { AdMobFree, AdMobFreeBannerConfig, AdMobFreeInterstitialConfig } from "@ionic-native/admob-free/ngx";
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';

import { User } from '../../modals/user';
import { environment } from '../../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class SharedService {
  public environment = environment;
  public user: User;
  public loading;
  deviceType = 'android';

  public alert;
  constructor(private http: HttpClient, private loadingController: LoadingController, public alertCtrl: AlertController, public toastController: ToastController, private market: Market, private socialSharing: SocialSharing, private appRate: AppRate, private fcm: FCM, private admobFree: AdMobFree,  private router: Router,  private platform: Platform, private iab: InAppBrowser) {
    this.user = new User({isFirstTime: false});
    this.deviceType = this.platform.is('android') ? 'android' : 'ios';
  }
/**
 * @method showLoader
 * @param messageParam message string
 */
  public showLoader(messageParam = '') {
    this.loadingController.create({
       message: messageParam,
       translucent: true,
       cssClass: 'custom-class custom-loading'
     }).then((loading) => {
       this.loading = loading;
       this.loading.present();
     });
   }
/**
 * @method hideLoader
 */
   public hideLoader() {
     if (this.loading !== '' && this.loading !== undefined) {
       this.loading.dismiss();
       this.loading = '';
     }
   }
/**
 * @method showAlert
 * @description Show General alert
 */
public showAlert(messagealert: string, buttontxt = 'OK', handlerFun = () => {}, cancelButton: any = "", cancelHandler = () => {}, title = environment.name) {
  const buttonsArr = [{
    text: buttontxt,
    handler: handlerFun,
    cssClass: 'button-ios-orange1'
  }];

  if (cancelButton !== "") {
    buttonsArr.push({
      text: cancelButton,
      handler: cancelHandler,
      cssClass: 'button-ios-orange1'
    });
  }
  messagealert = messagealert.replace(new RegExp('_', 'g'), ' ');
  messagealert = messagealert.charAt(0).toUpperCase() + messagealert.substr(1);
  this.alertCtrl.create({
    header: title,
    message: messagealert,
    buttons: buttonsArr,
    backdropDismiss: false
  }).then((alert) => {
    alert.present();
  });
}
/**
 * @method presentToast
 * @param msg message
 * @param durationShow time
 */
async presentToast(msg, durationShow = 2000) {
  const toast = await this.toastController.create({
    message: msg,
    duration: durationShow,
    position: "bottom"
  });
  toast.present();
}
/**
 * @method updateVersion
 */
/**
 * @method hitApi
 * @description Get data form server
 * @param url url of api after base URL
 * @param method GET/POST
 * @param data []
 * @param loaderShow Default : 'true' | show loading
 * @param headerAdd  Default : false | add header in aip
 * @param httpUrl Default : environment.APIBASEURL | if need to hit app to other server
 */
public hitApi(url: string, method: string = 'GET', data: any = {}, loaderShow = 'true', headerAdd = 'false', httpUrl = environment.APIBASEURL) {
  if (method === 'POST') {
    return  this.http.post(environment.APIBASEURL + url, data, {params: {loader: loaderShow, header: headerAdd}}).pipe(
      map(results => results)
    );
  } else if (method === 'GET') {
    return this.http.get(environment.APIBASEURL + url + "?" + this.toQueryString(data), {params: {loader: loaderShow, header: headerAdd}}).pipe(
      map(results => results)
    );
  }
}
/**
 * @method toQueryString
 * @description convert object to query string
 * @param obj object
 */
  public toQueryString(obj) {
    let parts = [];
    for (let i in obj) {
      if (obj.hasOwnProperty(i)) {
        parts.push(encodeURIComponent(i) + "=" + encodeURIComponent(obj[i]));
      }
    }
    return parts.join("&");
  }
updateVersion() {
  this.showAlert('New app version is available. Please update your app.', 'Update', () => {
    if (this.deviceType === 'i') {
      this.market.open(''); // add app store url
    } else {
      this.market.open(environment.packageId);
    }
  });
 }
/**
 * @method share
 * @param message share message
 * @param subject share subject
 * @param file    share image
 * @param url     share url
 */
 public share(message?: string, subject?: string, file?: string | string[], url: string = environment.playStoreURL) {
    this.socialSharing.share(message, subject, null, url).then(() => {
    }).catch((error) => {
    });
 }
/**
 * @method rateApp
 * @description use to rate app
 */
 rateApp() {
  this.appRate.preferences = {
    storeAppURL: {
      ios: '849930087',
      android: environment.ratePlayStoreURL
    },
    usesUntilPrompt: 2,
    customLocale: {
      title: 'Rate Us... Pretty Please?',
      message: 'We value your feedback! Please take a moment to tell us how we\'re doing',
      cancelButtonLabel: 'Pass',
      rateButtonLabel: 'Rate it!',
      laterButtonLabel: 'Ask Later',
      appRatePromptTitle: 'Do you like this app?',
      yesButtonLabel: 'Yes',
      noButtonLabel: 'No'
    }
  };
  this.appRate.promptForRating(true);
}

 public errorHandal(error, event = null) {
  if (error.status === 404) {
    this.showAlert((error.replyMsg ? error.replyMsg : 'Server Error'), 'OK');
  } else if (error.status === 500 || error.status === 401) {
      error = error.json();
      this.showAlert((error.reply ? error.reply : error.replyMsg ? error.replyMsg : 'Server Error'), 'OK');
  } else if (error.status === 0) {
      //this.showAlert('Network not found, Please check your connection.', 'OK');
  } else if (error.error.data.status === 400) {
    event.target.complete();
    event.target.disabled = true;
  }
 }

  public configFCM() {
    this.fcm.getToken().then(token => {
      console.log("fcm token " + token);
      if (token) {
        //this.user.api.devicetoekn =  token;
        // alert(token)
      }
    });

    this.fcm.onNotification().subscribe(data => {
      console.log("onNotification " + JSON.stringify(data));
      if (data.wasTapped) {
        setTimeout(() => {
          this.router.navigateByUrl("/home");
        }, 2000);

        console.log("Received in background");
      } else {
        this.router.navigateByUrl("/home");
        let message = "";
        if (this.deviceType === 'android') {
          message = data.aps.alert.body;
        } else {
          message = data.body != undefined ? data.body : data.notification.body;
        }
        // this.user.api.populateAlert('', message, 'Ok', () => {

        // } );
        console.log("Received in foreground");
      }
    });

    this.fcm.onTokenRefresh().subscribe(token => {
      console.log("fcm token onTokenRefresh " + token);
      if (token) {
        //this.user.api.devicetoekn =  token;
      }
    });
  }
/**
 * @method iabOpen
 */
  iabOpen(url: string) {
    this.iab.create(url);
  }
/**
 * @method showBanner
 * @description show admob banner
 */
 showBanner() {
  const bannerConfig: AdMobFreeBannerConfig = {
    isTesting: false,
    autoShow: false,
    id: environment.admob.banner
  };
  this.admobFree.banner.config(bannerConfig);
  this.admobFree.banner
    .prepare()
    .then(() => {
      this.admobFree.banner.show();
    })
    .catch(e => console.log(e));
}

/**
 * @description
 * Show Interstitial ads
 */
configInterstitial() {
  this.admobFree.interstitial
    .isReady()
    .then(success => {
      if (success) {
        this.admobFree.interstitial.show();
      } else {
        const interstitialConfig: AdMobFreeInterstitialConfig = {
          isTesting: false,
          autoShow: false,
          id: environment.admob.interstitial
        };
        this.admobFree.interstitial.config(interstitialConfig);
        this.admobFree.interstitial
          .prepare()
          .then(() => {})
          .catch(e => {
            console.log(JSON.stringify(e));
          });
      }
    })
    .catch(e => {
      console.log(JSON.stringify(e));
    });
}
}
