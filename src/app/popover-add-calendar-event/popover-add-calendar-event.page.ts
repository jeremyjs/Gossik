import { EventHandlerVars } from '@angular/compiler/src/compiler_util/expression_converter';
import { Component, OnInit } from '@angular/core';
import { PickerController, PopoverController, NavParams, ModalController, AlertController } from '@ionic/angular';

import { TranslateService } from '@ngx-translate/core';
import { CalendarEvent } from 'src/model/calendarEvent/calendarEvent.model';
import { Goal } from 'src/model/goal/goal.model';
import { ChangeWeekModalPage } from '../change-week-modal/change-week-modal.page';
import { PopoverAddProjectPage } from '../popover-add-project/popover-add-project.page';
import { AuthenticationService } from '../services/authentication.service';
import { DatabaseService } from '../services/database.service';

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
  deadlineText: string;
  deadlineFormatOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  projectColors: string[];

  constructor(
    public popoverCtrl: PopoverController,
    public translate: TranslateService,
    public pickerCtrl: PickerController,
    public navParams: NavParams,
    public modalCtrl: ModalController,
    private auth: AuthenticationService,
    public db: DatabaseService,
    public alertCtrl: AlertController
  ) { 
    this.goalDict = this.navParams.get('goalDict');
    this.projectColors = this.navParams.get('projectColors');
    if(this.navParams.get('startTime')) {
      this.calendarEvent.startTime = this.navParams.get('startTime').toISOString();
      this.calendarEvent.endTime = this.navParams.get('startTime').toISOString();
    }
    if(this.navParams.get('calendarEvent')) {
      this.calendarEvent = this.navParams.get('calendarEvent');
      this.calendarEvent.startTime = this.calendarEvent.startTime.toISOString();
      this.calendarEvent.endTime = this.calendarEvent.endTime.toISOString();
      this.type = 'show';
    }
    this.deadlineText = new Date (this.calendarEvent.startTime).toLocaleDateString(this.translate.currentLang, this.deadlineFormatOptions);
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

  async addProject() {
    const popover = await this.popoverCtrl.create({
    component: PopoverAddProjectPage,
    componentProps: {'projectColors': this.projectColors},
    cssClass: 'popover-add-project'
    });
    await popover.present();
    popover.onDidDismiss().then( data => {
      if(data.data) {
        this.addGoal(data.data);
      }
    });
  }
  
  addGoal(project: Goal) {
		for(let key in this.goalDict) {
			if (this.goalDict[key].name == project.name) {
				this.translate.get(["You already have a goal with that name.", "OK"]).subscribe( alertMessage => {
					this.alertCtrl.create({
						message: alertMessage["You already have a goal with that name."],
						buttons: [
									{
										text: alertMessage["OK"]
									}
								]
					}).then( alert => {
						alert.present();
					});
				});
			return;
			}
		}
		if(project.name !== '' && project.name !== null && project.name !== undefined) {
			project.userid = this.auth.userid;
			project.active = true;
			if(!project.color) {
				project.color = "#FFFFFF";
			}
			this.db.addGoal(project, this.auth.userid).then( createdProject => {
        project.key = createdProject.key;
        this.goalDict[createdProject.key] = project;
        this.calendarEvent.goalid = createdProject.key;
      });
		} else {
      this.translate.get(["You cannot create a goal without a name.", "OK"]).subscribe( alertMessage => {
        this.alertCtrl.create({
          message: alertMessage["You cannot create a goal without a name."],
          buttons: [
                {
                  text: alertMessage["OK"]
                }
              ]
        }).then( alert => {
          alert.present();
        });
      });
		}
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
              this.calendarEvent.goalid = value.project.value;
              if(this.goalDict[value.project.value].color) {
                this.calendarEvent.color = this.goalDict[value.project.value].color;
              } else {
                this.calendarEvent.color = "#EDF2FF";
              }
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

  assignDeadline() {
    this.modalCtrl.create({
      component: ChangeWeekModalPage
    }).then(modal => {
      modal.present();
      modal.onDidDismiss().then(data => {
        if(data.data) {
          this.changed = true;
          this.calendarEvent.startTime = data.data.toISOString();
          this.calendarEvent.endTime = new Date(data.data.getTime() + 3600*1000).toISOString();
          this.deadlineText = new Date (this.calendarEvent.startTime).toLocaleDateString(this.translate.currentLang, this.deadlineFormatOptions);
        }
      });
    });
  }

}
