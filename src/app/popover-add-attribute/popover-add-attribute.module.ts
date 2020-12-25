import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PopoverAddAttributePageRoutingModule } from './popover-add-attribute-routing.module';

import { PopoverAddAttributePage } from './popover-add-attribute.page';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PopoverAddAttributePageRoutingModule,
    TranslateModule.forChild()
  ],
  declarations: [PopoverAddAttributePage]
})
export class PopoverAddAttributePageModule {}
