import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController } from 'ionic-angular';
import { AuthProvider } from '../../providers/auth/auth';
import { FormGroup, FormControl } from '../../../node_modules/@angular/forms';
import { TrackerProvider } from '../../providers/tracker/tracker';
import { DataProvider } from '../../providers/data/data';
import { Subscription } from '../../../node_modules/rxjs';

@IonicPage({
  priority: 'high'
})
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  public form: FormGroup;
  public online$: Subscription;
  public online: boolean;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private auth: AuthProvider,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    private tracker: TrackerProvider,
    public data: DataProvider,

  ) {
    this.online$ = this.data.online$.subscribe((online) => {
      this.online = online;
    })
    this.buildForm();
  }

  ionViewDidEnter() {
    this.tracker.trackView('Login');
  }

  buildForm() {
    this.form = new FormGroup({
      email: new FormControl(''),
      password: new FormControl(''),
    });
  }

  signup() {
    this.navCtrl.setPages([{ page: 'SignupPage' }], { animate: true, direction: 'forward' })
  }

  offline(action: string) {
    const alert = this.alertCtrl.create({
      title: "Sem conexão com a internet!",
      message: `Para ${action} você deve ter uma conexão com a internet.`,
      buttons: ['Ok']
    });
    alert.present();
  }

  login() {
    if (!this.online) {
      return this.offline('efetuar o login');
    }
    if (this.form.valid) {
      const loader = this.loadingCtrl.create();
      loader.present();
      console.log('save', this.form.getRawValue());
      this.auth.authenticate(this.form.value).subscribe((res) => {
        console.log('login auth', res);
        loader.dismiss();
        this.form.reset();
      }, (err) => {
        const result = err.json();
        console.log('err', );
        this.form.get('password').setValue('');
        loader.dismiss();
        const message = result.message ? result.message : 'Impossível efetuar o login! Tente novamente.'
        const alert = this.alertCtrl.create({
          title: "Erro!",
          message,
          buttons: ['Ok']
        });
        alert.present();
      })
    }
  }

  forgot() {
    if (!this.online) {
      return this.offline('recuperar sua senha');
    }
    const prompt = this.alertCtrl.create({
      title: 'Esqueceu sua senha?',
      message: "Preencha seu e-mail que lhe enviaremos um link para recuperá-la.",
      inputs: [
        { name: 'email', placeholder: 'E-mail' },
      ],
      buttons: [
        { text: 'Cancelar' },
        {
          text: 'Enviar',
          handler: data => {
            const loader = this.loadingCtrl.create();
            loader.present();
            this.auth.resetPassword({ email: data.email }).subscribe((res) => {
              loader.dismiss();
              const alert = this.alertCtrl.create({ title: "E-mail enviado!", message: "Verifique seu e-mail para recuperar sua conta.", buttons: ['OK'] })
              alert.present();
            }, () => {
              const alert = this.alertCtrl.create({ title: "Erro..", message: "Verifique seu e-mail e tente novamente!", buttons: ['OK'] })
              alert.present();
              loader.dismiss();
            });

            console.log('Saved clicked');
          }
        }
      ]
    });
    prompt.present();
  }

}
