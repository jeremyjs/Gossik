import { Component, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';

import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-popover-add-project',
  templateUrl: './popover-add-project.page.html',
  styleUrls: ['./popover-add-project.page.scss'],
})
export class PopoverAddProjectPage implements OnInit {

  projectName: string;

  constructor(
    public popoverCtrl: PopoverController,
    public translate: TranslateService
  ) { }

  ngOnInit() {
  }

  cancel() {
    this.popoverCtrl.dismiss();
  }

  save() {
    this.popoverCtrl.dismiss(this.projectName);
  }

}
