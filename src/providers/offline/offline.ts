import { Injectable } from '@angular/core';
import { Network } from '@ionic-native/network';
import { Platform } from 'ionic-angular';
import { DataProvider } from '../data/data';

@Injectable()
export class OfflineProvider {

  constructor(
    private network: Network,
    private platform: Platform,
    private data: DataProvider,
  ) {

  }

  initCheck() {
    this.platform.is('cordova') ? this.networkCordova() : this.networkBrowser();
  }

  networkCordova() {
    console.log('networkCordova');
    (navigator.onLine) ? this.isOnline() : this.isOffline();
    this.network.onchange().subscribe((evt: Event) => {
      (evt.type === 'online') ? this.isOnline() : this.isOffline();
    })
  }

  networkBrowser() {
    console.log('networkBrowser');
    (navigator.onLine) ? this.isOnline() : this.isOffline();
    window.addEventListener("online", () => this.isOnline(), false);
    window.addEventListener("offline", () => this.isOffline(), false);
  }

  isOnline() {
    console.log('isOnline');
    this.data.setOnline(true);
    this.data.sync();
  }

  isOffline() {
    console.log('isOffline');
    this.data.setOnline(false);
  }

}
