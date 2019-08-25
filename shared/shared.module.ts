import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';

import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Market } from '@ionic-native/market/ngx';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { AppRate } from '@ionic-native/app-rate/ngx';
import { FCM } from '@ionic-native/fcm/ngx';
import { AdMobFree } from "@ionic-native/admob-free/ngx";
import { InAppPurchase } from '@ionic-native/in-app-purchase/ngx';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { Camera } from '@ionic-native/camera/ngx';
//import { Diagnostic } from '@ionic-native/diagnostic/ngx';
import { LocationAccuracy } from '@ionic-native/location-accuracy/ngx';
import { Geolocation } from '@ionic-native/geolocation/ngx';

import { SharedService } from './services/shared.service';
import { ApiInterceptorService } from './services/api-interceptor.service';
import { CameraService } from './services/camera.service';
import { GeolocationService } from './services/geolocation.service';

import { CategorylistComponent } from './components/categorylist/categorylist.component';
import { ItemlistComponent } from './components/itemlist/itemlist.component';
import { ItemskeletonComponent } from './components/itemskeleton/itemskeleton.component';
import { SearchlistComponent } from './components/searchlist/searchlist.component';

@NgModule({
  declarations: [
    CategorylistComponent,
    ItemlistComponent,
    ItemskeletonComponent,
    SearchlistComponent
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Market,
    SocialSharing,
    AppRate,
    FCM,
    AdMobFree,
    InAppPurchase,
    InAppBrowser,
    Camera,
    //Diagnostic,
    LocationAccuracy,
    Geolocation,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ApiInterceptorService,
      multi: true
    },
    CameraService,
    GeolocationService
  ],
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    RouterModule,
    HttpClientModule
  ],
  exports: [
    CommonModule,
    FormsModule,
    CategorylistComponent,
    ItemlistComponent,
    ItemskeletonComponent,
    SearchlistComponent
  ]
})
export class SharedModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: SharedModule,
      providers: [ SharedService ]
    }
  }
}
// ionic cordova plugin add cordova-plugin-market && npm install @ionic-native/market && ionic cordova plugin add cordova-plugin-x-socialsharing && npm install @ionic-native/social-sharing && ionic cordova plugin add cordova-plugin-apprate &&  npm install @ionic-native/app-rate && ionic cordova plugin add cordova-plugin-fcm-with-dependecy-updated && npm install @ionic-native/fcm && ionic cordova plugin add cordova-plugin-inappbrowser && npm install @ionic-native/in-app-browser && ionic cordova plugin add cordova-plugin-camera && npm install @ionic-native/camera
//ionic cordova plugin add cordova-plugin-inapppurchase && npm install @ionic-native/in-app-purchase
// cordova plugin add cordova-plugin-admob-free --save --variable ADMOB_APP_ID="ca-app-pub-xx~xx" && npm install @ionic-native/admob-free
//ionic cordova plugin add cordova-plugin-request-location-accuracy && npm install @ionic-native/location-accuracy && ionic cordova plugin add cordova-plugin-geolocation && npm install @ionic-native/geolocation
