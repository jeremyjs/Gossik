import { Component, OnInit } from '@angular/core';
import { PickerController, PopoverController, NavParams } from '@ionic/angular';

import { TranslateService } from '@ngx-translate/core';
import { CalendarEvent } from 'src/model/calendarEvent/calendarEvent.model';

@Component({
  selector: 'app-popover-add-calendar-event',
  templateUrl: './popover-add-calendar-event.page.html',
  styleUrls: ['./popover-add-calendar-event.page.scss'],
})
export class PopoverAddCalendarEventPage implements OnInit {

  calendarEvent = { startTime: new Date().toISOString(), endTime: new Date().toISOString()} as CalendarEvent;
  goalDict: any;
  type: any;
  changed: boolean = false;

  constructor(
    public popoverCtrl: PopoverController,
    public translate: TranslateService,
    public pickerCtrl: PickerController,
    public navParams: NavParams
  ) { 
    this.goalDict = this.navParams.get('goalDict');
    if(this.navParams.get('calendarEvent')) {
      this.calendarEvent = this.navParams.get('calendarEvent');
      this.calendarEvent.startTime = this.calendarEvent.startTime.toISOString();
      this.calendarEvent.endTime = this.calendarEvent.endTime.toISOString();
      this.type = 'show';
    }
  }

  ngOnInit() {
  }

  change() {
    this.changed = true;
  }

  cancel() {
    this.popoverCtrl.dismiss();
  }

  save() {
    this.popoverCtrl.dismiss(this.calendarEvent);
  }

  delete() {
    this.popoverCtrl.dismiss('delete');
  }

  openPicker(pickerName) {
    this.change();
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
              this.calendarEvent.goalid = value.project.value;
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
