import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FivetodosModalPageRoutingModule } from './fivetodos-modal-routing.module';

import { FivetodosModalPage } from './fivetodos-modal.page';

import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FivetodosModalPageRoutingModule,
    TranslateModule.forChild()
  ],
  declarations: [FivetodosModalPage]
})
export class FivetodosModalPageModule {}
