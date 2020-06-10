import { Component, OnInit } from '@angular/core';
import { NavParams, ModalController, AlertController, ToastController } from '@ionic/angular';

import { Action } from '../../model/action/action.model';
import { CalendarEvent } from '../../model/calendarEvent/calendarEvent.model';

import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { TranslateService } from '@ngx-translate/core';

import { DatabaseService } from '../services/database.service';
import { AuthenticationService } from '../services/authentication.service';


import { take } from 'rxjs/operators';

@Component({
  selector: 'app-action-details-modal',
  templateUrl: './action-details-modal.page.html',
  styleUrls: ['./action-details-modal.page.scss'],
})
export class ActionDetailsModalPage implements OnInit {

	action = {} as Action;
	deadline: boolean;
	defineActionForm: FormGroup;
	monthLabels = [];
	dayLabels = [];
	edit: boolean = false;
	deadlineString: string;
	formatOptions: any;
  pastCheck: boolean;
  deadlineChanged: boolean = false;
  currentDate = new Date();
  eventSource = [];
  viewTitle: string;

  constructor(
  		  public modalCtrl: ModalController,
	  	  private navParams: NavParams,
	  	  private db: DatabaseService,
	  	  public translate: TranslateService,
      	public fb: FormBuilder,
      	private auth: AuthenticationService,
        public alertCtrl: AlertController,
        public toastCtrl: ToastController
      ) {
    this.action = this.navParams.get('action');
    this.deadline = !(!this.action.deadline);
    this.defineActionForm = this.fb.group({
    content: ['', Validators.required],
    priority: ['', Validators.required],
    time: ['', Validators.required]
    });
    this.translate.get(['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']).subscribe( monthLabels => {
      this.monthLabels = [
      monthLabels['Jan'],
      monthLabels['Feb'],
      monthLabels['Mar'],
      monthLabels['Apr'],
      monthLabels['May'],
      monthLabels['Jun'],
      monthLabels['Jul'],
      monthLabels['Aug'],
      monthLabels['Sep'],
      monthLabels['Oct'],
      monthLabels['Nov'],
      monthLabels['Dec']
      ];
    });
    this.translate.get(['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']).subscribe( dayLabels => {
      this.dayLabels = [
      dayLabels['Sun'],
      dayLabels['Mon'],
      dayLabels['Tue'],
      dayLabels['Wed'],
      dayLabels['Thu'],
      dayLabels['Fri'],
      dayLabels['Sat']
      ];
    });
    this.formatOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    this.deadlineString = new Date (this.action.deadline).toLocaleDateString(this.translate.currentLang, this.formatOptions);
    this.pastCheck = false;
  }

  ngOnInit() {
  }

  async presentToast(toastMessage) {
      const toast = await this.toastCtrl.create({
      message: toastMessage,
      duration: 5000
    });
    toast.present();
  }

  cancel() {
    this.modalCtrl.dismiss();
  }

  deleteAction() {
    this.db.deleteAction(this.action, this.auth.userid);
    this.translate.get(["Todo deleted"]).subscribe( translation => {
      this.presentToast(translation["Todo deleted"]);
    });
    this.modalCtrl.dismiss();
  }

  startAction() {
    this.modalCtrl.dismiss('start');
  }

  check() {
    if(this.action.deadline) {
      this.action.deadline = new Date (this.action.deadline).toISOString();
      if(new Date(this.action.deadline) < new Date() && !this.pastCheck) {
        this.translate.get(["The selected date lies in the past. Please check if that is wanted.", "Ok"]).subscribe( alertMessage => {
          this.alertCtrl.create({
              message: alertMessage["The selected date lies in the past. Please check if that is wanted."],
              buttons: [
                      {
                          text: alertMessage["Ok"]
                        }
                    ]
          }).then ( alert => {
            alert.present();
            this.pastCheck = true
          });
        });
      } else {
        this.save();
      }
    } else {
      this.save();
    }
  }

  save() {
    this.action.content = this.defineActionForm.value.content;
    this.action.priority = this.defineActionForm.value.priority;
    this.action.time = this.defineActionForm.value.time;
    let actionkey = this.action.key;
    if(this.deadlineChanged && this.action.deadlineid) {
      this.db.getCalendarEventFromCalendarEventId(this.action.deadlineid, this.auth.userid).valueChanges().pipe(take(1)).subscribe( calendarEvent => {
        let deadlineStartTime = new Date (this.action.deadline).setHours(2);
        let deadlineEndTime = new Date (this.action.deadline).setHours(5);
        let calendarEventkey = calendarEvent.key;
        calendarEvent.startTime = new Date (deadlineStartTime).toISOString();
        calendarEvent.endTime = new Date (deadlineEndTime).toISOString();
        calendarEvent.key = this.action.deadlineid;
        this.db.editCalendarEvent(calendarEvent, this.auth.userid)
        calendarEvent.key = this.action.deadlineid;
        this.db.editAction(this.action, this.auth.userid);
        this.action.key = actionkey;
      });
    } else if(this.deadlineChanged) {
      this.db.getGoalFromGoalid(this.action.goalid, this.auth.userid).valueChanges().pipe(take(1)).subscribe( goal => {
        let deadlineStartTime = new Date (this.action.deadline).setHours(2);
        let deadlineEndTime = new Date (this.action.deadline).setHours(5);
        let eventData: CalendarEvent = {
          userid: this.auth.userid,
          goalid: this.action.goalid,
          startTime: new Date(deadlineStartTime).toISOString(),
          endTime: new Date (deadlineEndTime).toISOString(),
          title: 'Deadline: ' + this.action.content,
          allDay: true,
          active: true,
          color: goal.color,
          actionid: this.action.key
        };
        this.db.addCalendarEvent(eventData, this.auth.userid).then( event => {
          this.action.deadlineid = event.key;
          this.db.editAction(this.action, this.auth.userid);
          this.action.key = actionkey;
        });
      });
    } else {
      this.db.editAction(this.action, this.auth.userid);
      this.action.key = actionkey;
    }
    this.translate.get(["Todo edited"]).subscribe( translation => {
      this.presentToast(translation["Todo edited"]);
    });
    this.modalCtrl.dismiss();
  }

  editDeadline() {
    this.edit = true;
  }

  onViewTitleChanged(title) {
    this.viewTitle = title;
  }

  onTimeSelected(event) {
    this.action.deadline = event.selectedTime;
    this.deadlineChanged = true;
    this.deadlineString = new Date (this.action.deadline).toLocaleDateString(this.translate.currentLang, this.formatOptions);
    console.log(this.deadlineString);
    this.edit = false;
  }

}
