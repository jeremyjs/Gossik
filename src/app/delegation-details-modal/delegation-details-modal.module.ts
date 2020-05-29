import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TranslateModule } from '@ngx-translate/core';

import { DatePickerModule } from 'ionic4-date-picker';

import { DelegationDetailsModalPageRoutingModule } from './delegation-details-modal-routing.module';

import { DelegationDetailsModalPage } from './delegation-details-modal.page';

import { NgCalendarModule  } from 'ionic2-calendar';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    DelegationDetailsModalPageRoutingModule,
    TranslateModule.forChild(),
    DatePickerModule,
    NgCalendarModule
  ],
  declarations: [DelegationDetailsModalPage]
})
export class DelegationDetailsModalPageModule {}
