import { Component, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';

import { TranslateService } from '@ngx-translate/core';
import { Action } from 'src/model/action/action.model';

@Component({
  selector: 'app-popover-add-to-do',
  templateUrl: './popover-add-to-do.page.html',
  styleUrls: ['./popover-add-to-do.page.scss'],
})
export class PopoverAddToDoPage implements OnInit {

  todo: Action = {} as Action;

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
    this.popoverCtrl.dismiss(this.todo);
  }

}
