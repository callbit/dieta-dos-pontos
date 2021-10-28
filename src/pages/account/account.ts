import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform, AlertController, LoadingController } from 'ionic-angular';
import { DataProvider } from '../../providers/data/data';
import { ActivityLevels } from '../../app/app.config';
import { AuthProvider } from '../../providers/auth/auth';
import { SocialSharing } from '@ionic-native/social-sharing';
import { TrackerProvider } from '../../providers/tracker/tracker';
import { AppVersion } from '../../../node_modules/@ionic-native/app-version';

@IonicPage({
  priority: 'high'
})
@Component({
  selector: 'page-account',
  templateUrl: 'account.html',
})
export class AccountPage {

  navigator: any = navigator;

  public activityLevels = ActivityLevels;
  public shareable: boolean = true;
  public version: string;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public auth: AuthProvider,
    public data: DataProvider,
    private socialSharing: SocialSharing,
    private platform: Platform,
    private tracker: TrackerProvider,
    private appVersion: AppVersion,
    private alertCtrl: AlertController,
    private loadingCtrl: LoadingController,
  ) {
    if (this.platform.is('cordova')) {
      this.appVersion.getVersionNumber().then(version => {
        this.version = version;
      })
    } else {
      this.version = '1.0.0 DEBUG';
    }
  }

  ionViewDidEnter() {
    this.tracker.trackView('Conta');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AccountPage');
    if (!this.platform.is('cordova')) {
      console.log('nao cordova')
      if (this.navigator && this.navigator.share) {
        console.log('com share', this.navigator);
        this.shareable = true;
      } else {
        console.log('sem share', this.navigator);
        this.shareable = false;
      }
    } else {
      this.shareable = true;
    }

  }

  form() {
    this.navCtrl.push('AccountFormPage');
  }

  share() {
    //this.navCtrl.push('AccountFormPage');
    if (this.platform.is('cordova')) {
      this.socialSharing.shareWithOptions({
        chooserTitle: 'Compartilhar',
        subject: 'Dieta dos Pontos',
        message: 'Baixe agora o aplicativo Dieta dos Pontos e controle sua alimentação!',
        url: 'https://itunes.apple.com/br/app/dieta-dos-pontos/id733163337',
      })
    } else {
      if (this.navigator && this.navigator.share) {
        this.navigator.share({
          title: 'Dieta dos Pontos',
          text: 'Baixe agora o aplicativo Dieta dos Pontos e controle sua alimentação!',
          url: 'https://itunes.apple.com/br/app/dieta-dos-pontos/id733163337',
        })
      }
    }

  }

  password() {
    let alert = this.alertCtrl.create({
      title: 'Alterar senha',
      subTitle: 'Digite sua senha atual',
      inputs: [
        {
          name: 'oldPass',
          type: 'password',
          placeholder: 'Senha atual'
        },
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Ok',
          handler: data => {
            this.password2(data.oldPass)
          }
        }
      ]
    });
    alert.present();
  }

  password2(oldPass) {
    let alert = this.alertCtrl.create({
      title: 'Alterar senha',
      subTitle: 'Digite sua nova senha',
      inputs: [
        {
          name: 'newPass',
          type: 'password',
          placeholder: 'Nova senha'
        },
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Ok',
          handler: data => {
            this.password3(oldPass, data.newPass)
          }
        }
      ]
    });
    alert.present();
  }

  password3(oldPass, newPass) {
    let alert = this.alertCtrl.create({
      title: 'Alterar senha',
      subTitle: 'Digite sua nova senha novamente',
      inputs: [
        {
          name: 'confirmNewPass',
          type: 'password',
          placeholder: 'Confirmar nova senha'
        },
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Ok',
          handler: data => {
            this.onSubmit({
              oldPass, newPass, confirmNewPass: data.confirmNewPass
            })
          }
        }
      ]
    });
    alert.present();
  }

  onSubmit(data: any) {
    let submitLoading = this.loadingCtrl.create();
    submitLoading.present();
    console.log('valid', data);
    this.auth.changePass(data).subscribe((result) => {
      console.log('configPassword changePass', result);
      if (result.success) {
        submitLoading.dismiss();
        
        let successAlert = this.alertCtrl.create({
          title: 'Sucesso!',
          message: 'Sua senha foi alterada com sucesso. Faça seu login novamente.',
          buttons: [
            {
              text: 'Ok',
              handler: () => {
                console.log('volta para o login');
              }
            }
          ],
        });
        successAlert.onDidDismiss(() => {
          this.auth.logout().then(() => {
            this.navCtrl.parent.parent.setPages([{ page: 'LoginPage' }], { animate: true, direction: 'back' });
          });
        })
        successAlert.present();
      } else {
        
        submitLoading.dismiss();
        let errorMsg = (result !== undefined && result.data.message !== undefined) ? result.data.message : 'Dados inválidos, tente novamente.';
        let errorAlert = this.alertCtrl.create({
          title: 'Erro!',
          message: errorMsg,
          buttons: [
            {
              text: 'Ok',
              handler: () => {
                console.log('ok');
              }
            }
          ],
        })
        errorAlert.present();
      }
    }, () => {
      submitLoading.dismiss();

      let errorAlert = this.alertCtrl.create({
        title: 'Erro!',
        message: 'Dados inválidos, tente novamente.',
        buttons: [
          {
            text: 'Ok',
            handler: () => {
              console.log('ok');
            }
          }
        ],
      })
      errorAlert.present();
    });

  }

  contact() {
    window.open('mailto:suporte@callbit.com.br?Subject=Suporte Dieta dos Pontos', '_system');
  }

  logout() {
    this.auth.logout().then(() => {
      this.navCtrl.parent.parent.setPages([{ page: 'LoginPage' }], { animate: true, direction: 'back' });
    });
  }
}
