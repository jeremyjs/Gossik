import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DefineActionModalPageRoutingModule } from './define-action-modal-routing.module';

import { DefineActionModalPage } from './define-action-modal.page';


import { TranslateModule } from '@ngx-translate/core';

import { DatePickerModule } from 'ionic4-date-picker';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    DefineActionModalPageRoutingModule,
    TranslateModule.forChild(),
    DatePickerModule
  ],
  declarations: [DefineActionModalPage]
})
export class DefineActionModalPageModule {}
