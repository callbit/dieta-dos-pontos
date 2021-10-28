import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController } from 'ionic-angular';
import { AuthProvider } from '../../providers/auth/auth';
import { FormGroup, FormControl } from '@angular/forms';
import { DataProvider } from '../../providers/data/data';
import { User } from '../../providers/data/interfaces';
import { ActivityLevels } from '../../app/app.config';
import { Subscription } from 'rxjs';
import { TrackerProvider } from '../../providers/tracker/tracker';

@IonicPage({
  priority: 'high'
})
@Component({
  selector: 'page-account-form',
  templateUrl: 'account-form.html',
})
export class AccountFormPage {

  public form: FormGroup;
  public activityLevels = ActivityLevels.filter(l => l !== '');
  public subUser$: Subscription;
  public online$: Subscription;
  public online: boolean;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private loadingCtrl: LoadingController,
    private auth: AuthProvider,
    public data: DataProvider,
    private tracker: TrackerProvider,
    private alertCtrl: AlertController,

  ) {
    this.buildForm();

    this.online$ = this.data.online$.subscribe((online) => {
      this.online = online;
    })
  }

  ionViewDidEnter() {
    this.tracker.trackView('Editar Conta');
  }

  ngOnDestroy() {
    this.subUser$.unsubscribe();
    this.online$.unsubscribe();
  }

  buildForm() {
    this.form = new FormGroup({
      name: new FormControl(),
      dob: new FormControl(),
      gender: new FormControl(),
      height: new FormControl(),
      weight: new FormControl(),
      activity_level: new FormControl(),
      email: new FormControl(),
    });

    this.subUser$ = this.data.user$.subscribe((data: User) => {
      console.log('user', data);
      if (data) {
        this.form.setValue({
          name: data.name ? data.name : '',
          dob: data.dob ? data.dob : '',
          gender: data.gender ? data.gender : '',
          height: data.height ? data.height : '',
          weight: data.weight ? data.weight : '',
          activity_level: data.activity_level ? data.activity_level : '',
          email: data.email ? data.email : '',
        })
      }
    })
  }

  offline() {
    const alert = this.alertCtrl.create({
      title: "Sem conexão com a internet!",
      message: 'Para atualizar seu perfil, você deve ter uma conexão com a internet.',
      buttons: ['Ok']
    });
    alert.present();
  }

  save() {

    if (!this.online) {
      return this.offline();
    }

    const loader = this.loadingCtrl.create();
    loader.present();
    console.log('save', this.form.value);
    this.auth.saveProfile(this.form.value).subscribe(() => {
      if (this.navParams.get('activate')) {
        loader.dismiss();

        this.auth.initApp();
      } else {
        this.auth.loadProfile().toPromise().then(() => {
          loader.dismiss();

          this.navCtrl.pop();
        });
      }
    }, () => {
      loader.dismiss();
    })
  }

}
