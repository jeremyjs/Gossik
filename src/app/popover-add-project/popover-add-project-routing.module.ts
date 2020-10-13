import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PopoverAddProjectPage } from './popover-add-project.page';

const routes: Routes = [
  {
    path: '',
    component: PopoverAddProjectPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PopoverAddProjectPageRoutingModule {}
