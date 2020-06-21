import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TutorialProjectsModalPageRoutingModule } from './tutorial-projects-modal-routing.module';

import { TutorialProjectsModalPage } from './tutorial-projects-modal.page';

import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TutorialProjectsModalPageRoutingModule,
    TranslateModule.forChild()
  ],
  declarations: [TutorialProjectsModalPage]
})
export class TutorialProjectsModalPageModule {}
