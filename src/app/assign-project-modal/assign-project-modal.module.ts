import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AssignProjectModalPageRoutingModule } from './assign-project-modal-routing.module';

import { AssignProjectModalPage } from './assign-project-modal.page';

import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AssignProjectModalPageRoutingModule,
    TranslateModule.forChild()
  ],
  declarations: [AssignProjectModalPage]
})
export class AssignProjectModalPageModule {}
