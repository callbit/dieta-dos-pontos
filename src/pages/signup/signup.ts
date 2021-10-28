import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController } from 'ionic-angular';
import { AuthProvider } from '../../providers/auth/auth';
import { FormGroup, FormControl, Validators } from '../../../node_modules/@angular/forms';
import { TrackerProvider } from '../../providers/tracker/tracker';
import { DataProvider } from '../../providers/data/data';
import { Subscription } from '../../../node_modules/rxjs';


@IonicPage({
  priority: 'high'
})
@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html',
})
export class SignupPage {

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
    this.tracker.trackView('Cadastre-se');
  }

  offline(action: string) {
    const alert = this.alertCtrl.create({
      title: "Sem conexão com a internet!",
      message: `Para ${action} você deve ter uma conexão com a internet.`,
      buttons: ['Ok']
    });
    alert.present();
  }

  buildForm() {
    this.form = new FormGroup({
      name: new FormControl('', Validators.required),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', Validators.required),
      password_repeat: new FormControl('', Validators.required),
    }, { validators: this.matchValidator });
  }

  matchValidator(group: FormGroup) {
    var valid = false;
    valid = group.controls['password'].value === group.controls['password_repeat'].value;
    console.log('matchValidator', group, valid)
    if (valid) {
      return null;
    }
    return { password_repeat: true };
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SignupPage');
  }

  login() {
    this.navCtrl.setPages([{ page: 'LoginPage' }], { animate: true, direction: 'forward' })
  }

  signup() {
    if (!this.online) {
      return this.offline('se cadastrar');
    }
    if (this.form.valid) {
      const loader = this.loadingCtrl.create();
      loader.present();
      console.log('save', this.form.value);
      this.auth.signup(this.form.value).subscribe((res) => {
        console.log('login signup', res);
        loader.dismiss();
        this.form.reset();
      }, (err) => {
        console.log('err', err);
        console.log('err', err.json());
        this.form.get('password').setValue('');
        loader.dismiss();
        const alert = this.alertCtrl.create({
          title: "Erro!",
          message: 'Preencha corretamente todos os campos e tente novamente.',
          buttons: ['Ok']
        });
        alert.present();
      })
    } else {
      if (this.form.errors && this.form.errors.password_repeat) {
        const alert = this.alertCtrl.create({
          title: "Erro!",
          message: 'A senha e confirmação da senha não conferem, tente novamente.',
          buttons: ['Ok']
        });
        alert.present();
        return;
      }
      if (this.form.controls['name'].errors) {
        const alert = this.alertCtrl.create({
          title: "Erro!",
          message: 'Preencha corretamente seu nome.',
          buttons: ['Ok']
        });
        alert.present();
        return;
      }
      if (this.form.controls['email'].errors) {
        const alert = this.alertCtrl.create({
          title: "Erro!",
          message: 'Preencha corretamente seu e-mail.',
          buttons: ['Ok']
        });
        alert.present();
        return;
      }
      if (this.form.controls['password'].errors) {
        const alert = this.alertCtrl.create({
          title: "Erro!",
          message: 'Preencha corretamente a senha.',
          buttons: ['Ok']
        });
        alert.present();
        return;
      }
      console.log(this.form);
    }
  }

}
