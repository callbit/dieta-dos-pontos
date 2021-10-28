import { Component, ViewChild } from '@angular/core';
import { IonicPage, ViewController, NavController, NavParams, Searchbar } from 'ionic-angular';
import { Food, Meal } from '../../providers/data/interfaces';
import { DataProvider } from '../../providers/data/data';
import { TrackerProvider } from '../../providers/tracker/tracker';

@IonicPage({
  priority: 'high'
})
@Component({
  selector: 'page-consume',
  templateUrl: 'consume.html',
})
export class ConsumePage {

  public meal: Meal;
  public food: Food;
  public foods: Food[] = [];
  public parent: Food;
  public date: string;
  public listOpen: boolean = false;
  public isLoading: boolean = true;

  // Search
  @ViewChild('searchInput') searchInput: Searchbar;
  public searchTerm: string = "";
  public searchEnabled: boolean = false;

  constructor(
    private viewCtrl: ViewController,
    private navCtrl: NavController,
    private navParams: NavParams,
    public data: DataProvider,
    private tracker: TrackerProvider,

  ) {
    this.meal = this.navParams.get('meal');
    this.food = this.navParams.get('food');
    this.parent = this.navParams.get('parent');
    this.date = this.navParams.get('date');
    const searchTerm = this.navParams.get('searchTerm');
    this.searchTerm = (searchTerm) ? searchTerm : '';


  }

  searchUpdate(evt){
    console.log('search update')
    this.updateData();
  }

  updateData() {
    this.isLoading = true;
    console.log('data loading');
    this.data.foodsTree$(this.food, this.searchTerm).take(1).subscribe((data) => {
      console.log('data updated');
      setTimeout(() => {
        this.isLoading = false;
        this.foods = data;
        window.dispatchEvent(new window['Event']('resize'))
      }, 100)
     
    })
  }

  ionViewDidEnter() {
    this.tracker.trackView('Selecione o alimento');
    this.updateData();
  }

  dismiss() {
    if (this.food && this.food.id) {

      this.navCtrl.setPages([{
        page: 'ConsumePage',
        params: {
          food: this.parent,
          meal: this.meal,
          date: this.date,
          searchTerm: this.searchTerm
        }
      }], { animate: true, direction: 'back' });
    } else {

      this.viewCtrl.dismiss();
    }
  }

  openConsume(food: Food) {
    if (food.children && food.children.length > 0) {
      const firstView = this.navCtrl.getViews()[0];
      if (firstView._cmp.componentType.name === 'ModalCmp') {
        this.navCtrl.setPages([{
          page: 'ConsumePage',
          params: {
            food: this.food,
            parent: this.parent,
            meal: this.meal,
            date: this.date,
            searchTerm: this.searchTerm
          }
        }], { animate: false }).then(() => {
          this.openNewConsume(food);
        });
      } else {
        this.openNewConsume(food);
      }
    } else {
      this.navCtrl.push('ConsumeFormPage', { food, parent: this.food, meal: this.meal, date: this.date });
    }
  }

  openNewConsume(food: Food) {
    if (food.children.length === 1) {
      this.navCtrl.push('ConsumeFormPage', { food: food.children[0], parent: food, meal: this.meal, date: this.date });
    } else {
      this.navCtrl.setPages([{
        page: 'ConsumePage',
        params: {
          parent: this.food,
          food,
          meal: this.meal,
          date: this.date,
          searchTerm: this.searchTerm
        }
      }], { animate: true, direction: 'forward' });
    }

  }

}
