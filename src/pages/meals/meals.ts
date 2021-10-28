import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, ActionSheetController } from 'ionic-angular';
import { DataProvider } from '../../providers/data/data';
import { Meal, Consume } from '../../providers/data/interfaces';
import { TrackerProvider } from '../../providers/tracker/tracker';

@IonicPage({
  priority: 'high'
})
@Component({
  selector: 'page-meals',
  templateUrl: 'meals.html',
})
export class MealsPage {

  meal: Meal;
  date: string;
  consumes: Consume[];

  constructor(
    private navCtrl: NavController,
    private modalCtrl: ModalController,
    private navParams: NavParams,
    private data: DataProvider,
    private actionSheetCtrl: ActionSheetController,
    private tracker: TrackerProvider,
  ) {
    this.meal = this.navParams.get('meal');
    this.date = this.navParams.get('date');
  }

  ionViewDidEnter(){
    this.tracker.trackView('Refeição');

    this.data.selectMeal(this.meal ? this.meal : null)
  }

  dismiss() {
    console.log(this.navCtrl.getViews())
    this.navCtrl.pop();
  }

  ionViewDidLeave() {
    this.data.selectMeal(null)
  }

  openConsume() {
    /*const firstView = this.navCtrl.getViews()[0];
    if (firstView._cmp.componentType.name === 'ModalCmp') {
      console.log('aqui');
      this.navCtrl.setPages([{ page: 'MealsPage', params: { meal: this.meal, date: this.date } }], { animate: false }).then(() => {
        this.navCtrl.setPages([{ page: 'ConsumePage', params: { meal: this.meal, date: this.date } }], { animate: true, direction: 'forward' });
      });
    } else {
      this.navCtrl.setPages([{ page: 'ConsumePage', params: { meal: this.meal, date: this.date } }], { animate: true, direction: 'forward' });
    }*/
    const modal = this.modalCtrl.create('ConsumePage', { meal: this.meal, date: this.date });
    modal.present();

  }

  openActions(consume: Consume) {
    const actionSheet = this.actionSheetCtrl.create({
      title: 'Deseja remover?',
      buttons: [
        {
          text: 'Remover',
          role: 'destructive',
          handler: () => {
            console.log('Destructive clicked');
            this.data.removeConsume(consume);
          }
        },
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]
    })
    actionSheet.present();

  }

}
