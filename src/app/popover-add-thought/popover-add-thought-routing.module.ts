import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PopoverAddThoughtPage } from './popover-add-thought.page';

const routes: Routes = [
  {
    path: '',
    component: PopoverAddThoughtPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PopoverAddThoughtPageRoutingModule {}
