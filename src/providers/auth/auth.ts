import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { LoadingController, App, Nav, NavController, Loading } from 'ionic-angular';
import { ApiProvider } from '../api/api';
import { Observable } from 'rxjs';
import { DataProvider } from '../data/data';
import { User } from '../data/interfaces';
import { TrackerProvider } from '../tracker/tracker';

@Injectable()
export class AuthProvider {

  public loader: Loading;

  constructor(
    private api: ApiProvider,
    private storage: Storage,
    private loadingCtrl: LoadingController,
    private app: App,
    private data: DataProvider,
    private tracker: TrackerProvider
  ) { }

  initialCheck() {
    this.loader = this.loadingCtrl.create();
    this.loader.present();
    return this.getToken().toPromise().then((token) => {
      if (token) {
        this.api.setToken(token);
        this.initApp();
      } else {
        this.loader.dismiss();
      }
    })
  }

  initApp() {
    return this.loadProfile().take(1).subscribe((res) => {
      this.loader.dismiss();
      console.log('initialCheck profile', res);
      this.tracker.setUserId(res.user.id);
      if (res) {
        const nav: NavController = this.app.getActiveNavs()[0];
        console.log('isValidProfile', this.isValidProfile(res.user))
        if (this.isValidProfile(res.user)) {
          this.data.sync();
          return nav.setPages([{ page: 'TabsPage' }], { animate: true, direction: 'forward' }).then(() => res);
        } else {
          return nav.setPages([{ page: 'AccountFormPage', params: { activate: true } }], { animate: true, direction: 'forward' }).then(() => false);
        }
      }
      return false;
    }, (err) => {
      console.log('no profile, should error')
      this.loader.dismiss();
    })
  }

  isValidProfile(user: User) {
    return (
      user.name !== '' &&
      user.email !== '' &&
      user.dob !== null &&
      user.activity_level !== null && user.activity_level > 0 &&
      user.weight !== null && user.weight > 0 &&
      user.height !== null && user.height > 0
    );
  }

  authenticate(credentials): Observable<string> {

    let data = {
      'email': credentials.email,
      'password': credentials.password
    };

    return this.api.post('users/token.json', {}, data)
      .map((response) => response.json())
      .map((data) => data.data.token)
      .map((token) => {
        this.api.setToken(token);
        return this.storeToken(token).then(() => token).then(() => {
          return this.initApp();
        })
      })
      .catch((err) => {
        this.tracker.trackEvent('Autenticação', 'Login', 'Login e senha errado')
        return err;
      })
      .catch(error => Observable.throw(error));
  }

  getToken(): Observable<string> {
    console.log('getToken', )
    return Observable.fromPromise(this.storage.get('api_token'));
  }

  storeToken(token) {
    console.log('storageToken', token);
    return this.storage.set('api_token', token);
  }

  removeToken() {
    return this.storage.clear();
  }

  loadProfile(): Observable<any> {
    return this.api.get('users/profile.json', {})
      .map(response => response.json())
      .map(response => {
        if (response && response.data && response.data.user) {
          console.log('loadProfile', response);
          this.data.setUser(response.data.user);
        }
        return response.data
      })
      .catch(error => {
        console.log('err', error)
        this.logout();
        return Observable.throw(error)
      });
  }

  saveProfile(data: any): Observable<any> {
    return this.api.post('users/profile.json', null, data)
      .map(response => response.json());
  }


  changeName(data: any): Observable<any> {
    return this.api.post('users' + '/changeName.json', null, data)
      .map(response => response.json());
  }

  sendVerify(data: any): Observable<any> {
    console.log('sendVerify', data);
    return this.api.post('users' + '/sendVerify.json', null, data)
      .map(response => response.json())
  }

  changePass(data: any): Observable<any> {
    return this.api.post('users' + '/changePassword.json', null, data)
      .map(response => response.json())
      .catch((err) => {
        this.tracker.trackEvent('Cadastro', 'Troca Senha', 'Login e senha errado')
        return err;
      });
  }

  resetPassword(data: any): Observable<any> {
    return this.api.post('users' + '/recover-password.json', null, data)
      .map(response => response.json());
  }

  signup(formData: { name: string, email: string, password: string, password_repeat: string }) {
    return this.api.post('users/add.json', null, {
      name: formData.name,
      email: formData.email,
      password: formData.password,
      password_repeat: formData.password_repeat,
    })
      .map(res => res.json())
      .map((data) => data.data.token)
      .map((token) => {
        this.api.setToken(token);
        return this.storeToken(token).then(() => token).then(() => {
          return this.initApp();
        })
      })
      .catch((err) => {
        this.tracker.trackEvent('Cadastro', 'Novo Usuário', 'Cadastro inválido')
        return err;
      })

  }

  /*ggSignup(formData: any) {
    let request = this.api.post('users/addGg.json', {}, formData)
    .map(res => res.json())
    .map((data) => data.data.token)
    .catch(error => Observable.throw(error));
    return request;
  }

  fbSignup(formData: any) {
    let request = this.api.post('users/addFb.json', {}, formData)
    .map(res => res.json())
    .map((data) => data.data.token)
    .catch(error => Observable.throw(error));
    return request;
  }*/

  logout() {
    console.log('logout')
    let loader = this.loadingCtrl.create();
    loader.present();
    this.data.setUser(null);
    this.api.setToken(null);
    return this.removeToken().then(() => {
      return loader.dismiss();


    })
  }


}
