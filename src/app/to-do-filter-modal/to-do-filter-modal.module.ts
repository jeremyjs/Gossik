import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ToDoFilterModalPageRoutingModule } from './to-do-filter-modal-routing.module';

import { ToDoFilterModalPage } from './to-do-filter-modal.page';

import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ToDoFilterModalPageRoutingModule,
    TranslateModule.forChild()
  ],
  declarations: [ToDoFilterModalPage]
})
export class ToDoFilterModalPageModule {}
