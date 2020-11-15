import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PopoverFilterToDosPage } from './popover-filter-to-dos.page';

const routes: Routes = [
  {
    path: '',
    component: PopoverFilterToDosPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PopoverFilterToDosPageRoutingModule {}
