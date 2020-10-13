import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PopoverAddProjectPageRoutingModule } from './popover-add-project-routing.module';

import { PopoverAddProjectPage } from './popover-add-project.page';


import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PopoverAddProjectPageRoutingModule,
    TranslateModule.forChild()
  ],
  declarations: [PopoverAddProjectPage]
})
export class PopoverAddProjectPageModule {}
