import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AssignProjectModalPage } from './assign-project-modal.page';

const routes: Routes = [
  {
    path: '',
    component: AssignProjectModalPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AssignProjectModalPageRoutingModule {}
