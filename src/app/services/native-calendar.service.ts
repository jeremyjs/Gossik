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

  async loadEventsFromNativeCalendar() {
  	let events = [];
  	let calendarEvents: CalendarEvent[] = [];
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
  	for (let event of events) {
  		let calendarEvent = {
  			userid: this.auth.userid,
  			title: event.title,
  			active: true,
  			native: true,
  			color: "#C0C0C0"
  		} as CalendarEvent;
  		if(this.platform.is('android')) {
  			calendarEvent.startTime = new Date(event.dtstart);
  			calendarEvent.endTime = new Date(event.dtend);
  			calendarEvent.event_id = event.event_id;
  			calendarEvent.eventLocation = event.eventLocation;
  			calendarEvent.allDay = event.allDay;
  		} else if(this.platform.is('ios')) {
  			calendarEvent.startTime = new Date(event.startDate.replace(' ', 'T'));
  			calendarEvent.endTime = new Date(event.endDate.replace(' ', 'T'));
  			calendarEvent.event_id = event.id;
  		}
  		calendarEvents.push(calendarEvent);
  	}
	return calendarEvents;
  }

  deleteEvent(eventId) {
  	// I had to add the catch block because otherwise we get an unhandled promise rejection error even though the event gets deleted and everything works fine.
  	return this.calendar.deleteEventById(eventId).then( resolved => {
  	}).catch( rejected => {
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
