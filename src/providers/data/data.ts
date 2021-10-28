import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ModelFactory, Model } from 'ngx-model';
import { AppState, initialAppState, User, Food, Meal, Consume } from './interfaces';
import { ApiProvider } from '../api/api';
import * as moment from 'moment';
import { UUID } from 'angular2-uuid';
import { calculatePointsIdeal, calculateAge, calculateImc, calculateIdealWeight } from './utils';
import { remove as removeAccents } from "remove-accents";
import { Storage } from '@ionic/storage';
import { SQLiteProvider } from './sqlite';

@Injectable()
export class DataProvider {

  private model: Model<AppState>;
  public state$: Observable<AppState>;
  public user$: Observable<User | false>;
  public meals$: Observable<Meal[]>;
  public foods$: Observable<Food[]>;
  public consumes$: Observable<Consume[]>;
  public meal$: Observable<Meal | false>;
  public date$: Observable<string>;
  public profile$: Observable<User | false>;
  public consumesByDay$: Observable<Consume[]>;
  public dashboard$: Observable<any>;
  public online$: Observable<boolean>;

  constructor(
    private modelFactory: ModelFactory<AppState>,
    private api: ApiProvider,
    private storage: Storage,
    private sqlite: SQLiteProvider,
  ) {
    this.model = this.modelFactory.create(initialAppState);


    this.sqlite.init().then(async () => {
      const state = this.model.get();
      state.meals = await this.sqlite.getMeals();
      state.foods = await this.sqlite.getFoods();
      state.consumes = await this.sqlite.getConsumes();
      state.trash = await this.sqlite.getTrash();
      this.model.set(state);
    })


    this.state$ = this.model.data$;
    this.user$ = this.model.data$.map(state => state.user);
    this.meals$ = this.model.data$.map(state => state.meals);
    this.foods$ = this.model.data$.map(state => state.foods);
    this.consumes$ = this.model.data$.map(state => state.consumes);
    this.meal$ = this.model.data$.map(state => state.meal);
    this.date$ = this.model.data$.map(state => state.date);
    this.profile$ = this.model.data$.map(state => this.getProfile(state));
    //this.foodsTree$ = this.model.data$.map(state => this.getFoodsTree(state));
    this.consumesByDay$ = this.model.data$.map(state => this.getConsumesByDay(state));
    this.dashboard$ = this.model.data$.map(state => this.getDashboard(state));
    this.online$ = this.model.data$.map(state => state.online);

    // Debug all state changes 
    this.state$.subscribe((state) => {
      console.info('stateChange', state);
    })
  }

  // Custom selects with params

  foodsTree$(parent: Food, search: string) {
    return this.model.data$.map(state => this.getFoodsTree(state, parent, search));
  }

  mealInfo$(meal: Meal) {
    return this.model.data$.map(state => this.getMealInfo(state, meal));
  }

  // Sync

  async sync() {
    const syncData: any = { consumes: [] };
    const state = this.model.get();

    if (!state.user) {
      console.log('No sync, not logged');
      return;
    }
    if (!state.online) {
      console.log('No sync, is offline');
      return;
    }


    syncData.consumes = state.consumes.filter((c) => c.sync === 0).map(c => {
      delete c.created;
      return c;
    });

    syncData.trash = state.trash;
    console.log('sync syncData', syncData)

    const lastModified = await this.storage.get('lastModified')
    syncData.lastModified = (lastModified) ? lastModified : 0;
    this.api.post('sync/sync.json', {}, syncData)
      .map(res => res.json())
      .subscribe(async (data) => {
        console.log('sync result', data);
        if (data.result) {
          if (data.result.meals) {
            state.meals = await this.sqlite.saveMeals(data.result.meals, state.meals);
          }
          if (data.result.foods) {
            state.foods = await this.sqlite.saveFoods(data.result.foods, state.foods);
          }
          if (data.result.consumes) {
            state.consumes = await this.sqlite.saveConsumes(data.result.consumes, state.consumes);
          }
          if (data.result.trash) {
            state.trash = await this.sqlite.saveTrash(data.result.trash, state.trash);
          }
          if (data.result.lastModified) {
            const lastModified = await this.storage.set('lastModified', data.result.lastModified)
            state.lastModified = lastModified;
          }
          this.model.set(state);
        }
      })
  }


  // Auth

  setUser(user: User | null) {
    console.log('setUser', user);
    const state = this.model.get();
    state.user = (user === null) ? null : { ...user, dailyPoints: calculatePointsIdeal(user) };
    this.model.set(state);
    if(user === null){
      return this.destroyAll();
    }
  }


  // Actions

  selectMeal(meal: Meal) {
    const state = this.model.get();
    state.meal = meal;
    this.model.set(state);
  }

  setDate(date: string) {
    const state = this.model.get();
    state.date = date;
    this.model.set(state);
  }

  setOnline(online: boolean) {
    const state = this.model.get();
    state.online = online;
    this.model.set(state);
  }

  async saveConsume(consume: Consume) {
    const state = this.model.get();
    let newConsume: Consume;
    if (consume.id) {
      state.consumes = state.consumes.map(con => {
        if (con.uuid !== consume.uuid) {
          return con;
        } else {
          return newConsume = { ...con, ...consume };
        }
      });
    } else {
      newConsume = { ...consume, uuid: UUID.UUID(), sync: 0, deleted: null };
      state.consumes.push(newConsume);
    }
    await this.sqlite.insertConsumes([newConsume])
    this.model.set(state);
    this.sync();
  }

  async removeConsume(consume: Consume) {
    console.log('removeConsume', consume)
    const state = this.model.get();
    if (consume.uuid) {
      state.consumes = state.consumes.filter(con => {
        if(con.uuid !== consume.uuid){
          return true;
        } else {
          state.trash.push(consume.uuid);
          return false;
        }
      });
    }
    await this.sqlite.deleteConsumes([consume])
    this.model.set(state);
    this.sync();
  }


  // Custom selects

  getProfile(state: AppState) {
    const user: User = { ...state.user };
    const profileData = {
      age: calculateAge(user),
      imc: calculateImc(user),
      idealWeight: calculateIdealWeight(user),
    };
    return { ...user, ...profileData };
  }

  getFoodsTree(state: AppState, parent?: Food, search?: string) {
    console.log('getFoodsTree', state.foods);
    return state.foods
      .filter(food => food.parent_id === ((parent !== undefined && parent.id !== undefined) ? parent.id : null))

      .reduce((acc, item) => {
        const children = state.foods.filter(food => food.parent_id === item.id)
          .filter((food) =>
            search === undefined ||
            search === '' ||
            (removeAccents(food.name.trim())).toLowerCase().indexOf(removeAccents(search.trim()).toLowerCase()) > -1
          );
        const foodNewProps = {
          children: children,
          children_txt: children.map(food => food.name).join(', '),
        };
        const food = { ...item, ...foodNewProps };
        acc.push(food);
        return acc;
      }, [])
      .filter((food) =>
        search === undefined ||
        search === '' ||
        (removeAccents(food.name.trim())).toLowerCase().indexOf(removeAccents(search.trim()).toLowerCase()) > -1 ||
        (removeAccents(food.children_txt.trim())).toLowerCase().indexOf(removeAccents(search.trim()).toLowerCase()) > -1
      );
  }

  getMealInfo(state: AppState, meal?: Meal) {
    const dailyPoints = state.user.dailyPoints;
    const totalBalance = state.meals.reduce((acc, each) => {
      return acc += each.balance;
    }, 0)
    const consumes = state.consumes
      .filter(consume => moment(consume.date).format('YYYY-MM-DD') === state.date && consume.meal_id === meal.id)
      .map((con) => ({ ...con, food: state.foods.find(food => food.id === con.food_id) }));
    const consumePoints = consumes.reduce((a, c) => (a += (c.quantity * c.food.points)), 0);
    const mealPoint = Math.round((meal.balance / totalBalance) * dailyPoints);
    return { ...meal, consumes, mealPoint, consumePoints };
  }

  getConsumesByDay(state: AppState) {
    return state.consumes
      .filter(consume => moment(consume.date).format('YYYY-MM-DD') === state.date)
      .filter(consume => state.meal && (consume.meal_id === state.meal.id))
      .map(consume => {
        const consumeNewProps = {
          food: state.foods.find(food => food.id === consume.food_id),
          meal: state.meals.find(meal => meal.id === consume.meal_id),
        }
        return { ...consume, ...consumeNewProps }
      });
  }

  getDashboard(state: AppState) {
    if (!state.user) {
      return { dailyPoints: 0, consumedPoints: 0, meals: [] }
    }
    const dailyPoints = state.user.dailyPoints;
    let consumedPoints = 0;

    const totalBalance = state.meals.reduce((acc, each) => {
      return acc += each.balance;
    }, 0)

    const meals = state.meals.map(meal => {
      const consumes = state.consumes
        .filter(consume => moment(consume.date).format('YYYY-MM-DD') === state.date && consume.meal_id === meal.id)
        .map((con) => ({ ...con, food: state.foods.find(food => food.id === con.food_id) }));
      const consumePoints = consumes.reduce((a, c) => {
        const mealPoints = (a += (c.quantity * c.food.points));
        return mealPoints;
      }, 0)
      consumedPoints += consumePoints

      const mealPoint = Math.round((meal.balance / totalBalance) * dailyPoints);
      return { ...meal, consumes, mealPoint, consumePoints };
    });

    return { dailyPoints, consumedPoints, meals }
  }


  async destroyAll(){
    await this.sqlite.destroyAll();
  }

  

}

