import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ToDoFilterModalPage } from './to-do-filter-modal.page';

const routes: Routes = [
  {
    path: '',
    component: ToDoFilterModalPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ToDoFilterModalPageRoutingModule {}
