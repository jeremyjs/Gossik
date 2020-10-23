import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PopoverAddCalendarEventPage } from './popover-add-calendar-event.page';

const routes: Routes = [
  {
    path: '',
    component: PopoverAddCalendarEventPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PopoverAddCalendarEventPageRoutingModule {}
