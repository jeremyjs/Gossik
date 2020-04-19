import { Injectable } from '@angular/core';
import { Calendar } from '@ionic-native/calendar/ngx';
import { Platform } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class NativeCalendarService {

	calendars = [];

  constructor(
  	private calendar: Calendar,
  	private plt: Platform
  	) {
	  	this.plt.ready().then( () => {
	  		this.calendar.listCalendars().then( data => {
	  			this.calendars = data;
	  		});
	  	});
  	}

  readCalendars() {
  	console.log("Click");
  	console.log(this.calendars);
  	return this.calendars;
  }

}
