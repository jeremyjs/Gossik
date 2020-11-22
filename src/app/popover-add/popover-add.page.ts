import { Component, OnInit } from '@angular/core';
import { NavParams, PopoverController } from '@ionic/angular';

@Component({
  selector: 'app-popover-add',
  templateUrl: './popover-add.page.html',
  styleUrls: ['./popover-add.page.scss'],
})
export class PopoverAddPage implements OnInit {
  tutorial: boolean = false;
  viewpoint: string = '';
  text: string = "Here you can add new items of which I will then take care.";

  constructor(
    public popoverCtrl: PopoverController,
    public navParams: NavParams
  ) { }

  ngOnInit() {
    if(this.navParams.get('tutorial')) {
      this.tutorial = true;
    }
  }

  addProject() {
    this.popoverCtrl.dismiss('addProject');
  }

  addToDo() {
    this.popoverCtrl.dismiss('addToDo');
  }

  addThought() {
    this.popoverCtrl.dismiss('addThought');
  }

  addCalendarEvent() {
    this.popoverCtrl.dismiss('addCalendarEvent');
  }

  tutorialNext() {
    if(this.text == "Here you can add new items of which I will then take care.") {
      this.text = "You might wonder what thoughts are: Whenever something comes up in your mind but you don’t want to take care of it right now, add it as a thought and process it later. Thoughts can be transformed into to-dos or assigned to a project directly as a thought.";
    } else if(this.text == "You might wonder what thoughts are: Whenever something comes up in your mind but you don’t want to take care of it right now, add it as a thought and process it later. Thoughts can be transformed into to-dos or assigned to a project directly as a thought.") {
      this.popoverCtrl.dismiss();
    }
  }

}
