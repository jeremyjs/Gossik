import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DelegationDetailsModalPage } from './delegation-details-modal.page';

const routes: Routes = [
  {
    path: '',
    component: DelegationDetailsModalPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DelegationDetailsModalPageRoutingModule {}
