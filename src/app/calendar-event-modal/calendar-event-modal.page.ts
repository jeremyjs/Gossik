import { Component, OnInit } from '@angular/core';
import { NavParams, ModalController, AlertController } from '@ionic/angular';

import { Goal } from '../../model/goal/goal.model';
import { CalendarEvent } from '../../model/calendarEvent/calendarEvent.model';

import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { TranslateService } from '@ngx-translate/core';

import { DatabaseService } from '../services/database.service';
import { AuthenticationService } from '../services/authentication.service';

import * as moment from 'moment';
import { Observable } from 'rxjs';
import { map, filter } from 'rxjs/operators';

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

  constructor(
  		public modalCtrl: ModalController,
	  	private navParams: NavParams,
	  	private db: DatabaseService,
	  	public translate: TranslateService,
      	public fb: FormBuilder,
      	private auth: AuthenticationService,
      	public alertCtrl: AlertController
      	) {
  	let preselectedDate = moment(this.navParams.get('selectedDay')).format();
	    this.eventStartTimeISOString = preselectedDate;
	    this.eventEndTimeISOString = preselectedDate;
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
		});
	this.pastCheck = false;
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
		this.eventEndTimeISOString = this.eventStartTimeISOString;
	}

}
