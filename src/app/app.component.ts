import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { AuthProvider } from '../providers/auth/auth';
import { OfflineProvider } from '../providers/offline/offline';
import { HeaderColor } from '../../node_modules/@ionic-native/header-color';
import { AdMobFree, AdMobFreeBannerConfig } from '@ionic-native/admob-free';
import { TrackerProvider } from '../providers/tracker/tracker';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {

  rootPage: any = 'LoginPage';

  constructor(
    private platform: Platform,
    private statusBar: StatusBar,
    private splashScreen: SplashScreen,
    private headerColor: HeaderColor,
    private auth: AuthProvider,
    private offline: OfflineProvider,
    private admobFree: AdMobFree,
    private tracker: TrackerProvider,
  ) {
    this.platform.ready().then(() => {
      this.statusBar.backgroundColorByHexString('#13856d');
      this.headerColor.tint('#16967b');
      this.splashScreen.hide();
      this.offline.initCheck();
      this.auth.initialCheck();
      this.tracker.init();

      const bannerConfig: AdMobFreeBannerConfig = { isTesting: false, autoShow: true, id: 'ca-app-pub-4209051732571838/1078412024' };
      this.admobFree.banner.config(bannerConfig);

      this.admobFree.banner.prepare()
        .then(() => { })
        .catch(e => console.log(e));


    });
  }
}
