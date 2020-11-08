import { Component, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';


import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-popover-finish-to-do',
  templateUrl: './popover-finish-to-do.page.html',
  styleUrls: ['./popover-finish-to-do.page.scss'],
})
export class PopoverFinishToDoPage implements OnInit {

  constructor(
    public translate: TranslateService,
    public popoverCtrl: PopoverController
  ) { }

  ngOnInit() {
  }

  createNow() {
    this.popoverCtrl.dismiss('createNow');
  }

  createLater() {
    this.popoverCtrl.dismiss('createLater');
  }

  noFollowUp() {
    this.popoverCtrl.dismiss('noFollowUp');
  }

}
