import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FivetodosModalPage } from './fivetodos-modal.page';

const routes: Routes = [
  {
    path: '',
    component: FivetodosModalPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FivetodosModalPageRoutingModule {}
