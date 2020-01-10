import { Component, OnInit } from '@angular/core';
import { NavParams, ModalController, AlertController } from '@ionic/angular';

import { Delegation } from '../../model/delegation/delegation.model';
import { CalendarEvent } from '../../model/calendarEvent/calendarEvent.model';

import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { TranslateService } from '@ngx-translate/core';

import { DatabaseService } from '../services/database.service';
import { AuthenticationService } from '../services/authentication.service';

import { take } from 'rxjs/operators';

@Component({
  selector: 'app-delegation-details-modal',
  templateUrl: './delegation-details-modal.page.html',
  styleUrls: ['./delegation-details-modal.page.scss'],
})
export class DelegationDetailsModalPage implements OnInit {
	delegation = {} as Delegation;
	deadline: boolean;
	defineDelegationForm: FormGroup;
	monthLabels = [];
	dayLabels = [];
	edit: boolean = false;
	deadlineString: string;
	formatOptions: any;
  pastCheck: boolean;
  deadlineChanged: boolean = false;

  constructor(
  		  public modalCtrl: ModalController,
	  	  private navParams: NavParams,
	  	  private db: DatabaseService,
	  	  public translate: TranslateService,
      	public fb: FormBuilder,
      	private auth: AuthenticationService,
        public alertCtrl: AlertController
      	) {
  	this.delegation = this.navParams.get('delegation');
    this.defineDelegationForm = this.fb.group({
      content: ['', Validators.required]
    });
    if(!this.delegation.deadline) {
      this.delegation.deadline = '';
    }
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
    this.deadlineString = new Date (this.delegation.deadline).toLocaleDateString(this.translate.currentLang, this.formatOptions);
  }

  ngOnInit() {
  }

  cancel() {
    this.modalCtrl.dismiss();
  }

  deleteDelegation() {
  	this.db.deleteDelegation(this.delegation, this.auth.userid);
  	this.modalCtrl.dismiss();
  }

  check() {
    if(this.delegation.deadline) {
      this.delegation.deadline = new Date (this.delegation.deadline).toISOString();
      if(new Date(this.delegation.deadline) < new Date() && !this.pastCheck) {
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
    this.delegation.content = this.defineDelegationForm.value.content;
    let delegationkey = this.delegation.key;
    if(this.deadlineChanged && this.delegation.deadlineid) {
      this.db.getCalendarEventFromCalendarEventId(this.delegation.deadlineid, this.auth.userid).valueChanges().pipe(take(1)).subscribe( calendarEvent => {
        let deadlineStartTime = new Date (this.delegation.deadline).setHours(2);
        let deadlineEndTime = new Date (this.delegation.deadline).setHours(5);
        let calendarEventkey = calendarEvent.key;
        calendarEvent.startTime = new Date (deadlineStartTime).toISOString();
        calendarEvent.endTime = new Date (deadlineEndTime).toISOString();
        calendarEvent.key = this.delegation.deadlineid;
        this.db.editCalendarEvent(calendarEvent, this.auth.userid)
        calendarEvent.key = this.delegation.deadlineid;
        this.db.editDelegation(this.delegation, this.auth.userid);
        this.delegation.key = delegationkey;
      });
    } else if(this.deadlineChanged) {
      this.db.getGoalFromGoalid(this.delegation.goalid, this.auth.userid).valueChanges().pipe(take(1)).subscribe( goal => {
        let deadlineStartTime = new Date (this.delegation.deadline).setHours(2);
        let deadlineEndTime = new Date (this.delegation.deadline).setHours(5);
        let eventData: CalendarEvent = {
          userid: this.auth.userid,
          goalid: this.delegation.goalid,
          startTime: new Date(deadlineStartTime).toISOString(),
          endTime: new Date (deadlineEndTime).toISOString(),
          title: 'Deadline: ' + this.delegation.content,
          allDay: true,
          active: true,
          color: goal.color,
          delegationid: this.delegation.key
        };
        this.db.addCalendarEvent(eventData, this.auth.userid).then( event => {
          this.delegation.deadlineid = event.key;
          this.db.editDelegation(this.delegation, this.auth.userid);
          this.delegation.key = delegationkey;
        });
      });
    } else {
      this.db.editDelegation(this.delegation, this.auth.userid);
      this.delegation.key = delegationkey;
    }
    this.modalCtrl.dismiss();
  }

  editDeadline() {
    this.edit = true;
  }

  deadlineSelected(event) {
    let deadlineFixed = new Date (event).setHours(2);
    this.delegation.deadline = new Date (deadlineFixed);
    this.deadlineChanged = true;
    this.deadlineString = new Date (this.delegation.deadline).toLocaleDateString(this.translate.currentLang, this.formatOptions);
    this.edit = false;
  }

}
