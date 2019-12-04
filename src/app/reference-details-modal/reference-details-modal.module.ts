import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TranslateModule } from '@ngx-translate/core';

import { ReferenceDetailsModalPageRoutingModule } from './reference-details-modal-routing.module';

import { ReferenceDetailsModalPage } from './reference-details-modal.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    ReferenceDetailsModalPageRoutingModule,
    TranslateModule.forChild()
  ],
  declarations: [ReferenceDetailsModalPage]
})
export class ReferenceDetailsModalPageModule {}
