import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PopoverAddPage } from './popover-add.page';

const routes: Routes = [
  {
    path: '',
    component: PopoverAddPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PopoverAddPageRoutingModule {}
