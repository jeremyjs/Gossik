import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TranslateModule } from '@ngx-translate/core';

import { DatePickerModule } from 'ionic4-date-picker';

import { ActionDetailsModalPageRoutingModule } from './action-details-modal-routing.module';

import { ActionDetailsModalPage } from './action-details-modal.page';

import { NgCalendarModule  } from 'ionic2-calendar';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    ActionDetailsModalPageRoutingModule,
    TranslateModule.forChild(),
    DatePickerModule,
    NgCalendarModule
  ],
  declarations: [ActionDetailsModalPage]
})
export class ActionDetailsModalPageModule {}
