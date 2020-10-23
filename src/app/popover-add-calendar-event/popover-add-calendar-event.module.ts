import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PopoverAddCalendarEventPageRoutingModule } from './popover-add-calendar-event-routing.module';

import { PopoverAddCalendarEventPage } from './popover-add-calendar-event.page';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PopoverAddCalendarEventPageRoutingModule,
    TranslateModule.forChild()
  ],
  declarations: [PopoverAddCalendarEventPage]
})
export class PopoverAddCalendarEventPageModule {}
