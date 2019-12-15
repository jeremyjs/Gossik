import { Component, OnInit } from '@angular/core';
import { NavParams, ModalController } from '@ionic/angular';

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

  constructor(
  		public modalCtrl: ModalController,
	  	private navParams: NavParams,
	  	private db: DatabaseService,
	  	public translate: TranslateService,
      	public fb: FormBuilder,
      	private auth: AuthenticationService
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
  }

  ngOnInit() {
  }

  	cancel() {
		this.modalCtrl.dismiss();
	}
 
	save() {
		this.errorMsg = false;
		let startTime = new Date(this.eventStartTimeISOString);
		let endTime = new Date(this.eventEndTimeISOString);
		if(endTime < startTime) {
			this.errorMsg = true;
			return;
		}
		this.event.startTime = this.eventStartTimeISOString;
		this.event.endTime = this.eventEndTimeISOString;
		this.event.goalid = this.goalid;
		this.modalCtrl.dismiss(this.event);
	}

	adaptEndDate() {
		this.eventEndTimeISOString = this.eventStartTimeISOString;
	}

}
