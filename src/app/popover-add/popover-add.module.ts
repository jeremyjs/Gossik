import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PopoverAddPageRoutingModule } from './popover-add-routing.module';

import { PopoverAddPage } from './popover-add.page';


import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PopoverAddPageRoutingModule,
    TranslateModule.forChild()
  ],
  declarations: [PopoverAddPage]
})
export class PopoverAddPageModule {}
