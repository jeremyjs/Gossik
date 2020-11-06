import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PopoverFinishToDoPage } from './popover-finish-to-do.page';

const routes: Routes = [
  {
    path: '',
    component: PopoverFinishToDoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PopoverFinishToDoPageRoutingModule {}
