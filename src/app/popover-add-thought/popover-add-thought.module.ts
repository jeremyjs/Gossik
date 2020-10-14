import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PopoverAddThoughtPageRoutingModule } from './popover-add-thought-routing.module';

import { PopoverAddThoughtPage } from './popover-add-thought.page';

import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PopoverAddThoughtPageRoutingModule,
    TranslateModule.forChild()
  ],
  declarations: [PopoverAddThoughtPage]
})
export class PopoverAddThoughtPageModule {}
