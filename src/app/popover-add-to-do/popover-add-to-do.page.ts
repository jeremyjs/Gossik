import { Component, OnInit } from '@angular/core';
import { PopoverController, PickerController, NavParams, ModalController } from '@ionic/angular';

import { TranslateService } from '@ngx-translate/core';
import { Action } from 'src/model/action/action.model';
import { ChangeWeekModalPage } from '../change-week-modal/change-week-modal.page';

@Component({
  selector: 'app-popover-add-to-do',
  templateUrl: './popover-add-to-do.page.html',
  styleUrls: ['./popover-add-to-do.page.scss'],
})
export class PopoverAddToDoPage implements OnInit {

  todo: Action = {} as Action;
  goalDict: any;
  deadlineFormatOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  deadlineText: string;
  changed: boolean = false;
  type: string;
  priorities: string[] = ["", "Low", "Medium", "High"];

  constructor(
    public popoverCtrl: PopoverController,
    public translate: TranslateService,
    public pickerCtrl: PickerController,
    public navParams: NavParams,
    public modalCtrl: ModalController
  ) { 
  }

  ngOnInit() {
    this.goalDict = this.navParams.get('goalDict');
    if(this.navParams.get('todo')) {
      this.todo = this.navParams.get('todo');
      this.type = 'show';
      this.changed = false;
    }
    if(this.navParams.get('thought')) {
      this.todo.content = this.navParams.get('thought').content;
      if(this.navParams.get('thought').goalid) {
        this.todo.goalid = this.navParams.get('thought').goalid;
      }
    }
    this.translate.get(this.priorities).subscribe( translation => {
      this.priorities = ["", translation["Low"], translation["Medium"], translation["High"]];
    });
    if(this.todo.deadline) {
      this.deadlineText = new Date (this.todo.deadline).toLocaleDateString(this.translate.currentLang, this.deadlineFormatOptions);
    }
  }

  cancel() {
    this.popoverCtrl.dismiss();
  }

  save() {
    this.popoverCtrl.dismiss(this.todo);
  }

  deleteToDo() {
    this.popoverCtrl.dismiss('delete');
  }

  startToDo() {
    this.popoverCtrl.dismiss('start');
  }

  markDoneToDo() {
    this.popoverCtrl.dismiss('markDone');
  }

  openPicker(pickerName) {
    this.translate.get(["Done", "Cancel"]).subscribe( translation => {
      let columnNames = [];
      let columnOptions = [[]];
      let selectedIndices = [0];
      let button = [];
      if(pickerName == 'priority') {
        columnNames = ['priority'];
        columnOptions[0] = this.priorities;
        button = [
          {
            text: translation["Cancel"],
            role: 'cancel'
          },
          {
            text: translation["Done"],
            handler: (value) => {
              this.todo.priority = value.priority.value;
            }
          }
        ]
      } else if (pickerName == 'project') {
        columnNames = ['project'];
        for(let key in this.goalDict) {
          columnOptions[0].push(this.goalDict[key].name);
        }
        button = [
          {
            text: translation["Cancel"],
            role: 'cancel'
          },
          {
            text: translation["Done"],
            handler: (value) => {
              console.log(value);
              this.todo.goalid = value.project.value;
            }
          }
        ]
      }
      this.pickerCtrl.create({
        columns: this.getColumns(pickerName, columnNames, columnOptions, selectedIndices),
        buttons: button
      }).then( picker => {
        picker.present();
        this.changed = true;
        console.log(this.todo.priority);
        console.log(this.priorities[this.todo.priority]);
      });	
    })
  }

  change() {
    this.changed = true;
  }

  getColumns(pickerName, columnNames, columnOptions, selectedIndices) {
    let columns = [];
    for (let i = 0; i < columnNames.length; i++) {
      columns.push({
        name: columnNames[i],
        selectedIndex: selectedIndices[i],
        options: this.getColumnOptions(pickerName, columnOptions[i])
      });
    }
    return columns;
  }

  getColumnOptions(pickerName, columnOptions: string[]) {
    let options = [];
    if(pickerName == 'priority') {
      console.log(columnOptions);
      for (let i of columnOptions) {
        options.push({
          text: i,
          value: columnOptions.findIndex((element) => element == i)
        })
      }
    } else if (pickerName == 'project') {
      for (let key in this.goalDict) {
        options.push({
          text: this.goalDict[key].name,
          value: key
        })
      }
    }
    return options;
  }

  assignDeadline() {
    this.modalCtrl.create({
      component: ChangeWeekModalPage
    }).then(modal => {
      modal.present();
      modal.onDidDismiss().then(data => {
        if(data.data) {
          this.changed = true;
          this.todo.deadline = data.data.toISOString();
          this.deadlineText = new Date (this.todo.deadline).toLocaleDateString(this.translate.currentLang, this.deadlineFormatOptions);
        }
      });
    });
  }

}
