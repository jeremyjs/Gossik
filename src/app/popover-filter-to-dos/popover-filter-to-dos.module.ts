import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PopoverFilterToDosPageRoutingModule } from './popover-filter-to-dos-routing.module';

import { PopoverFilterToDosPage } from './popover-filter-to-dos.page';

import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PopoverFilterToDosPageRoutingModule,
    TranslateModule.forChild()
  ],
  declarations: [PopoverFilterToDosPage]
})
export class PopoverFilterToDosPageModule {}
