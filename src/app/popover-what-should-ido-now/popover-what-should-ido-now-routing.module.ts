import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PopoverWhatShouldIDoNowPage } from './popover-what-should-ido-now.page';

const routes: Routes = [
  {
    path: '',
    component: PopoverWhatShouldIDoNowPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PopoverWhatShouldIDoNowPageRoutingModule {}
