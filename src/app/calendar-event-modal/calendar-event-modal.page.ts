import { Component, OnInit } from '@angular/core';
import { NavParams, ModalController, AlertController, ToastController } from '@ionic/angular';

import { Goal } from '../../model/goal/goal.model';
import { CalendarEvent } from '../../model/calendarEvent/calendarEvent.model';

import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { TranslateService } from '@ngx-translate/core';

import { DatabaseService } from '../services/database.service';
import { AuthenticationService } from '../services/authentication.service';

import { ChangeWeekModalPage } from '../change-week-modal/change-week-modal.page';


import * as moment from 'moment';
import { Observable } from 'rxjs';
import { map, filter, take } from 'rxjs/operators';

@Component({
  selector: 'app-calendar-event-modal',
  templateUrl: './calendar-event-modal.page.html',
  styleUrls: ['./calendar-event-modal.page.scss'],
})
export class CalendarEventModalPage implements OnInit {

	event = {} as CalendarEvent;
  	eventStartTimeISOString: string;
  	eventEndTimeISOString: string;
  	minDate = new Date(new Date().setHours(0,0,0,0)).toISOString();
	goalList: Observable<Goal[]>;
	goalArray: Goal[];
	goalid: string;
	errorMsg: boolean;
	pastCheck: boolean;
	deadline: boolean = false;
	monthLabels = [];
	dayLabels = [];
	deadlineString: string;
	formatOptions: any;
	gotGoals: boolean = false;

  constructor(
  		public modalCtrl: ModalController,
	  	public navParams: NavParams,
	  	private db: DatabaseService,
	  	public translate: TranslateService,
      	public fb: FormBuilder,
      	private auth: AuthenticationService,
      	public alertCtrl: AlertController,
      	public toastCtrl: ToastController
   ) {
  	if(this.navParams.get('selectedDay')) {
	  	let preselectedDate = moment(this.navParams.get('selectedDay')).format();
	    this.eventStartTimeISOString = preselectedDate;
	    this.eventEndTimeISOString = preselectedDate;
	} else if(this.navParams.get('calendarEvent')) {
		this.event = this.navParams.get('calendarEvent');
		this.goalid = this.event.goalid;
		this.eventStartTimeISOString = new Date (this.event.startTime).toISOString();
		this.eventEndTimeISOString = new Date (this.event.endTime).toISOString();
		if(this.event.allDay) {
			this.deadline = true;
		    this.formatOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
		    this.deadlineString = new Date (this.event.startTime).toLocaleDateString(this.translate.currentLang, this.formatOptions);
		} else {
			this.eventStartTimeISOString = this.event.startTime.toISOString();
			setTimeout(() => {
				this.eventEndTimeISOString = this.event.endTime.toISOString();
			});
		}
	}
    this.goalList = this.db.getGoalList(this.auth.userid)
		  	.snapshotChanges()
		  	.pipe(
				map(
					changes => { 
						return changes.map( c => {
							let goal: Goal = { 
								key: c.payload.key, ...c.payload.val()
								};
							return goal;
				});})

			);
	this.goalList.subscribe(
      goalArray => {
			this.goalArray = [];
        for(let goal of goalArray) {
        	if(goal.active != false) {
	        	this.goalArray.push(goal);
	        }
	    }
	    if(this.goalArray.length > 0) {
	    	this.gotGoals = true;
	    }
	});
	this.pastCheck = false;
  }

  async presentToast(toastMessage) {
      const toast = await this.toastCtrl.create({
      message: toastMessage,
      duration: 5000,
      cssClass: 'toast'
    });
    toast.present();
  }

  ngOnInit() {
  }
  	ionFocus(event){
		event.target.firstChild.placeholder = '';
	}

  	cancel() {
		this.modalCtrl.dismiss();
	}

	check() {
		this.errorMsg = false;
		let startTime = new Date(this.eventStartTimeISOString);
		let endTime = new Date(this.eventEndTimeISOString);
		if(endTime < startTime) {
			this.errorMsg = true;
			return;
		}
		if(endTime < new Date() && !this.pastCheck) {
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
  	}
 
	save() {
		this.event.startTime = this.eventStartTimeISOString;
		this.event.endTime = this.eventEndTimeISOString;
		this.event.goalid = this.goalid;
		this.modalCtrl.dismiss(this.event);
	}

	adaptEndDate() {
		if(new Date(this.eventEndTimeISOString) <= new Date(this.eventStartTimeISOString)) {
			this.eventEndTimeISOString = this.eventStartTimeISOString;
		}
	}

	assignDeadline() {
    let modal = this.modalCtrl.create({
      component: ChangeWeekModalPage
      }).then (modal => {
        modal.present();
        modal.onDidDismiss().then(data => {
          if(data.data) {
            let deadlineStartFixed = new Date (data.data).setHours(2);
		    this.eventStartTimeISOString = new Date (deadlineStartFixed).toISOString();
		    let deadlineEndFixed = new Date (data.data).setHours(5);
		    this.eventEndTimeISOString = new Date (deadlineEndFixed).toISOString();
		    this.deadlineString = new Date (deadlineStartFixed).toLocaleDateString(this.translate.currentLang, this.formatOptions);
	    
          }
        });
      });
    }

}
