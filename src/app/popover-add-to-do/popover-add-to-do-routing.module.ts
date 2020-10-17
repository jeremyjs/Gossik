import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PopoverAddToDoPage } from './popover-add-to-do.page';

const routes: Routes = [
  {
    path: '',
    component: PopoverAddToDoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PopoverAddToDoPageRoutingModule {}
