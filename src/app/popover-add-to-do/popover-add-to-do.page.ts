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

  constructor(
    public popoverCtrl: PopoverController,
    public translate: TranslateService,
    public pickerCtrl: PickerController,
    public navParams: NavParams,
    public modalCtrl: ModalController
  ) { 
    this.goalDict = this.navParams.get('goalDict');
  }

  ngOnInit() {
  }

  cancel() {
    this.popoverCtrl.dismiss();
  }

  save() {
    this.popoverCtrl.dismiss(this.todo);
  }

  openPicker(pickerName) {
    this.translate.get(["Done", "Cancel"]).subscribe( translation => {
      let columnNames = [];
      let columnOptions = [[]];
      let selectedIndices = [0];
      let button = [];
      if(pickerName == 'priority') {
        columnNames = ['priority'];
        columnOptions[0].push("low");
        columnOptions[0].push("mid");
        columnOptions[0].push("high");
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
      });	
    })
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

  getColumnOptions(pickerName, columnOptions) {
    let options = [];
    if(pickerName == 'priority') {
      for (let i of columnOptions) {
        options.push({
          text: i,
          value: i
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
    let modal = this.modalCtrl.create({
    component: ChangeWeekModalPage
  }).then (modal => {
    modal.present();
    modal.onDidDismiss().then(data => {
      if(data.data) {
        this.todo.deadline = data.data.toISOString();
        this.deadlineText = new Date (this.todo.deadline).toLocaleDateString(this.translate.currentLang, this.deadlineFormatOptions);
      }
    });
  });
  }

}
