import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TranslateModule } from '@ngx-translate/core';

import { GoalDetailsModalPageRoutingModule } from './goal-details-modal-routing.module';

import { GoalDetailsModalPage } from './goal-details-modal.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    GoalDetailsModalPageRoutingModule,
    TranslateModule.forChild(),
  ],
  declarations: [GoalDetailsModalPage]
})
export class GoalDetailsModalPageModule {}
