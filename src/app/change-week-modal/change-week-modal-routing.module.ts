import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ChangeWeekModalPage } from './change-week-modal.page';

const routes: Routes = [
  {
    path: '',
    component: ChangeWeekModalPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ChangeWeekModalPageRoutingModule {}
