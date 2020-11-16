import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PopoverInteractionPageRoutingModule } from './popover-interaction-routing.module';

import { PopoverInteractionPage } from './popover-interaction.page';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PopoverInteractionPageRoutingModule,
    TranslateModule.forChild()
  ],
  declarations: [PopoverInteractionPage]
})
export class PopoverInteractionPageModule {}
