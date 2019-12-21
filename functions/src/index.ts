import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
admin.initializeApp();

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
// export const helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

exports.calendarEventPush = functions.pubsub.schedule('*/5 * * * *').onRun((context) => {
   console.log('running');
   admin.database().ref('/users').once("value", function(users) {
   		users.forEach(function(user) {
   			admin.database().ref('/users/' + user.key + '/calendarEvents').once("value", function(calendarEvents) {
   				calendarEvents.forEach(function(calendarEvent) {
   					let eventStartTimeMiliseconds = new Date(calendarEvent.val().startTime).getTime();
   					let eventStartTimeSeconds = eventStartTimeMiliseconds/1000;
   					let timeNowMiliseconds = new Date().getTime();
   					let timeNowSeconds = timeNowMiliseconds/1000;
   					if(!calendarEvent.val().allDay && calendarEvent.val().active != false && eventStartTimeSeconds - timeNowSeconds < 1200 && eventStartTimeSeconds - timeNowSeconds >= 900) {
   						let ref = admin.database().ref('/users/' + user.key + '/devices');
					    ref.once("value", function(devices) {
					    	devices.forEach(function(device) {
					    		let language = 'en';
					    		if(user.val().language) {
					   				language = user.val().language;
					   			}
					   			let message: any = {};
					   			message['de'] = 'Beginnt in Kürze.';
					   			message['en'] = 'Happens soon.';
					   			let msg = message['en'];
					   			if(message[language]) {
					   				msg = message[language];
					   			}
					    		let payload = {
						            notification: {
						                title: calendarEvent.val().title,
						                body: msg
						            },
						            data: {
						              	title: calendarEvent.val().title,
						                body: msg
						            }
						        };
						        admin.messaging().sendToDevice(device.val(), payload);
						     });})
   					} else if(calendarEvent.val().allDay && calendarEvent.val().active != false && eventStartTimeSeconds - timeNowSeconds < 259200 && eventStartTimeSeconds - timeNowSeconds >= 0) {
   						let ref = admin.database().ref('/users/' + user.key + '/devices');
					    ref.once("value", function(devices) {
					    	devices.forEach(function(device) {
					    		let language = 'en';
					    		if(user.val().language) {
					   				language = user.val().language;
					   			}
					   			let message: any = {};
					   			let send: boolean = false;
							   	if(eventStartTimeSeconds - timeNowSeconds >= 172800 && eventStartTimeSeconds - timeNowSeconds < 173100) {
		   							send = true;
		   							message['de'] = "Deadline ist schon bald. Du solltest dich langsam darum kümmern.";
		   							message['en'] = "Deadline approaching. You should soon get this done.";
		   						} else if(eventStartTimeSeconds - timeNowSeconds >= 86400 && eventStartTimeSeconds - timeNowSeconds < 86700) {
		   							send = true;
		   							message['de'] = "Noch immer nicht erledigt? Deadline ist morgen!";
		   							message['en'] = "Still not done? Deadline is tomorrow!";
		   						} else if(eventStartTimeSeconds - timeNowSeconds >= 43200 && eventStartTimeSeconds - timeNowSeconds < 43500) {
		   							send = true;
		   							message['de'] = "Letzte Chance, diese Aufgabe noch rechtzeitig zu erledigen. Deadline ist heute!";
		   							message['en'] = "Last chance to get this done in time. Deadline is today!";
		   						}
		   						let msg = message['en'];
					   			if(message[language]) {
					   				msg = message[language];
					   			}
					    		let payload = {
						            notification: {
						                title: calendarEvent.val().title,
						                body: msg
						            },
						            data: {
						              	title: calendarEvent.val().title,
						                body: msg
						            }
						        };
						        if(send) {
						        	admin.messaging().sendToDevice(device.val(), payload);
						        }
						     });})
					}
   				})
   			})
   		})
   });
   return null;
     }
);

