import { Component, OnInit } from '@angular/core';
import { AlertController, NavParams, PickerController, PopoverController } from '@ionic/angular';

import { Capture } from '../../model/capture/capture.model';


import { TranslateService } from '@ngx-translate/core';
import { PopoverAddProjectPage } from '../popover-add-project/popover-add-project.page';
import { Goal } from 'src/model/goal/goal.model';
import { AuthenticationService } from '../services/authentication.service';
import { DatabaseService } from '../services/database.service';

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
  projectColors: string[];

  constructor(
    public popoverCtrl: PopoverController,
    public translate: TranslateService,
    public navParams: NavParams,
    public pickerCtrl: PickerController,
    public alertCtrl: AlertController,
    private auth: AuthenticationService,
    public db: DatabaseService
    ) { }

  ngOnInit() {
    this.goalDict = this.navParams.get('goalDict');
    this.projectColors = this.navParams.get('projectColors');
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
        this.goalid = createdProject.key;
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
