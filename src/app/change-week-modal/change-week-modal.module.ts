import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ChangeWeekModalPageRoutingModule } from './change-week-modal-routing.module';

import { ChangeWeekModalPage } from './change-week-modal.page';

import { TranslateModule } from '@ngx-translate/core';

import { DatePickerModule } from 'ionic4-date-picker';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ChangeWeekModalPageRoutingModule,
    TranslateModule.forChild(),
    DatePickerModule
  ],
  declarations: [ChangeWeekModalPage]
})
export class ChangeWeekModalPageModule {}
