import { Component, OnInit } from '@angular/core';
import { PopoverController, PickerController, NavParams, ModalController, AlertController } from '@ionic/angular';

import { TranslateService } from '@ngx-translate/core';
import { Action } from 'src/model/action/action.model';
import { Goal } from 'src/model/goal/goal.model';
import { ChangeWeekModalPage } from '../change-week-modal/change-week-modal.page';
import { PopoverAddProjectPage } from '../popover-add-project/popover-add-project.page';
import { AuthenticationService } from '../services/authentication.service';
import { DatabaseService } from '../services/database.service';

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
  }

  ngOnInit() {
    this.goalDict = this.navParams.get('goalDict');
    this.projectColors = this.navParams.get('projectColors');
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
    if(this.navParams.get('projectid')) {
      this.todo.goalid = this.navParams.get('projectid');
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
        this.todo.goalid = createdProject.key;
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
