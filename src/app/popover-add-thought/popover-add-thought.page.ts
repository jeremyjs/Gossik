import { Component, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';

import { Capture } from '../../model/capture/capture.model';


import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-popover-add-thought',
  templateUrl: './popover-add-thought.page.html',
  styleUrls: ['./popover-add-thought.page.scss'],
})
export class PopoverAddThoughtPage implements OnInit {

  thought = {} as Capture;

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
    this.popoverCtrl.dismiss(this.thought);
  }

}
