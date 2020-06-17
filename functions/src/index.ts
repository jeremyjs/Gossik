import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
admin.initializeApp();

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
// export const helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

exports.sendManualPush = functions.database.ref('/push/{newPush}').onCreate((newPush, context) => {
	let push = newPush.val();
	admin.database().ref('/users').once("value", function(users) {
   		users.forEach(function(user) {
   			if(user.val().profile.language == 'de') {
   				let payload = {
		            notification: {
		                title: 'Tipp des Tages',
		                body: push.DE
		            },
		            data: {
		              	title: 'Tipp des Tages',
		                body: push.DE
		            }
		        };
		        let ref = admin.database().ref('/users/' + user.key + '/devices');
			    ref.once("value", function(devices) {
			    	devices.forEach(function(device) {
		        		admin.messaging().sendToDevice(device.val(), payload);
		        	});
			    });
   			} else {
   				let payload = {
		            notification: {
		                title: 'Tip of the day',
		                body: push.EN
		            },
		            data: {
		              	title: 'Tip of the day',
		                body: push.EN
		            }
		        };
		        let ref = admin.database().ref('/users/' + user.key + '/devices');
			    ref.once("value", function(devices) {
			    	devices.forEach(function(device) {
		        		admin.messaging().sendToDevice(device.val(), payload);
		        	});
			    });
   			}
   		});
   	});
   	return null;
});

exports.AnimateThoughtsPush = functions.pubsub.schedule('*/5 * * * *').onRun((context) => {
    admin.database().ref('/users').once("value", function(users) {
   		users.forEach(function(user) {
   			let timeNowMiliseconds = new Date().getTime();
   			let timeNowSeconds = timeNowMiliseconds/1000;
   			let signUpDateTimeMiliseconds = new Date(user.val().profile.signUpDate).getTime();
   			let signUpDateTimeSeconds = signUpDateTimeMiliseconds/1000;
   			if(timeNowSeconds - signUpDateTimeSeconds >= 86400 && timeNowSeconds - signUpDateTimeSeconds < 86700) {
				let message: any = {};
				let title: any = {};
				title['de'] = "Befreie deinen Kopf";
				message['de'] = "Hey, ich bins. Ich kann dir am besten helfen, wenn du jeden Gedanken jeweils direkt als Post-It bei mir aufschreibst. Versuch das heute doch mal!";
				title['en'] = "Free your mind";
				message['en'] = "Hey, it's me. I can help you best if you write down each thought as a post-it for me. Let's try it today!";
				
				let language = 'en';
	    		if(user.val().profile.language) {
	   				language = user.val().profile.language;
	   			}
				let msg = message['en'];
				let ttl = title['en'];
	   			if(message[language]) {
	   				msg = message[language];
	   			}
	   			if(title[language]) {
	   				ttl = title[language];
	   			}
	    		let payload = {
		            notification: {
		                title: ttl,
		                body: msg
		            },
		            data: {
		              	title: ttl,
		                body: msg
		            }
		        };
		        let ref = admin.database().ref('/users/' + user.key + '/devices');
			    ref.once("value", function(devices) {
			    	devices.forEach(function(device) {
		        		admin.messaging().sendToDevice(device.val(), payload);
		        	});
			    });
			}
		})
   });
   return null;
     }
);

exports.checkInactivePush = functions.pubsub.schedule('*/5 * * * *').onRun((context) => {
    admin.database().ref('/users').once("value", function(users) {
   		users.forEach(function(user) {
			let lastLoginTimeMiliseconds = new Date(user.val().profile.lastLogin).getTime();
   			let lastLoginTimeSeconds = lastLoginTimeMiliseconds/1000;
   			if(timeNowSeconds - lastLoginTimeSeconds >= 172800 && timeNowSeconds - lastLoginTimeSeconds < 173100) {
				let message: any = {};
				let title: any = {};
				title['de'] = "Alles gut?";
				message['de'] = "Hey, ich habe schon lange nichts mehr von dir gehört. Alles okay? Ich würde dir liebend gerne helfen, nutze mich doch für ein Projekt um dich davon zu überzeugen!";
				title['en'] = "Everything okay?";
				message['en'] = "Hey, I haven't heard from you in a while. Everything okay? I'd love to help you, use me for a project to convince you!";
				
				let language = 'en';
	    		if(user.val().profile.language) {
	   				language = user.val().profile.language;
	   			}
				let msg = message['en'];
				let ttl = title['en'];
	   			if(message[language]) {
	   				msg = message[language];
	   			}
	   			if(title[language]) {
	   				ttl = title[language];
	   			}
	    		let payload = {
		            notification: {
		                title: ttl,
		                body: msg
		            },
		            data: {
		              	title: ttl,
		                body: msg
		            }
		        };
		        let ref = admin.database().ref('/users/' + user.key + '/devices');
			    ref.once("value", function(devices) {
			    	devices.forEach(function(device) {
		        		admin.messaging().sendToDevice(device.val(), payload);
		        	});
			    });
			}
		})
   });
   return null;
     }
);

exports.calendarEventPush = functions.pubsub.schedule('*/5 * * * *').onRun((context) => {
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
					    		if(user.val().profile.language) {
					   				language = user.val().profile.language;
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
						     });});
   					} else if(calendarEvent.val().allDay && calendarEvent.val().active != false && eventStartTimeSeconds - timeNowSeconds < 259200 && eventStartTimeSeconds - timeNowSeconds >= 0) {
   						let ref = admin.database().ref('/users/' + user.key + '/devices');
					    ref.once("value", function(devices) {
					    	devices.forEach(function(device) {
					    		let language = 'en';
					    		if(user.val().profile.language) {
					   				language = user.val().profile.language;
					   			}
					   			let message: any = {};
					   			let send: boolean = false;
							   	if(eventStartTimeSeconds - timeNowSeconds >= 86400 && eventStartTimeSeconds - timeNowSeconds < 86700) {
		   							send = true;
		   							message['de'] = "Hey, diese Deadline ist schon bald. Du solltest dich langsam darum kümmern.";
		   							message['en'] = "Hey, this deadline is approaching. You should soon get this done.";
		   						} else if(eventStartTimeSeconds - timeNowSeconds >= 0 && eventStartTimeSeconds - timeNowSeconds < 300) {
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
						     });});
					}
   				});
   			});
   		})
   });
   return null;
     }
);

exports.checkInactive Push = functions.pubsub.schedule('*/5 * * * *').onRun((context) => {
    admin.database().ref('/users').once("value", function(users) {
   		users.forEach(function(user) {

   		})
   });
   return null;
     }
);

