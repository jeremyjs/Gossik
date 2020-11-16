import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PopoverInteractionPage } from './popover-interaction.page';

const routes: Routes = [
  {
    path: '',
    component: PopoverInteractionPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PopoverInteractionPageRoutingModule {}
