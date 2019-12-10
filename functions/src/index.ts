import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
admin.initializeApp();
import * as moment from 'moment';

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
   					if(calendarEvent.val().active != false && eventStartTimeSeconds - timeNowSeconds < 1200 && eventStartTimeSeconds - timeNowSeconds >= 900) {
   						let ref = admin.database().ref('/users/' + user.key + '/devices');
					    ref.once("value", function(devices) {
					    	devices.forEach(function(device) {
					    		let start = moment(calendarEvent.val().startTime).format('HH:mm');
								let end = moment(calendarEvent.val().endTime).format('HH:mm');
						         let payload = {
						              notification: {
						                  title: calendarEvent.val().title,
						                  body: start + '-' + end
						              }
						         };
						         admin.messaging().sendToDevice(device.val(), payload)
						     });})
   					}
   				})
   			})
   		})
   });
     }
);

