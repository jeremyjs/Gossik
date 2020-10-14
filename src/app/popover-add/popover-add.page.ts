import { Component, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';

@Component({
  selector: 'app-popover-add',
  templateUrl: './popover-add.page.html',
  styleUrls: ['./popover-add.page.scss'],
})
export class PopoverAddPage implements OnInit {

  constructor(
    public popoverCtrl: PopoverController
  ) { }

  ngOnInit() {
  }

  addProject() {
    this.popoverCtrl.dismiss('addProject');
  }

  addToDo() {

  }

  addThought() {
    this.popoverCtrl.dismiss('addThought');
  }

  addCalendarEvent() {

  }

}
