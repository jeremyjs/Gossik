import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TranslateModule } from '@ngx-translate/core';

import { CalendarEventModalPageRoutingModule } from './calendar-event-modal-routing.module';

import { CalendarEventModalPage } from './calendar-event-modal.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    CalendarEventModalPageRoutingModule,
    TranslateModule.forChild()
  ],
  declarations: [CalendarEventModalPage]
})
export class CalendarEventModalPageModule {}
