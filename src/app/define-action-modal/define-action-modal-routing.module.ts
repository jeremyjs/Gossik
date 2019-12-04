import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DefineActionModalPage } from './define-action-modal.page';

const routes: Routes = [
  {
    path: '',
    component: DefineActionModalPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DefineActionModalPageRoutingModule {}
