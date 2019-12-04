import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GoalDetailsModalPage } from './goal-details-modal.page';

const routes: Routes = [
  {
    path: '',
    component: GoalDetailsModalPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GoalDetailsModalPageRoutingModule {}
