import { Component } from '@angular/core';
import { ModalController, IonicPage } from 'ionic-angular';
import { DataProvider } from '../../providers/data/data';

@IonicPage({
  priority: 'high'
})
@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = 'HomePage';
  tab2Root = 'HomePage';
  tab3Root = 'AccountPage';

  constructor(
    private modalCtrl: ModalController,
    private data: DataProvider,
  ) {

  }

  openConsume() {
    this.data.date$.take(1).subscribe((date) => {
      let modal = this.modalCtrl.create('ConsumePage', { date });
      modal.onDidDismiss((data) => {
        console.log(data);
      })
      modal.present();
    })


  }

}
