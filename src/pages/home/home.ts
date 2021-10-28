import { Component } from '@angular/core';
import { NavController, ModalController, IonicPage, Refresher } from 'ionic-angular';
import { CalendarModal, CalendarModalOptions, CalendarResult } from "ion2-calendar";
import * as moment from 'moment';
import { DataProvider } from '../../providers/data/data';
import { Meal } from '../../providers/data/interfaces';
import { Subscription } from 'rxjs';
import { TrackerProvider } from '../../providers/tracker/tracker';

@IonicPage({
  priority: 'high'
})
@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})
export class HomePage {

  today: string = moment().format('YYYY-MM-DD');
  selectedDate: string = this.today;
  subDate$: Subscription;

  constructor(
    private navCtrl: NavController,
    private modalCtrl: ModalController,
    public data: DataProvider,
    private tracker: TrackerProvider,
  ) {
    moment.locale('pt-br');
    this.subDate$ = this.data.date$.subscribe((date) => {
      this.selectedDate = date;
    })
  }

  ionViewDidEnter(){
    this.tracker.trackView('Diário');
  }

  ngOnDestroy() {
    this.subDate$.unsubscribe();
  }

  openCalendar() {
    const options: CalendarModalOptions = {
      title: 'Escolha a data',
      canBackwardsSelected: true,
      defaultDate: this.selectedDate,
      monthFormat: 'MMM YYYY',
      weekdays: ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'],
      closeLabel: 'Cancelar',
      autoDone: true,
      closeIcon: true,
    };
    let calendar = this.modalCtrl.create(CalendarModal, {
      options: options
    });

    calendar.present();
    calendar.onDidDismiss((date: CalendarResult, type: string) => {
      if (date && date.string) {
        this.data.setDate(date.string);
      }
    })
  }

  meals(meal: Meal) {
    this.navCtrl.push('MealsPage', { meal, date: this.selectedDate });
    //const modal = this.modalCtrl.create('MealsPage', { meal, date: this.selectedDate });
    //modal.present();
  }

  doRefresh(refresher: Refresher) {
    this.data.sync().then(() => {
      refresher.complete();
    }).catch(() => {
      refresher.complete();
    });
  }


}
