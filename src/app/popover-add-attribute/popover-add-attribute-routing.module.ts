import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PopoverAddAttributePage } from './popover-add-attribute.page';

const routes: Routes = [
  {
    path: '',
    component: PopoverAddAttributePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PopoverAddAttributePageRoutingModule {}
