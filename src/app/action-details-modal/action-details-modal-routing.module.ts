import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ActionDetailsModalPage } from './action-details-modal.page';

const routes: Routes = [
  {
    path: '',
    component: ActionDetailsModalPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ActionDetailsModalPageRoutingModule {}
