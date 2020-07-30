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

exports.getToKnowPush = functions.pubsub.schedule('0 6 * * *').onRun((context) => {
    admin.database().ref('/users').once("value", function(users) {
   		users.forEach(function(user) {
			let timeNowMiliseconds = new Date().getTime();
			let signUpDateTimeMiliseconds = new Date(user.val().profile.signUpDate).getTime();
			if(timeNowMiliseconds - signUpDateTimeMiliseconds >= 5*3600*1000 && timeNowMiliseconds - signUpDateTimeMiliseconds < 29*3600*1000) {
		    	admin.database().ref('/users/' + user.key + '/devices').once("value", function(devices) {
		    		devices.forEach(function(device) {
			    		let language = 'en';
			    		if(user.val().profile.language) {
			   				language = user.val().profile.language;
			   			}
			   			let message: any = {};
							message['de'] = "Hey, ich bins nochmals. Da wir noch in der Kennenlernphase sind, werde ich dir hin und wieder Benachrichtigungen schicken, um zu lernen, wann du was machen willst - oder gar nichts machen willst. So lerne ich dich und deinen Tagesablauf kennen und kann dich dann aktiv unterstützen.";
							message['en'] = "Hey, it's me again. We are still in the process of getting to know each other. Therefore I will send you push notifications once in a while to learn when you want to do what - or do nothing at all. Like this, I can get to know you and your daily schedule and then actively support you.";
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
		    }
   		})
   });
   return null;
     }
);

exports.tutorialThoughtsPush = functions.pubsub.schedule('0 * * * *').onRun((context) => {
    admin.database().ref('/users').once("value", function(users) {
   		users.forEach(function(user) {
			let timeNowMiliseconds = new Date().getTime();
			let triggerDateMiliseconds = new Date(user.val().profile.tutorial.triggerDate).getTime();
			if(user.val().profile.tutorial.next == 'thoughts' && timeNowMiliseconds - triggerDateMiliseconds >= 3600*1000 && timeNowMiliseconds - triggerDateMiliseconds < 2*3600*1000) {
		    	admin.database().ref('/users/' + user.key + '/devices').once("value", function(devices) {
			    	devices.forEach(function(device) {
			    		let language = 'en';
			    		if(user.val().profile.language) {
			   				language = user.val().profile.language;
			   			}
			   			let message: any = {};
						message['de'] = "Hey, ich bins nochmal. Während dem Abarbeiten deiner ersten eigenen ToDos, möchte ich dich noch zusätzlich herausfordern. Die 'Gedanken' Seite wurde soeben freigeschaltet, öffne mich und besuch diese mal.";
						message['en'] = "Hey, it's me again. I want to additionally challenge you while working on your first own todos. The 'Thoughts' page has just been unlocked, open me and visit it.";
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
		  	admin.database().ref('/users/' + user.key + '/profile/tutorial').child('thoughts').set(true);
		  	admin.database().ref('/users/' + user.key + '/profile/tutorial').child('next').set('');
		  	admin.database().ref('/users/' + user.key + '/profile/tutorial').child('triggerDate').set('');  
		  	admin.database().ref('/users/' + user.key + '/profile/tutorial').child('tutorialProgress').set(1);  
			}
   		})
   });
   return null;
     }
);

exports.tutorialThoughtprocessingPush = functions.pubsub.schedule('0 * * * *').onRun((context) => {
    admin.database().ref('/users').once("value", function(users) {
   		users.forEach(function(user) {
			let timeNowMiliseconds = new Date().getTime();
			let timeNowConverted = convertDateToLocaleDate(new Date(), user.val().profile.timezoneOffset);
			let triggerDateMiliseconds = new Date(user.val().profile.tutorial.triggerDate).getTime();
			if(user.val().profile.tutorial.next == 'thoughtprocessing' && timeNowMiliseconds - triggerDateMiliseconds >= 24*3600*1000 && timeNowMiliseconds - triggerDateMiliseconds < 48*3600*1000 && timeNowConverted.getHours() == 20) {
				admin.database().ref('/users/' + user.key + '/captures').orderByChild('active').equalTo(true).once("value", function(thoughts) {
		    		let numberThoughts: number = 0;
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
   								message['de'] = "Hey, hier bin ich wieder. Sehr interessant, was du so für Gedanken hast. Spass, Datenschutz ist uns sehr wichtig und niemand wird je deine Daten anschauen. Einzig ich werde von deinen Daten lernen, um dich besser unterstützen zu können, wenn du mir das erlaubst. Öffne mich und besuche die 'Organisieren' Seite.";
   								message['en'] = "Hey, here I am again. You really do have interesting thoughts. Joke, we take data privacy very seriously and nobody will ever read your data. Only I will learn from you to better support you, if you allow me that. Open me and visit the 'Thoughts' page.";
	   							admin.database().ref('/users/' + user.key + '/profile/tutorial').child('thoughtprocessing').set('true');
	   						} else {
	   							message['de'] = "Hey, ich sehe du hast noch keine Gedanken gespeichert. Sehr schade, das würde nämlich richtig gut helfen. Versuch es doch einmal und wir schauen morgen nochmals. Für den nächsten Teil der Einleitung benötigen wir mindestens einen gespeicherten Gedanken.";
	   							message['en'] = "Hey, I see you haven't any thoughts saved. It's a pity, because it would help you really well. Why don't you try it and we'll see us again tomorrow. For the next part of the tutorial, we need at least one saved thought.";
	   							let newTriggerDate = new Date();
	   							newTriggerDate.setHours(newTriggerDate.getHours() -3);
	   							admin.database().ref('/users/' + user.key + '/profile/tutorial').child('triggerDate').set(newTriggerDate.toISOString());
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
   		})
   });
   return null;
     }
);

exports.tutorialProjectsPush = functions.pubsub.schedule('0 * * * *').onRun((context) => {
    admin.database().ref('/users').once("value", function(users) {
   		users.forEach(function(user) {
			if(user.val().profile.tutorial.next == 'projects') {
				let timeNowMiliseconds = new Date().getTime();
				let triggerDateMiliseconds = new Date(user.val().profile.tutorial.triggerDate).getTime();
				let timeNowConverted = convertDateToLocaleDate(new Date(), user.val().profile.timezoneOffset);
				//previous tutorial is finished after 8pm, therefore if we set it 24h+ later, it will be after 2 days becaus next day 8pm won't be 24h+ after the trigger.
				//Thus, setting it to between 12 and 36h
				if(timeNowMiliseconds - triggerDateMiliseconds >= 12*3600*1000 && timeNowMiliseconds - triggerDateMiliseconds < 36*3600*1000 && timeNowConverted.getHours() == 20) {
			    	admin.database().ref('/users/' + user.key + '/devices').once("value", function(devices) {
			    		devices.forEach(function(device) {
				    		let language = 'en';
				    		if(user.val().profile.language) {
				   				language = user.val().profile.language;
				   			}
				   			let message: any = {};
   							message['de'] = "Hey, schon wieder ich. Bereit für den letzten Teil der Einleitung? Öffne mich und besuche die 'Anschauen' Seite, um das Gruppieren von ToDos zu Projekten mit mir anzuschauen.";
   							message['en'] = "Hey, it's me again. Are you ready for the last part of the tutorial? Open me and visit the 'View' page to have a look on the grouping of todos into projects with me.";
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
				    admin.database().ref('/users/' + user.key + '/profile/tutorial').child('projects').set(true);
				    admin.database().ref('/users/' + user.key + '/profile/tutorial').child('next').set('');
				    admin.database().ref('/users/' + user.key + '/profile/tutorial').child('triggerDate').set('');
				}
			}
   		})
   });
   return null;
     }
);

exports.interactProcessThoughtsPush = functions.pubsub.schedule('0 * * * *').onRun((context) => {
    admin.database().ref('/users').once("value", function(users) {
   		users.forEach(function(user) {
			let timeNowConverted = convertDateToLocaleDate(new Date(), user.val().profile.timezoneOffset);
			if(timeNowConverted.getHours() == 20) {
				let numberThoughts: number = 0;
				admin.database().ref('/users/' + user.key + '/captures').orderByChild('active').equalTo(true).once("value", function(thoughts) {
		    		thoughts.forEach(function(thought) {
		    			numberThoughts += 1;
		    		});
		    		if(numberThoughts >= 20) {
			    		admin.database().ref('/users/' + user.key + '/devices').once("value", function(devices) {
			    			devices.forEach(function(device) {
					    		let language = 'en';
					    		if(user.val().profile.language) {
					   				language = user.val().profile.language;
					   			}
					   			let message: any = {};
								message['de'] = "Hey, deine gespeicherten Gedanken häufen sich an. Ich kann dir besser helfen, wenn du diese regelmässig zu ToDos verarbeitest. Nutze doch 20 Minuten, um deine aktuellen Gedanken zu verarbeiten, das befreit enorm.";
								message['en'] = "Hey, your saved thoughts are becoming more and more. I can better help you, if you regularly process them to todos. Why don't you use 20 minutes to process your current thoughts, it frees your mind.";
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
			    	}
			    });
			}
   		})
   });
   return null;
     }
);

function getRandomInteger(min: number, max: number) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

exports.setRandomPushTimes = functions.pubsub.schedule('0 * * * *').onRun((context) => {
    admin.database().ref('/users').once("value", function(users) {
   		users.forEach(function(user) {
   			let timeNowConverted = convertDateToLocaleDate(new Date(), user.val().profile.timezoneOffset);
			if(timeNowConverted.getHours() == 0) {
	   			let randomPushTimes = [];
	   			randomPushTimes.push(getRandomInteger(8,11));
	   			randomPushTimes.push(getRandomInteger(13,21));
	   			randomPushTimes.push(getRandomInteger(13,21));
				admin.database().ref('/users/' + user.key + '/profile').child('randomPushTimes').set(randomPushTimes);
   			}
   		})
   });
   return null;
     }
);

exports.checkRandomTodoDone = functions.pubsub.schedule('* * * * *').onRun((context) => {
    admin.database().ref('/users').once("value", function(users) {
   		users.forEach(function(user) {
   			let timeNowConverted = convertDateToLocaleDate(new Date(), user.val().profile.timezoneOffset);
			if(timeNowConverted.getHours() == 23) {
	   			admin.database().ref('/users/' + user.key + '/pushNotifications').once("value", function(pushNotifications) {
	   				pushNotifications.forEach(function(pushNotification) {
	   					admin.database().ref('/users/' + user.key + '/nextActions/' + pushNotification.val().todoid).once("value", function(todo) {
	   						if(todo.val().startDate && todo.val().goalid) {
								let startDate = new Date(todo.val().startDate);
								let randomPushTimeDate = new Date(pushNotification.val().createDate);
								if(startDate.getTime() - randomPushTimeDate.getTime() <= 3600*1000 && startDate.getTime() - randomPushTimeDate.getTime() >= 0) {
									admin.database().ref('/users/' + user.key + '/profile/learnedSchedule').once("value", function(learnedSchedule) {
										let learnedScheduleObject = JSON.parse(learnedSchedule.val().toString());
										let localeDate = convertDateToLocaleDate(startDate, user.val().profile.timezoneOffset);
										let weekDay = localeDate.getDay() - 1;
				                        if(weekDay == -1) {
				                            weekDay = 6;
				                        }
				                        //getHours() uses local date, so here in cloud it uses us-central1 locale date which has timezoneOffset 0
				                        //to get back users local hour, we here also need to use localeDate
				                        let hour = localeDate.getHours();
				                        let row = weekDay * 24 + hour;
				                        learnedScheduleObject[row][todo.val().goalid] += 1;
										admin.database().ref('/users/' + user.key + '/profile').child('learnedSchedule').set(JSON.stringify(learnedScheduleObject));
									});
								} else {
									let randomPushTimeDate = new Date(pushNotification.val().createDate);
									admin.database().ref('/users/' + user.key + '/profile/learnedSchedule').once("value", function(learnedSchedule) {
										let learnedScheduleObject = JSON.parse(learnedSchedule.val().toString());
										let localeDate = convertDateToLocaleDate(randomPushTimeDate, user.val().profile.timezoneOffset);
										let weekDay = localeDate.getDay() - 1;
				                        if(weekDay == -1) {
				                            weekDay = 6;
				                        }
				                        //getHours() uses local date, so here in cloud it uses us-central1 locale date which has timezoneOffset 0
				                        //to get back users local hour, we here also need to use localeDate
				                        let hour = localeDate.getHours();
				                        let row = weekDay * 24 + hour;
				                        for(let goalid in learnedScheduleObject[row]) {
											learnedScheduleObject[row][goalid] -= 0.1;
										}
										admin.database().ref('/users/' + user.key + '/profile').child('learnedSchedule').set(JSON.stringify(learnedScheduleObject));
									});
								}
							} else {
								let randomPushTimeDate = new Date(pushNotification.val().createDate);
								admin.database().ref('/users/' + user.key + '/profile/learnedSchedule').once("value", function(learnedSchedule) {
									let learnedScheduleObject = JSON.parse(learnedSchedule.val().toString());
									let localeDate = convertDateToLocaleDate(randomPushTimeDate, user.val().profile.timezoneOffset);
									let weekDay = localeDate.getDay() - 1;
			                        if(weekDay == -1) {
			                            weekDay = 6;
			                        }
			                        //getHours() uses local date, so here in cloud it uses us-central1 locale date which has timezoneOffset 0
			                        //to get back users local hour, we here also need to use localeDate
			                        let hour = localeDate.getHours();
			                        let row = weekDay * 24 + hour;
				                    for(let goalid in learnedScheduleObject[row]) {
										learnedScheduleObject[row][goalid] -= 0.1;
									}
									admin.database().ref('/users/' + user.key + '/profile').child('learnedSchedule').set(JSON.stringify(learnedScheduleObject));
								});
							}
							admin.database().ref('/users/' + user.key + '/pushNotifications/' + pushNotification.key).remove();
	   					})
	   				});
	   			});
   			}
   		});
   });
   return null;
     }
);

exports.sendRandomTodoPush = functions.pubsub.schedule('25 * * * *').onRun((context) => {
    admin.database().ref('/users').once("value", function(users) {
   		users.forEach(function(user) {
			let timeNowConverted = convertDateToLocaleDate(new Date(), user.val().profile.timezoneOffset);
			if(user.val().profile.randomPushTimes) {
				if(user.val().profile.randomPushTimes.indexOf(timeNowConverted.getHours()) != -1) {
					if(user.val().nextActions) {
						let todos = [];
						for(let key in user.val().nextActions) {
							if(user.val().nextActions[key].active != false && user.val().nextActions[key].time <= 30) {
								let todo = user.val().nextActions[key]
								todo['todoid'] = key;
								todos.push(todo);
							}
						}
						if(todos.length > 0) {
							//currently we pick a random todo, later on the one with the highest priority
							//todos.sort((a, b) => (a.priority/1 < b.priority/1) ? 1 : -1);
							let randomTodo = todos[Math.floor(Math.random()*todos.length)]      
							let language = 'en';
				    		if(user.val().profile.language) {
				   				language = user.val().profile.language;
				   			}
				   			let message: any = {};
				   			let title: any = {};
							message['de'] = "Hey, hast du " + String(randomTodo.time) + " Minuten Zeit? Dann könntest du mich öffnen und folgendes ToDo abarbeiten: " + String(randomTodo.content);
							message['en'] = "Hey, do you have " + String(randomTodo.time) + "min? You could open me and get the following to-do done: " + String(randomTodo.content);
							title['de'] = "Lass uns das erledigen";
							title['en'] = "Let's get this done";
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
					                body: msg,
					                target: 'todo',
					                todoid: randomTodo.todoid
					            }
					        };
				    		admin.database().ref('/users/' + user.key + '/devices').once("value", function(devices) {
				    			devices.forEach(function(device) {
							       	admin.messaging().sendToDevice(device.val(), payload);
						    	});
					    	});
					    	let pushNotification = {
					    		message: msg,
					    		todoid: randomTodo.todoid,
					    		createDate: new Date().toISOString()
					    	}
					    	admin.database().ref('/users/' + user.key + '/pushNotifications').push(pushNotification);
						}
					}
				}
			} else {
				let randomPushTimes = [];
	   			randomPushTimes.push(getRandomInteger(8,11));
	   			randomPushTimes.push(getRandomInteger(13,21));
	   			randomPushTimes.push(getRandomInteger(13,21));
				admin.database().ref('/users/' + user.key + '/profile').child('randomPushTimes').set(randomPushTimes);
			}
   		})
   });
   return null;
     }
);

/*exports.sendDebugPush = functions.pubsub.schedule('* * * * *').onRun((context) => {
	console.log('Bun');
    admin.database().ref('/users/R1CFRqnvsmdJtxIJZIvgF1Md0lr1').once("value", function(user) {
		let todos = [];
		for(let key in user.val().nextActions) {
			if(user.val().nextActions[key].active != false) {
				let todo = user.val().nextActions[key]
				todo['todoid'] = key;
				todos.push(todo);
			}
		}
		if(todos.length > 0) {
			//currently we pick a random todo, later on the one with the highest priority
			//todos.sort((a, b) => (a.priority/1 < b.priority/1) ? 1 : -1);
			let randomTodo = todos[Math.floor(Math.random()*todos.length)]      
   			let payload = {
	            notification: {
	                title: "Gossik",
	                body: "Hoiiiii"
	            },
	            data: {
	              	title: "Gossik",
	                body: "Hoiiiii",
	                target: 'todo',
	                todoid: randomTodo.todoid
	            }
	        };
    		admin.database().ref('/users/' + user.key + '/devices').once("value", function(devices) {
    			devices.forEach(function(device) {
			       	admin.messaging().sendToDevice(device.val(), payload)
			       	.catch(err => {
			       		console.log('caaaatchiiiiiing');
			       		console.log(err);
			       	});
		    	});
	    	});
	    	let pushNotification = {
	    		message: "Hoiiiii",
	    		todoid: randomTodo.todoid,
	    		createDate: new Date().toISOString()
	    	}
	    	admin.database().ref('/users/' + user.key + '/pushNotifications').push(pushNotification);
		}
   	});
   	return null;
});
*/



// Modifying the database manually for each user
/*
exports.modifyUsers = functions.pubsub.schedule('* * * * *').onRun((context) => {
    admin.database().ref('/users').once("value", function(users) {
   		users.forEach(function(user) {
			let tutorial = {
				tutorial: {
		                'fivetodos': true,
		                'thoughtprocessing': false,
		                'projects': false,
		                'calendar': true,
		                'gettingToKnowPush': false,
		                'thoughts': false,
		                'process': false,
		                'next': '',
		                'triggerDate': '',
		                'tutorialProgress': 0,
		                'tutorialNextButton': false,
		                'tutorialTodoPageTime': false
		            }
		    };
   			admin.database().ref('/users/' + user.key + '/profile').update(tutorial);
   			// update just one specific value
   			//admin.database().ref('/users/' + user.key + '/profile').child('timezoneOffset').set(-120);
   		})
   });
   return null;
     }
);
*/

