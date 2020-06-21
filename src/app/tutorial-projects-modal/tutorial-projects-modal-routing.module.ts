import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TutorialProjectsModalPage } from './tutorial-projects-modal.page';

const routes: Routes = [
  {
    path: '',
    component: TutorialProjectsModalPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TutorialProjectsModalPageRoutingModule {}
