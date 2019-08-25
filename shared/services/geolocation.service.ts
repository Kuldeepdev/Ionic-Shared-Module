import { Injectable } from '@angular/core';
//import { Diagnostic } from '@ionic-native/diagnostic/ngx';
import { LocationAccuracy } from '@ionic-native/location-accuracy/ngx';
import { Geolocation } from '@ionic-native/geolocation/ngx';

import { SharedService } from './shared.service';
@Injectable({
  providedIn: 'root'
})
export class GeolocationService {

  constructor(private locationAccuracy: LocationAccuracy, private geolocation: Geolocation, private ss: SharedService) {
  }
  locationRequest(): Promise<any>{
    return new Promise( (resolve, reject) => {
      this.locationAccuracy.canRequest().then((canRequest: boolean) => {
        //if (canRequest) {
          // the accuracy option will be ignored by iOS
          this.locationAccuracy.request(this.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY).then(
            () => {
              this.getCurrentPosition().then((location) => {
                resolve(location);
              }).catch((error) => {
                reject(error);
              });
            },
            error => {
              this.ss.showAlert("Error requesting location permissions", 'Try again', () => { this.locationRequest(); }, 'Cancel', () => { reject({erroCode: 1, message: 'Permissins not given.'}); });
          });
       // }
      }).catch((error) => { alert("Error CR"); } );
    });
  }
  getCurrentPosition(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.geolocation.getCurrentPosition().then((location) => {
        // resp.coords.latitude
        // resp.coords.longitude
        resolve(location);
       }).catch((error) => {
        reject({erroCode: 2, message: 'Geolocaion not working.'});
       });
    });
  }
}
