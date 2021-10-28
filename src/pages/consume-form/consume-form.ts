import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, AlertController } from 'ionic-angular';
import { Food, Meal } from '../../providers/data/interfaces';
import { DataProvider } from '../../providers/data/data';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { TrackerProvider } from '../../providers/tracker/tracker';

@IonicPage({
  priority: 'high'
})
@Component({
  selector: 'page-consume-form',
  templateUrl: 'consume-form.html',
})
export class ConsumeFormPage {

  public food: Food;
  public parent: Food | false;
  public form: FormGroup;
  public meal: Meal;
  subDate$: Subscription;

  constructor(
    private viewCtrl: ViewController,
    private navCtrl: NavController,
    private navParams: NavParams,
    private data: DataProvider,
    private alertCtrl: AlertController,
    private tracker: TrackerProvider,

  ) {
    this.food = this.navParams.get('food');
    this.parent = this.navParams.get('parent');
    this.meal = this.navParams.get('meal');

    this.buildForm();

  }

  ionViewDidEnter(){
    this.tracker.trackView('Adicionar consumo');
  }

  buildForm() {
    this.form = new FormGroup({
      meal_id: new FormControl((this.meal) ? this.meal.id : null, Validators.required),
      food_id: new FormControl((this.food) ? this.food.id : null, Validators.required),
      quantity: new FormControl(1, Validators.required),
      date: new FormControl(),
    });

    this.subDate$ = this.data.date$.subscribe((date) => {
      this.form.get('date').setValue(date);
    })
  }

  ngOnDestroy() {
    this.subDate$.unsubscribe();
  }

  save() {
    const data = this.form.value;
    data.quantity = parseInt(data.quantity);
    console.log('save', data);
    if (this.form.valid) {
      this.data.saveConsume(data);
      this.form.reset();
      this.navCtrl.popAll();
    } else {
      const alert = this.alertCtrl.create({
        title: 'Erro!',
        message: 'Preencha todos os campos e tente novamente.',
        buttons: ['Ok']
      });
      alert.present();
    }
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

  changeQuantity(delta?: number) {
    const input = this.form.get('quantity');
    const inputValue = input.value;
    const value = Number(inputValue + delta);
    input.setValue((value >= 1) ? value : 1);
  }

  /*(save() {
    const alert = this.alertCtrl.create({
      title: "Alimento adicionado",
      message: "Você tem mais 10 pontos para consumir hoje.",
      buttons: [
        {
          text: 'Ok', handler: () => {
            this.data.saveConsume()
            this.navCtrl.popAll();
          }
        }
      ]
    })
    alert.present();
  }*/
}
