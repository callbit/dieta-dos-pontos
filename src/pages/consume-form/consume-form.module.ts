import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ConsumeFormPage } from './consume-form';

@NgModule({
  declarations: [
    ConsumeFormPage,
  ],
  imports: [
    IonicPageModule.forChild(ConsumeFormPage),
  ],
})
export class ConsumeFormPageModule {}
