import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DefineDelegationModalPageRoutingModule } from './define-delegation-modal-routing.module';

import { DefineDelegationModalPage } from './define-delegation-modal.page';

import { TranslateModule } from '@ngx-translate/core';

import { DatePickerModule } from 'ionic4-date-picker';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    DefineDelegationModalPageRoutingModule,
    TranslateModule.forChild(),
    DatePickerModule
  ],
  declarations: [DefineDelegationModalPage]
})
export class DefineDelegationModalPageModule {}
