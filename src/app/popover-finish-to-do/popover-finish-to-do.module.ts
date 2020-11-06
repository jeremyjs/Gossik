import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PopoverFinishToDoPageRoutingModule } from './popover-finish-to-do-routing.module';

import { PopoverFinishToDoPage } from './popover-finish-to-do.page';

import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PopoverFinishToDoPageRoutingModule,
    TranslateModule.forChild()
  ],
  declarations: [PopoverFinishToDoPage]
})
export class PopoverFinishToDoPageModule {}
