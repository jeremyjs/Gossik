import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DefineReferenceModalPage } from './define-reference-modal.page';

const routes: Routes = [
  {
    path: '',
    component: DefineReferenceModalPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DefineReferenceModalPageRoutingModule {}
