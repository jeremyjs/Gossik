import { Injectable } from '@angular/core';
import { Calendar } from '@ionic-native/calendar/ngx';
import { Platform } from '@ionic/angular';

import { DatabaseService } from './database.service';
import { AuthenticationService } from './authentication.service';
import { CalendarEvent } from '../../model/calendarEvent/calendarEvent.model';

import { map, take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class NativeCalendarService {

	calendars = [];

  constructor(
  	private calendar: Calendar,
  	private plt: Platform,
  	private db: DatabaseService,
  	private auth: AuthenticationService
  	) {
	  	this.plt.ready().then( () => {
	  		this.calendar.listCalendars().then( data => {
	  			this.calendars = data;
	  		});
	  	});
  	}

  readCalendars() {
  	return this.calendars;
  }

  loadEventsFromNativeCalendar() {
  	let events = [];
  	if(this.plt.is('ios')) {
  		for(let calendar of this.calendars) {
  			this.calendar.findAllEventsInNamedCalendar(calendar.name).then( data => {
  				events.push(...data);
  				this.updateDatabase(events);
  			})
  		}
  	} else if(this.plt.is('android')) {
  		let start = new Date();
  		let end = new Date();
  		start.setDate(start.getDate() - 365);
  		end.setDate(end.getDate() + 5 * 365);
		this.calendar.listEventsInRange(start, end).then( data => {
			events.push(...data);
  			this.updateDatabase(events);
		})
  	}
	return events;
  }

  updateDatabase(events) {
  	if(events.length > 0) {
	  	for(let event of events) {
	  		let calendarEvent = {} as CalendarEvent;
	  		calendarEvent.userid = this.auth.userid;
	  		let startTime = new Date(event.dtstart);
	  		let endTime = new Date(event.dtend);
	  		calendarEvent.startTime = startTime.toISOString();
	  		calendarEvent.endTime = endTime.toISOString();
	  		calendarEvent.title = event.title;
	  		calendarEvent.allDay = event.allDay;
	  		calendarEvent.active = true;
	  		calendarEvent.event_id = event.event_id;
	  		let eventAlreadyInDatabase: boolean = false;
	  		let calendarEventList = this.db.getCalendarEventListFromUser(this.auth.userid)
			.snapshotChanges()
			.pipe(
				map(
					changes => { 
						return changes.map( c => {
							let calendarEvent: CalendarEvent = { 
								key: c.payload.key, ...c.payload.val()
								};
							return calendarEvent;
			});}));
	  		calendarEventList.subscribe( data => {
	  			for(let ev of data) {
	  				if(ev.event_id && ev.event_id == calendarEvent.event_id) {
	  					eventAlreadyInDatabase = true;
	  				}
	  			}
	  			if(!eventAlreadyInDatabase) {
	  				this.db.addCalendarEvent(calendarEvent, this.auth.userid);
	  			}
	  		});
	  	}
	}
  }
}
