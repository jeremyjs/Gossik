import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
admin.initializeApp();

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
// export const helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

function convertDateToLocaleDate(date: Date, offset: number) {
	let convertedDate = new Date(date.getTime() - offset*60*1000);
	return convertedDate;
}


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

exports.AnimateThoughtsPush = functions.pubsub.schedule('0 12 * * *').onRun((context) => {
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

exports.checkInactivePush = functions.pubsub.schedule('0 12 * * *').onRun((context) => {
    admin.database().ref('/users').once("value", function(users) {
   		users.forEach(function(user) {
   			let timeNowMiliseconds = new Date().getTime();
   			let timeNowSeconds = timeNowMiliseconds/1000;
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

exports.tutorialthoughtsPush = functions.pubsub.schedule('0 * * * *').onRun((context) => {
    admin.database().ref('/users').once("value", function(users) {
   		users.forEach(function(user) {
			admin.database().ref('/users/' + user.key + '/nextActions').child('tutorial').once("value", function(action) {
   				let timeNowMiliseconds = new Date().getTime();
   				let timeActionEndedMiliseconds = new Date(action.val().endDate).getTime();
   				if(timeNowMiliseconds >= timeActionEndedMiliseconds + 3600000 && timeNowMiliseconds < timeActionEndedMiliseconds + 7200000) {
   					admin.database().ref('/users/' + user.key + '/devices').once("value", function(devices) {
				    	devices.forEach(function(device) {
				    		let language = 'en';
				    		if(user.val().profile.language) {
				   				language = user.val().profile.language;
				   			}
				   			let message: any = {};
   							message['de'] = "Hey, ich bins nochmal. Während dem Abarbeiten deiner ersten eigenen ToDos, möchte ich dich noch zusätzlich herausfordern: Bis morgen Abend alle Gedanken, die dir über den Tag durch einfallen und die du nicht vergessen willst, bei mir auf der 'Organisieren' Seite als Gedanken zu speichern. Morgen Abend werden wir diese dann gemeinsam zu neuen ToDos verarbeiten.";
   							message['en'] = "Hey, it's me again. I want to additionally challenge you while working on your first own todos: Use me to write down any thoughts on the 'Organize' page that come up during the day tomorrow and that you don't want to forget. Tomorrow in the evening we will process your thoughts to new todos together.";
	   						let msg = message['en'];
				   			if(message[language]) {
				   				msg = message[language];
				   			}
				    		let payload = {
					            notification: {
					                title: "Gossik",
					                body: msg
					            },
					            data: {
					              	title: "Gossik",
					                body: msg
					            }
					        };
					       	admin.messaging().sendToDevice(device.val(), payload);
					     });
				    });
				  	admin.database().ref('/users/' + user.key + '/profile/tutorial').child('thoughts').set('true');  
				}
   			});
   		})
   });
   return null;
     }
);

exports.tutorialThoughtprocessingPush = functions.pubsub.schedule('0 * * * *').onRun((context) => {
    admin.database().ref('/users').once("value", function(users) {
   		users.forEach(function(user) {
			admin.database().ref('/users/' + user.key + '/nextActions').child('tutorial').once("value", function(action) {
   				if(action.val() && action.val().endDate) {
   					let timeNowMiliseconds = new Date().getTime();
   					let endDateMiliseconds = new Date(action.val().endDate).getTime();
   					let timeNowConverted = convertDateToLocaleDate(new Date(), user.val().profile.timezoneOffset);
   					if(timeNowMiliseconds - endDateMiliseconds >= 24*3600*1000 && timeNowMiliseconds - endDateMiliseconds < 24*3600*1000*2 && timeNowConverted.getHours() == 20) {
   						let numberThoughts: number = 0;
   						admin.database().ref('/users/' + user.key + '/captures').orderByChild('active').equalTo(true).once("value", function(thoughts) {
					    	thoughts.forEach(function(thought) {
					    		numberThoughts += 1;
					    	});
					    	admin.database().ref('/users/' + user.key + '/devices').once("value", function(devices) {
					    		devices.forEach(function(device) {
						    		let language = 'en';
						    		if(user.val().profile.language) {
						   				language = user.val().profile.language;
						   			}
						   			let message: any = {};
						   			if(numberThoughts >= 1) {
		   								message['de'] = "Hey, hier bin ich wieder. Sehr interessant, was du so für Gedanken hast. Spass, Datenschutz ist uns sehr wichtig und niemand wird je deine Daten anschauen. Einzig ich werde von deinen Daten lernen, um dich besser unterstützen zu können, wenn du mir das erlaubst. Bereit für Teil 2 der Einleitung? Öffne mich, um das Verarbeiten deiner gespeicherten Gedanken gemeinsam anzuschauen, ich freue mich.";
		   								message['en'] = "Hey, here I am again. Really interesting, what kind of thoughts you have. Joke, data privacy is very important to us and nobody will ever see your data. Only I will learn from your data to better support you, if you allow me to do that. Ready for part 2 of the tutorial? Open me to have a look at the processing of your saved thoughts together, I am looking forward to it.";
			   							admin.database().ref('/users/' + user.key + '/profile/tutorial').child('thoughtprocessing').set('true');
			   						} else {
			   							message['de'] = "Hey, ich sehe du hast noch keine Gedanken gespeichert. Sehr schade, das würde nämlich richtig gut helfen. Versuch es doch einmal und wir schauen morgen nochmals.";
			   							message['en'] = "Hey, I see you haven't any thoughts saved. It's a pity, because it would help you really well. Why don't you try it and we'll see us again tomorrow.";
			   							let newEndDate = new Date();
			   							newEndDate.setHours(newEndDate.getHours() -3);
			   							admin.database().ref('/users/' + user.key + '/nextActions/tutorial').child('endDate').set(newEndDate.toISOString());
			   						}
			   						let msg = message['en'];
						   			if(message[language]) {
						   				msg = message[language];
						   			}
						    		let payload = {
							            notification: {
							                title: "Gossik",
							                body: msg
							            },
							            data: {
							              	title: "Gossik",
							                body: msg
							            }
							        };
							       	admin.messaging().sendToDevice(device.val(), payload);
							    });
						    });
						    if(numberThoughts >= 1) {
						    	admin.database().ref('/users/' + user.key + '/profile/tutorial').child('thoughtprocessing').set('true');	
						    }
					    });
   					}
				}
   			});
   		})
   });
   return null;
     }
);

/*
exports.modifyUsers = functions.pubsub.schedule('* * * * *').onRun((context) => {
    admin.database().ref('/users').once("value", function(users) {
   		users.forEach(function(user) {
			let profile = { 
				profile: {
					language: 'en',
	   				email: user.val().email,
	   				lastLogin: new Date().toISOString(),
	   				signUpDate: new Date().toISOString(),
	   				tutorial: {
		                'fivetodos': true,
		                'thoughtprocessing': true,
		                'projects': true,
		                'informations': true,
		                'calendar': true
		            }
				}
   			};
   			if(user.val().language) {
   				profile.profile.language = user.val().language;
   			}
   			if(user.val().lastLogin) {
   				profile.profile.lastLogin = user.val().lastLogin;
   			}
   			if(user.val().signUpDate) {
   				profile.profile.signUpDate = user.val().signUpDate;
   			}
   			user.ref.update(profile);
   		})
   });
   return null;
     }
);
*/

