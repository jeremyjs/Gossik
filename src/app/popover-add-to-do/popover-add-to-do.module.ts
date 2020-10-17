import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PopoverAddToDoPageRoutingModule } from './popover-add-to-do-routing.module';

import { PopoverAddToDoPage } from './popover-add-to-do.page';

import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PopoverAddToDoPageRoutingModule,
    TranslateModule.forChild()
  ],
  declarations: [PopoverAddToDoPage]
})
export class PopoverAddToDoPageModule {}
