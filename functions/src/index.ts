import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { Suggestion } from '../../src/model/suggestion/suggestion.model';
import { Action } from '../../src/model/action/action.model';
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
	return admin.database().ref('/users').once("value", function(users) {
		let promises: Promise<any>[] = [];
		users.forEach(function(user) {
			if(user.val().devices) {
				if(user.val().profile.language == 'de') {
					let payload = {
						notification: {
							title: 'Gossik Info',
							body: push.DE
						},
						data: {
							title: 'Gossik Info',
							body: push.DE
						}
					};
					Object.values(user.val().devices).forEach( (device) => {
						promises.push(admin.messaging().sendToDevice(String(device), payload));
					});
				} else {
					let payload = {
						notification: {
							title: 'Gossik Info',
							body: push.EN
						},
						data: {
							title: 'Gossik Info',
							body: push.EN
						}
					};
					Object.values(user.val().devices).forEach( (device) => {
						promises.push(admin.messaging().sendToDevice(String(device), payload));
					});
				}
			}
		});
		promises.push(admin.database().ref('/push/' + newPush.key + '/done').set(true));
		return Promise.all(promises)
	   	.then( () => {
	   		console.log('success!');
	   	})
	   	.catch( error => {
	   		console.log('failed :(');
	   		console.log(error);
	   	});
   	});
});

exports.checkInactivePush = functions.pubsub.schedule('0 12 * * *').onRun((context) => {
    return admin.database().ref('/users').once("value").then( users => {
		let promises: Promise<any>[] = [];
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
		        Object.values(user.val().devices).forEach( (device) => {
					promises.push(admin.messaging().sendToDevice(String(device), payload));
				});
			}
		});
		return Promise.all(promises)
	   	.then( () => {
	   		console.log('success!');
	   	})
	   	.catch( error => {
	   		console.log('failed :(');
	   		console.log(error);
	   	});
   });
});

exports.calendarEventPush = functions.pubsub.schedule('*/5 * * * *').onRun((context) => {
    return admin.database().ref('/users').once("value").then( users => {
   		let promises: Promise<any>[] = [];
   		users.forEach(function(user) {
   			if(user.val().calendarEvents) {
	   			Object.values(user.val().calendarEvents).forEach( (calendarEvent: any) => {
	   				let eventStartTimeMiliseconds = new Date(calendarEvent.startTime).getTime();
					let eventStartTimeSeconds = eventStartTimeMiliseconds/1000;
					let timeNowMiliseconds = new Date().getTime();
					let timeNowSeconds = timeNowMiliseconds/1000;
					if(!calendarEvent.allDay && calendarEvent.active != false && eventStartTimeSeconds - timeNowSeconds < 1200 && eventStartTimeSeconds - timeNowSeconds >= 900) {
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
				                title: calendarEvent.title,
				                body: msg
				            },
				            data: {
				              	title: calendarEvent.title,
				                body: msg
				            }
				        };
						Object.values(user.val().devices).forEach( (device) => {
				        	promises.push(admin.messaging().sendToDevice(String(device), payload));
				        });
					}
				});
	   		}
   		});
   		return Promise.all(promises)
	   	.then( () => {
	   		console.log('success!');
	   	})
	   	.catch( error => {
	   		console.log('failed :(');
	   		console.log(error);
	   	});
   	});
});

exports.deadlinePush = functions.pubsub.schedule('0 * * * *').onRun((context) => {
    return admin.database().ref('/users').once("value").then( users => {
		let promises: Promise<any>[] = [];
		let message: any = {};
   		users.forEach(function(user) {
			let timeNowConverted = convertDateToLocaleDate(new Date(), user.val().profile.timezoneOffset);
			let language = 'en';
			if(user.val().profile.language) {
				language = user.val().profile.language;
			}
   			if(user.val().calendarEvents && timeNowConverted.getHours() == 6) {
	   			Object.values(user.val().calendarEvents).forEach( (calendarEvent: any) => {
					let send: boolean = false;
					if(calendarEvent.allDay && calendarEvent.active != false && new Date(calendarEvent.startTime).getTime() - new Date().getTime() <= 24*3600*1000 && new Date(calendarEvent.startTime).getTime() - new Date().getTime() >= 0) {
						message['de'] = "Hey, diese Deadline ist schon bald. Du solltest dich langsam darum kümmern.";
						message['en'] = "Hey, this deadline is approaching. You should soon get this done.";
						send = true;
					} else if(calendarEvent.allDay && calendarEvent.active != false && new Date(calendarEvent.startTime).getTime() - new Date().getTime() <= 0 && new Date(calendarEvent.startTime).getTime() - new Date().getTime() >= -24*3600*1000) {
						message['de'] = "Letzte Chance, diese Aufgabe noch rechtzeitig zu erledigen. Deadline ist heute!";
						message['en'] = "Last chance to get this done in time. Deadline is today!";
						send = true;
					}
					let msg = message['en'];
					if(message[language]) {
						msg = message[language];
					}
					let payload = {
						notification: {
							title: calendarEvent.title,
							body: msg
						},
						data: {
							title: calendarEvent.title,
							body: msg
						}
					};
					if(send) {
						Object.values(user.val().devices).forEach( (device) => {
							promises.push(admin.messaging().sendToDevice(String(device), payload));
						});
					}
				});
	   		}
   		});
   		return Promise.all(promises)
	   	.then( () => {
	   		console.log('success!');
	   	})
	   	.catch( error => {
	   		console.log('failed :(');
	   		console.log(error);
	   	});
   	});
});

exports.increasePrioritySuggestion = functions.pubsub.schedule('0 0 * * *').onRun((context) => {
    return admin.database().ref('/users').once("value").then( (users: any) => {
		let promises: Promise<any>[] = [];
		let message: any = {
			en: {
				title_1: "Increase priority of to-do '",
				title_2: "'",
				content_1: "The deadline of your to-do '",
				content_2: "' is approaching soon. I suggest to increase the priority to get it done in time."
			},
			de: {
				title_1: "Erhöhe Priorität für ToDo '",
				title_2: "'",
				content_1: "Die Deadline für dein ToDo '",
				content_2: "' kommt näher. Ich schlage vor, die Priorität zu erhöhen, um es rechtzeitig zu erledigen."
			}
		};
   		users.forEach(function(user: any) {
			let language = 'en';
			if(user.val().profile && user.val().profile.language) {
				language = user.val().profile.language;
			}
   			if(user.val().calendarEvents) {
	   			Object.values(user.val().calendarEvents).forEach( (calendarEvent: any) => {
					if(calendarEvent.actionid &&  calendarEvent.allDay && calendarEvent.active != false && new Date(calendarEvent.startTime).getTime() - new Date().getTime() <= 5*24*3600*1000 && new Date(calendarEvent.startTime).getTime() - new Date().getTime() >= 4*24*3600*1000) {
						// deadline isch in 4-5 täg
						let todo: Action = user.val().nextActions[calendarEvent.actionid];
						let title = message.en.title_1 + todo.content + message.en.title_2;
						let content = message.en.content_1 + todo.content + message.en.content_2;
						if(message[language]) {
							title = message[language].title_1 + todo.content + message[language].title_2;
							content = message[language].content_1 + todo.content + message[language].content_2;
						}
						let suggestion: Suggestion = {
							userid: user.key,
							title: title,
							content: content,
							type: "IncreasePriority",
							todoid: calendarEvent.actionid,
							active: true,
							createDate: new Date().toISOString()
						}
						promises.push(admin.database().ref('/users/' + user.key + '/suggestions').push(suggestion));
					} else if(calendarEvent.actionid && calendarEvent.allDay && calendarEvent.active != false && new Date(calendarEvent.startTime).getTime() - new Date().getTime() <= 2*24*3600*1000 && new Date(calendarEvent.startTime).getTime() - new Date().getTime() >= 24*3600*1000) {
						// deadline isch in 1-2 täg
						let todo: Action = user.val().nextActions[calendarEvent.actionid];
						let title = message.en.title_1 + todo.content + message.en.title_2;
						let content = message.en.content_1 + todo.content + message.en.content_2;
						if(message[language]) {
							title = message[language].title_1 + todo.content + message[language].title_2;
							content = message[language].content_1 + todo.content + message[language].content_2;
						}
						let suggestion: Suggestion = {
							userid: user.key,
							title: title,
							content: content,
							type: "IncreasePriority",
							todoid: calendarEvent.actionid,
							active: true,
							createDate: new Date().toISOString()
						}
						promises.push(admin.database().ref('/users/' + user.key + '/suggestions').push(suggestion));
					}
				});
	   		}
   		});
   		return Promise.all(promises)
	   	.then( () => {
	   		console.log('success!');
	   	})
	   	.catch( error => {
	   		console.log('failed :(');
	   		console.log(error);
	   	});
   	});
});

exports.setNewDeadlineSuggestion = functions.pubsub.schedule('0 0 * * *').onRun((context) => {
    return admin.database().ref('/users').once("value").then( (users: any) => {
		let promises: Promise<any>[] = [];
		let message: any = {
			en: {
				title_1: "Set new deadline for to-do '",
				title_2: "'",
				content_1: "The deadline of your to-do '",
				content_2: "' has expired. I suggest to set a new deadline to not forget about this to-do."
			},
			de: {
				title_1: "Setze neue Deadline für ToDo '",
				title_2: "'",
				content_1: "Die Deadline für dein ToDo '",
				content_2: "' ist abgelaufen. Ich schlage for, eine neue zu setzen, um dieses ToDo nicht zu vergessen."
			}
		};
   		users.forEach(function(user: any) {
			let language = 'en';
			if(user.val().profile && user.val().profile.language) {
				language = user.val().profile.language;
			}
   			if(user.val().calendarEvents) {
	   			Object.values(user.val().calendarEvents).forEach( (calendarEvent: any) => {
					if(calendarEvent.actionid &&  calendarEvent.allDay && calendarEvent.active != false && new Date(calendarEvent.startTime).getTime() <= new Date().getTime()) {
						let todo: Action = user.val().nextActions[calendarEvent.actionid];
						let title = message.en.title_1 + todo.content + message.en.title_2;
						let content = message.en.content_1 + todo.content + message.en.content_2;
						if(message[language]) {
							title = message[language].title_1 + todo.content + message[language].title_2;
							content = message[language].content_1 + todo.content + message[language].content_2;
						}
						let suggestion: Suggestion = {
							userid: user.key,
							title: title,
							content: content,
							type: "SetNewDeadline",
							todoid: calendarEvent.actionid,
							active: true,
							createDate: new Date().toISOString()
						}
						promises.push(admin.database().ref('/users/' + user.key + '/suggestions').push(suggestion));
					}
				});
	   		}
   		});
   		return Promise.all(promises)
	   	.then( () => {
	   		console.log('success!');
	   	})
	   	.catch( error => {
	   		console.log('failed :(');
	   		console.log(error);
	   	});
   	});
});

exports.deleteOldToDoSuggestion = functions.pubsub.schedule('0 0 * * *').onRun((context) => {
    return admin.database().ref('/users').once("value").then( (users: any) => {
		let promises: Promise<any>[] = [];
		let message: any = {
			en: {
				title_1: "Delete to-do '",
				title_2: "'",
				content_1: "Your to-do '",
				content_2: "' has been on your to-do list for a long time. I suggest to delete this to-do because it seems like you will not do it anyway."
			},
			de: {
				title_1: "Lösche ToDo '",
				title_2: "'",
				content_1: "Dein ToDo '",
				content_2: "' ist schon eine lange Zeit auf deiner ToDo-Liste. Ich schlage vor, es zu löschen, da du es offenbar sowieso nicht erledigen wirst."
			}
		};
   		users.forEach(function(user: any) {
			let language = 'en';
			if(user.val().profile && user.val().profile.language) {
				language = user.val().profile.language;
			}
   			if(user.val().nextActions) {
	   			Object.entries(user.val().nextActions).forEach( ([key, todo]: [string, any]) => {
					if(todo.active && !todo.taken && new Date(todo.createDate).getTime() < new Date().getTime() - 10*24*3600*1000) {
						let title = message.en.title_1 + todo.content + message.en.title_2;
						let content = message.en.content_1 + todo.content + message.en.content_2;
						if(message[language]) {
							title = message[language].title_1 + todo.content + message[language].title_2;
							content = message[language].content_1 + todo.content + message[language].content_2;
						}
						admin.database().ref('/users/' +  + '/profile').once("value").then( (userProfile: any) => {
						});
						let suggestion: Suggestion = {
							userid: user.key,
							title: title,
							content: content,
							type: "DeleteToDo",
							todoid: key,
							active: true,
							createDate: new Date().toISOString()
						}
						promises.push(admin.database().ref('/users/' + user.key + '/suggestions').push(suggestion));
					}
				});
	   		}
   		});
   		return Promise.all(promises)
	   	.then( () => {
	   		console.log('success!');
	   	})
	   	.catch( error => {
	   		console.log('failed :(');
	   		console.log(error);
	   	});
   	});
});

exports.setFocusToNewProjectSuggestion = functions.database.ref('/users/{user}/goals/{newGoal}').onCreate((newGoal, context) => {
	let project = newGoal.val();
	return admin.database().ref('/users/' + project.userid + '/profile').once("value").then( (userProfile: any) => {
		let language = 'en';
		if(userProfile.val().language) {
			language = userProfile.val().language;
		}
		let message: any = {
			en: {
				title_1: "Set focus to new project '",
				title_2: "'",
				content_1: "You created a new project '",
				content_2: "'. Do you want me to set the focus to this project so that I will prioritize it's to-dos higher and we get started faster with it?"
			},
			de: {
				title_1: "Fokus auf neues Projekt '",
				title_2: "' legen",
				content_1: "Du hast ein neues Projekt '",
				content_2: "' erstellt. Möchtest du, dass ich den Fokus auf dieses Projekt lege, sodass ich dessen ToDos höher priorisiere und wir schneller mit diesem Projekt starten?"
			}
		};
		let title = message.en.title_1 + project.name + message.en.title_2;
		let content = message.en.content_1 + project.name + message.en.content_2;
		if(message[language]) {
			title = message[language].title_1 + project.name + message[language].title_2;
			content = message[language].content_1 + project.name + message[language].content_2;
		}
		let suggestion: Suggestion = {
			userid: project.userid,
			title: title,
			content: content,
			type: "SetFocus",
			projectid: newGoal.key,
			active: true,
			createDate: new Date().toISOString()
		}
		return admin.database().ref('/users/' + project.userid + '/suggestions').push(suggestion);
	});
});

exports.sliceTaskSuggestion = functions.database.ref('/users/{user}/nextActions/{newToDo}').onCreate((newToDo, context) => {
	let todo = newToDo.val();
	if(todo.time >= 30) {
		return admin.database().ref('/users/' + todo.userid + '/profile').once("value").then( (userProfile: any) => {
			let language = 'en';
			if(userProfile.val().language) {
				language = userProfile.val().language;
			}
			let message: any = {
				en: {
					title_1: "Slice to-do '",
					title_2: "'",
					content_1: "Your newly created to-do '",
					content_2: "' is rather long. If you slice it into smaller sub to-dos, it will be easier to work it off during short breaks. I suggest to change this to-do into the immediate next action that does not take longer than 30min."
				},
				de: {
					title_1: "Zerkleinere ToDo '",
					title_2: "'",
					content_1: "Dein neu erstelltes ToDo '",
					content_2: "' ist etwas lang. Wenn du es in mehrere kleinere ToDos zerkleinerst, wird es einfacher sein, diese in kurzen Pausen abzuarbeiten. Ich schlage vor, dieses ToDo in den nächsten konkreten Schritt zu ändern, welcher nicht länger als 30min dauert."
				}
			};
			let title = message.en.title_1 + todo.content + message.en.title_2;
			let content = message.en.content_1 + todo.content + message.en.content_2;
			if(message[language]) {
				title = message[language].title_1 + todo.content + message[language].title_2;
				content = message[language].content_1 + todo.content + message[language].content_2;
			}
			let suggestion: Suggestion = {
				userid: todo.userid,
				title: title,
				content: content,
				type: "SliceTask",
				todoid: newToDo.key,
				active: true,
				createDate: new Date().toISOString()
			}
			return admin.database().ref('/users/' + todo.userid + '/suggestions').push(suggestion);
		});
	} else {
		return 0;
	}
});

exports.interactProcessThoughtsPush = functions.pubsub.schedule('0 * * * *').onRun((context) => {
    return admin.database().ref('/users').once("value").then( users => {
		let promises: Promise<any>[] = [];
   		users.forEach(function(user) {
			if(user.val().profile && user.val().profile.timezoneOffset) {
				let timeNowConverted = convertDateToLocaleDate(new Date(), user.val().profile.timezoneOffset);
				if(timeNowConverted.getHours() == 20 && user.val().captures) {
					let numberThoughts: number = 0;
					Object.values(user.val().captures).forEach( (thought:any) => {
						if(thought.active) {
							numberThoughts++;
						}
					});
					if(numberThoughts >= 20) {
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
						Object.values(user.val().devices).forEach( (device) => {
							promises.push(admin.messaging().sendToDevice(String(device), payload));
						});
					}
				}
			} else {
				console.log('no timezoneoffset or profile for user ' + String(user.key));
			}
		});
		return Promise.all(promises)
	   	.then( () => {
	   		console.log('success!');
	   	})
	   	.catch( error => {
	   		console.log('failed :(');
	   		console.log(error);
	   	});
   	});
});

function getRandomInteger(min: number, max: number) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

exports.setRandomPushTimes = functions.pubsub.schedule('50 * * * *').onRun((context) => {
    return admin.database().ref('/users').once("value").then( users => {
   		let promises: Promise<any>[] = [];
   		users.forEach(function(user) {
   			let timeNowConverted = convertDateToLocaleDate(new Date(), user.val().profile.timezoneOffset);
			if(timeNowConverted.getHours() == 23) {
	   			let randomPushTimes: number[] = [];
	   			let numberPushForAssistant: any = {};
				numberPushForAssistant['silent'] = 0;
				numberPushForAssistant['chiller'] = 1;
				numberPushForAssistant['standard'] = 3;
				numberPushForAssistant['pusher'] = 5;
				while(randomPushTimes.length < numberPushForAssistant[user.val().profile.assistant]) {
	   				let nextNumber = getRandomInteger(8,21);
	   				if(randomPushTimes.indexOf(nextNumber) == -1) {
	   					randomPushTimes.push(nextNumber);
	   				}
	   			}
	   			promises.push(admin.database().ref('/users/' + user.key + '/profile/randomPushTodosReceived').set(0));
				promises.push(admin.database().ref('/users/' + user.key + '/profile/randomPushTimes').set(randomPushTimes));
   			}
   		});
   		return Promise.all(promises)
	   	.then( () => {
	   		console.log('success!');
	   	})
	   	.catch( error => {
	   		console.log('failed :(');
	   		console.log(error);
	   	});
   	});
});

exports.setLoggedInToday = functions.pubsub.schedule('50 * * * *').onRun((context) => {
    return admin.database().ref('/users').once("value").then( users => {
		let today = new Date();
		let yesterday = new Date(today.getTime() - 24*3600*1000);
   		users.forEach(function(user) {
			if(user.val().profile && user.val().profile.timezoneOffset) {
				let timeNowConverted = convertDateToLocaleDate(new Date(), user.val().profile.timezoneOffset);
				if(timeNowConverted.getHours() == 23) {
					if(user.val().profile.lastLogin) {
						if(new Date(user.val().profile.lastLogin).getTime() >= yesterday.getTime()) {
							admin.database().ref('/users/' + user.key + '/loginDays').push(timeNowConverted.toISOString());
						}
					}
				}
			}
   		});
   	});
});

exports.checkRandomTodoDone = functions.pubsub.schedule('50 * * * *').onRun(async (context) => {
	return admin.database().ref('/users').once("value", function(users) {
		let promises: Promise<any>[] = [];
		users.forEach(function(user) {
			let timeNowConverted = convertDateToLocaleDate(new Date(), user.val().profile.timezoneOffset);
			if(timeNowConverted.getHours() != 23) {
				if(user.val().pushNotifications) {
					for(let key in user.val().pushNotifications) {
						if(user.val().nextActions && user.val().pushNotifications[key] && user.val().nextActions[user.val().pushNotifications[key].todoid]) {
							let pushNotification = user.val().pushNotifications[key];
							let todo = user.val().nextActions[pushNotification.todoid];
							if(todo.startDate && todo.goalid) {
								let startDate = new Date(todo.startDate);
								let randomPushTimeDate = new Date(pushNotification.createDate);
								let learnedScheduleObject = JSON.parse(user.val().profile.learnedSchedule.toString());
								let localeDate = convertDateToLocaleDate(startDate, user.val().profile.timezoneOffset);
								let weekDay = localeDate.getDay() - 1;
								if(weekDay == -1) {
									weekDay = 6;
								}
								//getHours() uses local date, so here in cloud it uses us-central1 locale date which has timezoneOffset 0
								//to get back users local hour, we here also need to use localeDate
								let hour = localeDate.getHours();
								let row = weekDay * 24 + hour;
								if(startDate.getTime() - randomPushTimeDate.getTime() <= 3600*1000 && startDate.getTime() - randomPushTimeDate.getTime() >= 0) {
									learnedScheduleObject[row][todo.goalid] += 1;
									promises.push(admin.database().ref('/users/' + user.key + '/profile').child('learnedSchedule').set(JSON.stringify(learnedScheduleObject)));	
								} else {
									for(let goalid in learnedScheduleObject[row]) {
										learnedScheduleObject[row][goalid] -= 0.1;
									}
									promises.push(admin.database().ref('/users/' + user.key + '/profile').child('learnedSchedule').set(JSON.stringify(learnedScheduleObject)));
								}
							} else if(!todo.startDate) {
								let startDate = new Date(pushNotification.createDate);
								let learnedScheduleObject = JSON.parse(user.val().profile.learnedSchedule.toString());
								let localeDate = convertDateToLocaleDate(startDate, user.val().profile.timezoneOffset);
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
								promises.push(admin.database().ref('/users/' + user.key + '/profile').child('learnedSchedule').set(JSON.stringify(learnedScheduleObject)));
							}
						}
						promises.push(admin.database().ref('/users/' + user.key + '/pushNotifications/' + key).remove());
					}
				}
			}
		});
		return Promise.all(promises)
	   	.then( () => {
	   		console.log('success!');
	   	})
	   	.catch( error => {
	   		console.log('failed :(');
	   		console.log(error);
	   	});
	});
});

exports.sendRandomTodoPush = functions.pubsub.schedule('16 * * * *').onRun((context) => {
    return admin.database().ref('/users').once("value").then( users => {
    	let promises: Promise<any>[] = [];
   		users.forEach(function(user) {
			if(user.val().devices && user.val().subscription != 'assistantFeature' || (user.val().subscription == 'assistantFeature' && user.val().subscriptionPaid)) {
				let timeNowConverted = convertDateToLocaleDate(new Date(), user.val().profile.timezoneOffset);
				let numberPushForAssistant: any = {};
				numberPushForAssistant['silent'] = 0;
				numberPushForAssistant['chiller'] = 1;
				numberPushForAssistant['standard'] = 3;
				numberPushForAssistant['pusher'] = 5;
				if(user.val().profile.randomPushTimes && user.val().profile.randomPushTodosReceived < numberPushForAssistant[user.val().profile.assistant]) {
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
								Object.values(user.val().devices).forEach( (device) => {
									promises.push(admin.messaging().sendToDevice(String(device), payload));
								});
								let pushNotification = {
									message: msg,
									todoid: randomTodo.todoid,
									createDate: new Date().toISOString()
								}
								admin.database().ref('/users/' + user.key + '/pushNotifications').push(pushNotification);
								if(user.val().profile.randomPushTodosReceived) {
									admin.database().ref('/users/' + user.key + '/profile').child('randomPushTodosReceived').set(user.val().profile.randomPushTodosReceived + 1);
								} else {
									admin.database().ref('/users/' + user.key + '/profile').child('randomPushTodosReceived').set(1);
								}
							}
						}
					}
				}
			}
   		});
   		return Promise.all(promises)
	   	.then( () => {
	   		console.log('success!');
	   	})
	   	.catch( error => {
	   		console.log('failed :(');
	   		console.log(error);
	   	});
   	});
});

export const loginStats = functions.https.onCall((data, context) => {
	let startDate = data.startDate;
	let endDate = data.endDate;
	let numberDays = data.numberDays;
	return admin.database().ref('/users').once("value").then( users => {
		let countActiveUsers: number = 0;
   		users.forEach(function(user) {
			let countActiveDays: number = 0;
			if(user.val().loginDays) {
				Object.values(user.val().loginDays).forEach( loginDay => {
					if(new Date(startDate).getTime() <= new Date(String(loginDay)).getTime() && new Date(endDate).getTime() >= new Date(String(loginDay)).getTime()) {
						countActiveDays++;
					}
				});
			}
			if(countActiveDays >= numberDays) {
				countActiveUsers++;
			}
		});
		return { activeUsers: countActiveUsers };
   	}).catch((error) => {
		throw new functions.https.HttpsError('unknown', error.message,error);
	})
});

async function getAllUsers() {
	return admin.database().ref('/users').once("value")
}

export const trackingSystem = functions.https.onCall(async (data, context) => {
	let numberRegisteredUsers: number = 0;
	let numberUsersWith5Todos: number = 0;
	let numberUsersWith5TodosWithin3Days: number = 0;
	let numberUsersWith5TodosWithin7Days: number = 0;
	let numberUsersWith3TodosDone: number = 0;
	let numberUsersWith3TodosDoneWithin3Days: number = 0;
	let numberUsersWith3TodosDoneWithin7Days: number = 0;
	let numberUsersWith5ThoughtsWithin3Days: number = 0;
	let numberUsersWith5ThoughtsWithin7Days: number = 0;
	let loginCounts: any = {};
	let activeCounts: any = {};
	let numberUsersWith5Thoughts: number = 0;
	let users = await getAllUsers();
	let startDate = new Date(data.startDate);
	let before1Day = new Date(data.startDate);
	before1Day.setDate(before1Day.getDate() -1);
	let before7Days = new Date(data.startDate);
	before7Days.setDate(before7Days.getDate() -7);
	let after3Days = new Date(data.startDate);
	after3Days.setDate(after3Days.getDate() + 3);
	let after7Days = new Date(data.startDate);
	after7Days.setDate(after7Days.getDate() + 7);
	let checkDates: Date[] = [
		before7Days,
		new Date(data.startDate),
		before1Day,
		new Date(data.startDate),
		after3Days,
		new Date(data.startDate),
		after7Days
	];
	let today = new Date();
	today.setHours(0,0,0);
	let checkDate = new Date(checkDates[6]);
	while(today.getTime() >= checkDate.getTime()) {
		checkDate.setDate(checkDate.getDate() + 7);
		checkDates.push(new Date(checkDate));
	}
	console.log('checkDates');
	console.log(checkDates);
	let counter = 0;
	for(let date of checkDates) {
		loginCounts[String(counter) + '_' + date.toISOString()] = 0;
		activeCounts[String(counter) + '_' + date.toISOString()] = 0;
		counter++;
	}
	console.log('loginCounts');
	console.log(loginCounts);
	users.forEach( user => {
		if(user.val().profile?.signUpDate) {
			let signUpDate = new Date(user.val().profile.signUpDate);
			if(startDate.getDate() == signUpDate.getDate() && startDate.getMonth() == signUpDate.getMonth() && startDate.getFullYear() == signUpDate.getFullYear()) {
				numberRegisteredUsers++;
				if(user.val().nextActions) {
					let numberTodos: number = 0;
					let numberTodosWithin3Days: number = 0;
					let numberTodosWithin7Days: number = 0;
					let numberTodosDone: number = 0;
					let numberTodosDoneWithin3Days: number = 0;
					let numberTodosDoneWithin7Days: number = 0;
					Object.values(user.val().nextActions).forEach( (todo:any) => {
						numberTodos++;
						if(todo.createDate) {
							let createDate = new Date(todo.createDate);
							if(createDate.getTime() <= signUpDate.getTime() + 3*24*3600*1000) {
								numberTodosWithin3Days++;
							}
							if(createDate.getTime() <= signUpDate.getTime() + 7*24*3600*1000) {
								numberTodosWithin7Days++;
							}
						}
						if(todo.taken && todo.deleteDate) {
							numberTodosDone++;
							let deleteDate = new Date(todo.deleteDate);
							if(deleteDate.getTime() <= new Date(todo.createDate).getTime() + 3*24*3600*1000) {
								numberTodosDoneWithin3Days++;
							}
							if(deleteDate.getTime() <= new Date(todo.createDate).getTime() + 7*24*3600*1000) {
								numberTodosDoneWithin7Days++;
							}
						}
					});
					if(numberTodos >= 5) {
						numberUsersWith5Todos++;
					}
					if(numberTodosWithin3Days >= 5) {
						numberUsersWith5TodosWithin3Days++;
					}
					if(numberTodosWithin7Days >= 5) {
						numberUsersWith5TodosWithin7Days++;
					}
					if(numberTodosDone >= 3) {
						numberUsersWith3TodosDone++;
					}
					if(numberTodosDoneWithin3Days >= 3) {
						numberUsersWith3TodosDoneWithin3Days++;
					}
					if(numberTodosDoneWithin7Days >= 3) {
						numberUsersWith3TodosDoneWithin7Days++;
					}
				}
				if(user.val().captures) {
					let numberThoughts: number = 0;
					let numberThoughtsWithin3Days: number = 0;
					let numberThoughtsWithin7Days: number = 0;
					Object.values(user.val().captures).forEach( (thought:any) => {
						numberThoughts++;
						if(thought.createDate) {
							let createDate = new Date(thought.createDate);
							if(createDate.getTime() <= signUpDate.getTime() + 3*24*3600*1000) {
								numberThoughtsWithin3Days++;
							}
							if(createDate.getTime() <= signUpDate.getTime() + 7*24*3600*1000) {
								numberThoughtsWithin7Days++;
							}
						}
					});
					if(numberThoughts >= 5) {
						numberUsersWith5Thoughts++;
					}
					if(numberThoughtsWithin3Days >= 5) {
						numberUsersWith5ThoughtsWithin3Days++;
					}
					if(numberThoughtsWithin7Days >= 5) {
						numberUsersWith5ThoughtsWithin7Days++;
					}
				}
				for(let iter = 1; iter < checkDates.length; iter++) {
					if(user.val().loginDays) {
						console.log('ho');
						let loggedInInRange: number = 0;
						let loginDays = Object.values(user.val().loginDays);
						loginDays.shift();
						loginDays.forEach( loginDay => {
							console.log('hi');
							if(user.key == 'R1CFRqnvsmdJtxIJZIvgF1Md0lr1') {
								console.log('checking loginDay ' + String(loginDay) + ' is between ' + checkDates[iter-1].toISOString() + ' and ' + checkDates[iter].toISOString());
							}
							if(checkDates[iter-1].getTime() <= new Date(String(loginDay)).getTime() &&  checkDates[iter].getTime() >= new Date(String(loginDay)).getTime()) {
								loggedInInRange++;
								console.log('yup');
							}
						});
						if(user.key == 'R1CFRqnvsmdJtxIJZIvgF1Md0lr1') {
							console.log('loggedInInRange ' + String(loggedInInRange));
						}
						if(loggedInInRange > 0) {
							loginCounts[checkDates[iter].toISOString()]++;
						}
						if(loggedInInRange >= 3) {
							activeCounts[checkDates[iter].toISOString()]++;
						}
					}
				}		
			}
		}
	});
	return {
		signUpDate: startDate.toISOString(),
		numberRegisteredUsers: numberRegisteredUsers,
		numberUsersWith5Todos: numberUsersWith5Todos,
		numberUsersWith5TodosWithin7Days: numberUsersWith5TodosWithin7Days,
		numberUsersWith5TodosWithin3Days: numberUsersWith5TodosWithin3Days,
		numberUsersWith3TodosDone: numberUsersWith3TodosDone,
		numberUsersWith3TodosDoneWithin7Days: numberUsersWith3TodosDoneWithin7Days,
		numberUsersWith3TodosDoneWithin3Days: numberUsersWith3TodosDoneWithin3Days,
		numberUsersWith5Thoughts: numberUsersWith5Thoughts,
		numberUsersWith5ThoughtsWithin7Days: numberUsersWith5ThoughtsWithin7Days,
		numberUsersWith5ThoughtsWithin3Days: numberUsersWith5ThoughtsWithin3Days,
		loginCounts: loginCounts,
		activeCounts: activeCounts
		//activeUserEmails: activeUserEmails
	}
});


export const trackingSystemNew = functions.https.onCall(async (data, context) => {
	let numberRegisteredUsers: number = 0;
	let numberUsersWith5TodosWithin3Days: number = 0;
	let numberUsersWith5TodosWithin7Days: number = 0;
	let numberUsersWith3TodosDoneWithin3Days: number = 0;
	let numberUsersWith3TodosDoneWithin7Days: number = 0;
	let numberUsersWith5ThoughtsWithin3Days: number = 0;
	let numberUsersWith5ThoughtsWithin7Days: number = 0;
	let users = await getAllUsers();
	let startDate = new Date(data.startDate);
	console.log(new Date(data.startDate));
	let checkRanges: any = [];
	checkRanges.push([new Date(new Date(data.startDate).setDate(new Date(data.startDate).getDate() - 6)), new Date(new Date(data.startDate).setDate(new Date(data.startDate).getDate() + 1)), 0, 0]);
	checkRanges.push([new Date(data.startDate), new Date(new Date(data.startDate).setDate(new Date(data.startDate).getDate() + 1)), 0, 0]);
	checkRanges.push([new Date(data.startDate), new Date(new Date(data.startDate).setDate(new Date(data.startDate).getDate() + 3)), 0, 0]);
	checkRanges.push([new Date(data.startDate), new Date(new Date(data.startDate).setDate(new Date(data.startDate).getDate() + 7)), 0, 0]);
	let today = new Date();
	today.setHours(0,0,0);
	let checkDate = new Date(data.startDate)
	checkDate.setDate(new Date(data.startDate).getDate() + 7);
	
	console.log('ha');
	while(today.getTime() >= checkDate.getTime()) {
		checkDate.setDate(checkDate.getDate() + 7);
		checkRanges.push([checkRanges[checkRanges.length -1][1], new Date(checkDate), 0, 0]);
	}
	console.log('ho');

	while(checkRanges[checkRanges.length - 1][1].getTime() >= today.getTime()) {
		checkRanges.pop();
	}
	console.log('hi');
	users.forEach( user => {
		if(user.val().profile?.signUpDate) {
			let signUpDate = new Date(user.val().profile.signUpDate);
			if(startDate.getDate() == signUpDate.getDate() && startDate.getMonth() == signUpDate.getMonth() && startDate.getFullYear() == signUpDate.getFullYear()) {
				numberRegisteredUsers++;
				if(user.val().nextActions) {
					let numberTodosWithin3Days: number = 0;
					let numberTodosWithin7Days: number = 0;
					let numberTodosDoneWithin3Days: number = 0;
					let numberTodosDoneWithin7Days: number = 0;
					Object.values(user.val().nextActions).forEach( (todo:any) => {
						if(todo.createDate) {
							let createDate = new Date(todo.createDate);
							if(createDate.getTime() <= signUpDate.getTime() + 3*24*3600*1000) {
								numberTodosWithin3Days++;
							}
							if(createDate.getTime() <= signUpDate.getTime() + 7*24*3600*1000) {
								numberTodosWithin7Days++;
							}
						}
						if(todo.taken && todo.deleteDate) {
							let deleteDate = new Date(todo.deleteDate);
							if(deleteDate.getTime() <= new Date(todo.createDate).getTime() + 3*24*3600*1000) {
								numberTodosDoneWithin3Days++;
							}
							if(deleteDate.getTime() <= new Date(todo.createDate).getTime() + 7*24*3600*1000) {
								numberTodosDoneWithin7Days++;
							}
						}
					});
					if(numberTodosWithin3Days >= 5) {
						numberUsersWith5TodosWithin3Days++;
					}
					if(numberTodosWithin7Days >= 5) {
						numberUsersWith5TodosWithin7Days++;
					}
					if(numberTodosDoneWithin3Days >= 3) {
						numberUsersWith3TodosDoneWithin3Days++;
					}
					if(numberTodosDoneWithin7Days >= 3) {
						numberUsersWith3TodosDoneWithin7Days++;
					}
				}
				if(user.val().captures) {
					let numberThoughtsWithin3Days: number = 0;
					let numberThoughtsWithin7Days: number = 0;
					Object.values(user.val().captures).forEach( (thought:any) => {
						if(thought.createDate) {
							let createDate = new Date(thought.createDate);
							if(createDate.getTime() <= signUpDate.getTime() + 3*24*3600*1000) {
								numberThoughtsWithin3Days++;
							}
							if(createDate.getTime() <= signUpDate.getTime() + 7*24*3600*1000) {
								numberThoughtsWithin7Days++;
							}
						}
					});
					if(numberThoughtsWithin3Days >= 5) {
						numberUsersWith5ThoughtsWithin3Days++;
					}
					if(numberThoughtsWithin7Days >= 5) {
						numberUsersWith5ThoughtsWithin7Days++;
					}
				}
				if(checkRanges.length >= 3) {
					for(let iter = 2; iter < checkRanges.length; iter++) {
						if(user.val().loginDays) {
							let loggedInInRange: number = 0;
							let loginDays = Object.values(user.val().loginDays);
							loginDays.shift();
							loginDays.forEach( loginDay => {
								if(user.key == 'R1CFRqnvsmdJtxIJZIvgF1Md0lr1') {
									console.log('checking loginDay ' + String(loginDay) + ' is between ' + checkRanges[iter][0].toISOString() + ' and ' + checkRanges[iter][1].toISOString());
								}
								if(checkRanges[iter][0].getTime() <= new Date(String(loginDay)).getTime() && checkRanges[iter][1].getTime() >= new Date(String(loginDay)).getTime()) {
									loggedInInRange++;
									console.log('yup');
								}
							});
							if(user.key == 'R1CFRqnvsmdJtxIJZIvgF1Md0lr1') {
								console.log('loggedInInRange ' + String(loggedInInRange));
							}
							if(loggedInInRange > 0) {
								checkRanges[iter][2]++;
							}
							if(loggedInInRange >= 3) {
								checkRanges[iter][3]++;
							}
						}
					}
				}		
			}
			for(let iter = 0; iter < 2; iter++) {
				if(user.val().loginDays) {
					let loggedInInRange: number = 0;
					let loginDays = Object.values(user.val().loginDays);
					loginDays.shift();
					loginDays.forEach( loginDay => {
						if(user.key == 'R1CFRqnvsmdJtxIJZIvgF1Md0lr1') {
							console.log('checking loginDay ' + String(loginDay) + ' is between ' + checkRanges[iter][0].toISOString() + ' and ' + checkRanges[iter][1].toISOString());
						}
						if(checkRanges[iter][0].getTime() <= new Date(String(loginDay)).getTime() && checkRanges[iter][1].getTime() >= new Date(String(loginDay)).getTime()) {
							loggedInInRange++;
						}
					});
					if(user.key == 'R1CFRqnvsmdJtxIJZIvgF1Md0lr1') {
						console.log('loggedInInRange ' + String(loggedInInRange));
					}
					if(loggedInInRange > 0) {
						checkRanges[iter][2]++;
					}
					if(loggedInInRange >= 3) {
						checkRanges[iter][3]++;
					}
				}
			}
		}
	});
	let loginAndActiveCounts: any = {};
	for(let row of checkRanges) {
		if(row[0].getTime() <= new Date("2020-08-04T00:00:00.138Z")) {
			continue;
		}
		if(row == checkRanges[0]) {
			loginAndActiveCounts['last7Days'] = [row[2], row[3]];
		} else if(row == checkRanges[1]) {
			loginAndActiveCounts['yesterday'] = [row[2], row[3]];
		} else {
			let numberDaysSinceStartDate: Number = (row[1].getTime() - startDate.getTime())/(24*3600*1000);
			loginAndActiveCounts['after' + String(numberDaysSinceStartDate) + 'Days'] = [row[2], row[3]];
		}
	}
	return {
		signUpDate: startDate.toISOString(),
		numberRegisteredUsers: numberRegisteredUsers,
		numberUsersWith5TodosWithin7Days: numberUsersWith5TodosWithin7Days,
		numberUsersWith5TodosWithin3Days: numberUsersWith5TodosWithin3Days,
		numberUsersWith3TodosDoneWithin7Days: numberUsersWith3TodosDoneWithin7Days,
		numberUsersWith3TodosDoneWithin3Days: numberUsersWith3TodosDoneWithin3Days,
		numberUsersWith5ThoughtsWithin7Days: numberUsersWith5ThoughtsWithin7Days,
		numberUsersWith5ThoughtsWithin3Days: numberUsersWith5ThoughtsWithin3Days,
		loginAndActiveCounts: loginAndActiveCounts
		//activeUserEmails: activeUserEmails
	}
});


/*
exports.countWeeklyUsers = functions.pubsub.schedule('* * * * *').onRun((context) => {
    return admin.database().ref('/users').once("value").then( users => {
		let count: number = 0;
		let today = new Date();
		let oneWeekAgo = new Date(today.getTime() - 7*24*3600*1000);
   		users.forEach(function(user) {
			if(new Date(user.val().profile.lastLogin).getTime() >= oneWeekAgo.getTime()) {
				count ++;
			}
		});
		console.log('We have ' + String(count) + ' weekly active users.');
   	});
});
*/

/*
exports.sendDebugPush = functions.pubsub.schedule('* * * * *').onRun((context) => {
	let promises: Promise<any>[] = [];
    return admin.database().ref('/users/R1CFRqnvsmdJtxIJZIvgF1Md0lr1').once("value")
    .then( user => {
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
   			let payload: any = {
	            notification: {
	                title: "Gossik",
	                body: "Hoiiiii " + new Date().toISOString()
	            },
	            data: {
	              	title: "Gossik",
	                body: "Hoiiiii " + new Date().toISOString(),
	                target: 'todo',
					todoid: randomTodo.todoid,
					"actions": [
						{ "icon": "approve_icon", "title": "APPROVE", "callback": "AppComponent.approve", "foreground": true},
						{ "icon": "reject_icon", "title": "REJECT", "callback": "AppComponent.reject", "foreground": true}
					]
	            }
	        };
	        Object.values(user.val().devices).forEach( (device) => {
	        	promises.push(admin.messaging().sendToDevice(String(device), payload));
	        });
		}
		return Promise.all(promises)
	   	.then( () => {
	   		console.log('success!');
	   	})
	   	.catch( error => {
	   		console.log('failed :(');
	   		console.log(error);
	   	});
   	});
});
*/




// Modifying the database manually for each user
/*
exports.modifyUsers = functions.pubsub.schedule('* * * * *').onRun((context) => {
    return admin.database().ref('/users').once("value", function(users) {
		let promises: Promise<any>[] = [];
   		users.forEach(function(user) {
			
			promises.push(admin.database().ref('/users/' + user.key + '/profile/calendar').remove());
			promises.push(admin.database().ref('/users/' + user.key + '/profile/fivetodos').remove());
			promises.push(admin.database().ref('/users/' + user.key + '/profile/gettingToKnowPush').remove());
			promises.push(admin.database().ref('/users/' + user.key + '/profile/next').remove());
			promises.push(admin.database().ref('/users/' + user.key + '/profile/process').remove());
			promises.push(admin.database().ref('/users/' + user.key + '/profile/projects').remove());
			promises.push(admin.database().ref('/users/' + user.key + '/profile/thoughtprocessing').remove());
			promises.push(admin.database().ref('/users/' + user.key + '/profile/thoughts').remove());
			promises.push(admin.database().ref('/users/' + user.key + '/profile/triggerDate').remove());
			promises.push(admin.database().ref('/users/' + user.key + '/profile/tutorialNextButton').remove());
			promises.push(admin.database().ref('/users/' + user.key + '/profile/tutorialProgress').remove());
			promises.push(admin.database().ref('/users/' + user.key + '/profile/tutorialTodoPageTime').remove());
   			// update just one specific value
   			//promises.push(admin.database().ref('/users/' + user.key + '/profile').child('subscription').set('freeUser'));
   			//promises.push(admin.database().ref('/users/' + user.key + '/profile').child('subscriptionPaid').set(false));
		   })
		   return Promise.all(promises);
   });
});

*/