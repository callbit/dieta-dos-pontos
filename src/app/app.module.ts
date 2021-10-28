import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { SocialSharing } from '@ionic-native/social-sharing';
import { Network } from '@ionic-native/network';
import { HeaderColor } from '@ionic-native/header-color';
import { AdMobFree } from '@ionic-native/admob-free';
import { GoogleAnalytics } from '@ionic-native/google-analytics';
import { AppVersion } from '@ionic-native/app-version';

import { ComponentsModule } from '../components/components.module';
import { CalendarModule } from "ion2-calendar";
import { AuthProvider } from '../providers/auth/auth';
import { DataProvider } from '../providers/data/data';
import { ApiProvider } from '../providers/api/api';
import { HttpModule } from '@angular/http';
import { IonicStorageModule } from '@ionic/storage';
import { NgxModelModule } from 'ngx-model';
import { ReactiveFormsModule } from '@angular/forms';
import { SQLiteProvider } from '../providers/data/sqlite';
import { OfflineProvider } from '../providers/offline/offline';
import { TrackerProvider } from '../providers/tracker/tracker';

@NgModule({
  declarations: [
    MyApp,
  ],
  imports: [
    BrowserModule,
    HttpModule,
    IonicStorageModule.forRoot(),
    IonicModule.forRoot(MyApp, {
      preloadModules: true,
      backButtonText: ''
    }),
    NgxModelModule,
    CalendarModule,
    ComponentsModule,
    ReactiveFormsModule,
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
  ],
  providers: [
    StatusBar,
    SplashScreen,
    SocialSharing,
    Network,
    HeaderColor,
    AdMobFree,
    GoogleAnalytics,
    AppVersion,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    AuthProvider,
    DataProvider,
    SQLiteProvider,
    ApiProvider,
    OfflineProvider,
    TrackerProvider

  ]
})
export class AppModule { }
