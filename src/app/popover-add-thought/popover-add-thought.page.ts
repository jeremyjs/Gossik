import { Component, OnInit } from '@angular/core';
import { NavParams, PopoverController } from '@ionic/angular';

import { Capture } from '../../model/capture/capture.model';


import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-popover-add-thought',
  templateUrl: './popover-add-thought.page.html',
  styleUrls: ['./popover-add-thought.page.scss'],
})
export class PopoverAddThoughtPage implements OnInit {

  thought = {} as Capture;
  type: string;
  changed: boolean = false;

  constructor(
    public popoverCtrl: PopoverController,
    public translate: TranslateService,
    public navParams: NavParams
    ) { }

  ngOnInit() {
    if(this.navParams.get('thought')) {
      this.type = 'show';
      this.thought = this.navParams.get('thought');
    }
  }

  cancel() {
    this.popoverCtrl.dismiss();
  }

  save() {
    this.popoverCtrl.dismiss(this.thought);
  }

  deleteThought() {
    this.popoverCtrl.dismiss('delete');
  }

  change() {
    this.changed = true;
  }

  createToDo() {
    this.popoverCtrl.dismiss('createToDo');
  }

}
