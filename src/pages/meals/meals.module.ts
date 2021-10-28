import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MealsPage } from './meals';
import { ComponentsModule } from '../../components/components.module';

@NgModule({
  declarations: [
    MealsPage,
  ],
  imports: [
    IonicPageModule.forChild(MealsPage),
    ComponentsModule,
  ],
})
export class MealsPageModule { }
