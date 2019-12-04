import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CalendarEventModalPage } from './calendar-event-modal.page';

const routes: Routes = [
  {
    path: '',
    component: CalendarEventModalPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CalendarEventModalPageRoutingModule {}
