import { Component, OnInit } from '@angular/core';
import { NavParams, PickerController, PopoverController } from '@ionic/angular';

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
  goalDict: any;
  goalid: string;
  assigned: boolean = false;

  constructor(
    public popoverCtrl: PopoverController,
    public translate: TranslateService,
    public navParams: NavParams,
    public pickerCtrl: PickerController
    ) { }

  ngOnInit() {
    this.goalDict = this.navParams.get('goalDict');
    if(this.navParams.get('thought')) {
      this.type = 'show';
      this.thought = this.navParams.get('thought');
    }
    if(this.navParams.get('goalid')) {
      this.assigned = true;
      this.goalid = this.navParams.get('goalid');
    }
  }

  cancel() {
    this.popoverCtrl.dismiss();
  }

  save() {
    console.log(this.thought);
    console.log(this.goalid);
    this.popoverCtrl.dismiss([this.thought, this.goalid]);
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

  openPicker(pickerName) {
    this.translate.get(["Done", "Cancel"]).subscribe( translation => {
      let columnNames = [];
      let columnOptions = [[]];
      let selectedIndices = [0];
      let button = [];
      if (pickerName == 'project') {
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
              this.goalid = value.project.value;
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

  getColumnOptions(pickerName, columnOptions: string[]) {
    let options = [];
    if (pickerName == 'project') {
      for (let key in this.goalDict) {
        options.push({
          text: this.goalDict[key].name,
          value: key
        })
      }
    }
    return options;
  }

}
