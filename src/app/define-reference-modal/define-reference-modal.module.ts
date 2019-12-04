import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DefineReferenceModalPageRoutingModule } from './define-reference-modal-routing.module';

import { DefineReferenceModalPage } from './define-reference-modal.page';

import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    DefineReferenceModalPageRoutingModule,
    TranslateModule,
  ],
  declarations: [DefineReferenceModalPage]
})
export class DefineReferenceModalPageModule {}
