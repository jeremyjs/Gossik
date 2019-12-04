import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DefineDelegationModalPage } from './define-delegation-modal.page';

const routes: Routes = [
  {
    path: '',
    component: DefineDelegationModalPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DefineDelegationModalPageRoutingModule {}
