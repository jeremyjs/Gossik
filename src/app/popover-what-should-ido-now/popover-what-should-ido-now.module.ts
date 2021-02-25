import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PopoverWhatShouldIDoNowPageRoutingModule } from './popover-what-should-ido-now-routing.module';

import { PopoverWhatShouldIDoNowPage } from './popover-what-should-ido-now.page';

import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PopoverWhatShouldIDoNowPageRoutingModule,
    TranslateModule.forChild()
  ],
  declarations: [PopoverWhatShouldIDoNowPage]
})
export class PopoverWhatShouldIDoNowPageModule {}
