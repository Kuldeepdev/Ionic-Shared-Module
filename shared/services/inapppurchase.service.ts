import { Injectable } from "@angular/core";
import { InAppPurchase } from "@ionic-native/in-app-purchase/ngx";

import { SharedService } from '../services/shared.service';
@Injectable({
  providedIn: "root"
})
export class InapppurchaseService {
  constructor(private iap: InAppPurchase, private ss: SharedService) {}
  buy(transactiontype = 'com.demo.monthly', plan_type, amount ) {
    this.iap.getProducts([transactiontype]).then(products => {
      this.iap.buy(transactiontype).then((data: any) => {
        this.ss.hitApi('subscribeuser', 'POST', {
          amount: amount,
          plan_type: plan_type,
          devicetype: this.ss.deviceType,
          transaction_id: data.transactionId,
          receipt: JSON.stringify({
            data: data.receipt,
            signature: data.signature
          })
        }).subscribe(( result: any) => {
          localStorage.setItem('subscribe', '1');
        });
        return this.iap.consume(data.type, data.receipt, data.signature);
      });
    });
  }
}
