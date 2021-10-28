import { Injectable } from '@angular/core';
import { GoogleAnalytics } from '@ionic-native/google-analytics';
import { Platform } from 'ionic-angular';

@Injectable()
export class TrackerProvider {

  constructor(
    private platform: Platform,
    private ga: GoogleAnalytics,
  ) {

  }

  init() {
    if (!this.platform.is('cordova')) {
      return;
    }
    //this.ga.debugMode();
    this.ga.startTrackerWithId('UA-97079358-1')
      .then(() => {
        console.log('Google analytics is ready now');
      })
      .catch(e => console.log('Error starting GoogleAnalytics', e));
  }

  trackView(view: string) {
    if (!this.platform.is('cordova')) {
      console.log('browser, track', view);
      return;
    }
    console.log('trackView', view);
    return this.ga.trackView(view);
  }

  trackEvent(category: string, action: string, label?: string, value?: number, newSession?: boolean) {
    if (!this.platform.is('cordova')) {
      console.log('browser, track', category, action, label, value);
      return;
    }
    console.log('trackEvent', category, action, label, value);
    return this.ga.trackEvent(category, action, label, value);
  }

  setUserId(id) {
    if (!this.platform.is('cordova')) {
      console.log('browser, setUserId', id);
      return;
    }
    return this.ga.setUserId(id);

  }

}
