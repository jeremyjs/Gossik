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
  	private platform: Platform,
  	private db: DatabaseService,
  	private auth: AuthenticationService
  	) {
	  	this.platform.ready().then( () => {
	  		if(platform.is('cordova')) {
	  			this.calendar.listCalendars().then( data => {
		  			this.calendars = data;
		  		});
	  		}
	  	});
  	}

  readCalendars() {
  	return this.calendars;
  }

  updateDatabase() {
  	this.loadEventsFromNativeCalendar().then( events => {
	  	if(events.length > 0) {
		  	for(let event of events) {
		  		let calendarEvent = {} as CalendarEvent;
		  		calendarEvent.userid = this.auth.userid;
		  		if(this.platform.is('android')) {
		  			calendarEvent.startTime = new Date(event.dtstart).toISOString();
		  			calendarEvent.endTime = new Date(event.dtend).toISOString();
		  			calendarEvent.event_id = event.event_id;
		  			calendarEvent.eventLocation = event.eventLocation;
		  			calendarEvent.allDay = event.allDay;
		  		} else if(this.platform.is('ios')) {
		  			calendarEvent.startTime = new Date(event.startDate).toISOString();
		  			calendarEvent.endTime = new Date(event.endDate).toISOString();
		  			calendarEvent.event_id = event.id;
		  		}
		  		calendarEvent.title = event.title;
		  		calendarEvent.active = true;
		  		let eventAlreadyInDatabase: boolean = false;
		  		let eventInDatabase = {} as CalendarEvent;
		  		let calendarEventList = this.db.getCalendarEventListFromUser(this.auth.userid)
				.snapshotChanges()
				.pipe(take(1),
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
		  					eventInDatabase = ev;
		  				}
		  			}
		  			if(!eventAlreadyInDatabase) {
		  				this.db.addCalendarEvent(calendarEvent, this.auth.userid);
		  			} else {
		  				if(eventInDatabase.title != calendarEvent.title || eventInDatabase.startTime != calendarEvent.startTime || eventInDatabase.endTime != calendarEvent.endTime || eventInDatabase.allDay != calendarEvent.allDay || eventInDatabase.eventLocation != calendarEvent.eventLocation) {
			  				calendarEvent.key = eventInDatabase.key;
			  				this.db.editCalendarEvent(calendarEvent, this.auth.userid);
			  			}

		  			}
		  		});
		  	}
		}
		this.deleteDatabaseEventsFromDeletedNativeEvents();
  	});
  }

  async loadEventsFromNativeCalendar() {
  	let events = [];
  	if(this.platform.is('ios')) {
  		for(let calendar of this.calendars) {
  			let nativeEvents = await this.calendar.findAllEventsInNamedCalendar(calendar.name);
  			events.push(...nativeEvents);
  		}
  	} else if(this.platform.is('android')) {
  		let start = new Date();
  		let end = new Date();
  		start.setDate(start.getDate() - 7);
  		end.setDate(end.getDate() + 5 * 365);
		let nativeEvents = await this.calendar.listEventsInRange(start, end);
		events.push(...nativeEvents);
  	}
	return events;
  }

  deleteEvent(eventId) {
  	// I had to add the catch block because otherwise we get an unhandled promise rejection error even though the event gets deleted and everything works fine.
  	return this.calendar.deleteEventById(eventId).then( resolved => {
  	}).catch( rejected => {
  	});
  }

  deleteDatabaseEventsFromDeletedNativeEvents() {
  	this.loadEventsFromNativeCalendar().then( calEvents => {
  	let calendarEventList = this.db.getCalendarEventListFromUser(this.auth.userid)
	.snapshotChanges()
	.pipe(take(1),
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
			if(ev.event_id && ev.active) {
				if(this.platform.is('android')) {
					let nEvent = calEvents.find(nativeEvent => nativeEvent.event_id == ev.event_id);
					if(nEvent == undefined) {
						this.db.deleteCalendarEvent(ev.key, this.auth.userid);
					}
				} else if(this.platform.is('ios')) {
					let nEvent = calEvents.find(nativeEvent => nativeEvent.id == ev.event_id);
					if(nEvent == undefined) {
						this.db.deleteCalendarEvent(ev.key, this.auth.userid);
					}
				}
			}
		}
	});
  	});
  }

  addEvent(eventTitle, eventLocation, eventStartTime, eventEndTime) {
  	let startTime = new Date(eventStartTime);
  	let endTime = new Date(eventEndTime);
  	return this.calendar.createEvent(eventTitle, eventLocation, undefined, startTime, endTime);
  }

  hasReadWritePermission() {
  	return this.calendar.hasReadWritePermission();
  }

  requestReadWritePermission() {
  	return this.calendar.requestReadWritePermission();
  }
}
