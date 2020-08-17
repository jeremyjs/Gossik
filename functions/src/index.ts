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
					} else if(calendarEvent.allDay && calendarEvent.active != false && eventStartTimeSeconds - timeNowSeconds < 259200 && eventStartTimeSeconds - timeNowSeconds >= 0) {
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
				numberPushForAssistant['still'] = 0;
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
   			let timeNowConverted = convertDateToLocaleDate(new Date(), user.val().profile.timezoneOffset);
			if(timeNowConverted.getHours() == 23) {
				if(new Date(user.val().profile.lastLogin).getTime() >= yesterday.getTime()) {
	   				admin.database().ref('/users/' + user.key + '/loginDays').push(timeNowConverted.toISOString());
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
				numberPushForAssistant['still'] = 0;
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
	let after3Days = new Date(data.startDate);
	after3Days.setDate(after3Days.getDate() + 3);
	let after7Days = new Date(data.startDate);
	after7Days.setDate(after7Days.getDate() + 7);
	let checkDates: Date[] = [
		new Date(data.startDate),
		after3Days,
		new Date(data.startDate),
		after7Days
	];
	let today = new Date();
	today.setHours(0,0,0);
	let yesterday = new Date(today.getTime() - 24*3600*1000);
	let checkDate = new Date(checkDates[2]);
	while(today.getTime() >= checkDate.getTime()) {
		checkDate.setDate(checkDate.getDate() + 7);
		checkDates.push(new Date(checkDate));
	}
	for(let iter: number = 1; iter < checkDates.length; iter++) {
		loginCounts[checkDates[iter].toISOString()] = 0;
		activeCounts[checkDates[iter].toISOString()] = 0;
	}
	let countUsersYesterday: number = 0;
	let countUsersLast7Days: number = 0;
	let countActiveUsers: number = 0;
	let oneWeekAgo = new Date(today.getTime() - 7*24*3600*1000);
	users.forEach( user => {
		if(user.val().loginDays) {
			let activeDays: number = 0;
			let userLoginDays = Object.values(user.val().loginDays);
			userLoginDays.forEach( loginDay => {
				if(new Date(String(loginDay)).getTime() >= oneWeekAgo.getTime() && new Date(String(loginDay)).getTime() <= today.getTime()) {
					activeDays++;
				}
			});
			if(activeDays >= 3) {
				countActiveUsers++;
			}
		}
		if(user.val().profile.lastLogin) {
			if(new Date(user.val().profile.lastLogin).getTime() >= yesterday.getTime() && new Date(user.val().profile.lastLogin).getTime() <= today.getTime()) {
				countUsersYesterday++;
			}
			if(new Date(user.val().profile.lastLogin).getTime() >= oneWeekAgo.getTime() && new Date(user.val().profile.lastLogin).getTime() <= today.getTime()) {
				countUsersLast7Days++;
			}
		}
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
						let loggedInInRange: number = 0;
						let loginDays = Object.values(user.val().loginDays);
						loginDays.shift();
						loginDays.forEach( loginDay => {
							if(checkDates[iter-1].getTime() <= new Date(String(loginDay)).getTime() &&  checkDates[iter].getTime() >= new Date(String(loginDay)).getTime()) {
								loggedInInRange++;
							}
						});
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
		activeCounts: activeCounts,
		countUsersYesterday: countUsersYesterday,
		countUsersLast7Days: countUsersLast7Days,
		countActiveUsers: countActiveUsers
	}
	/*
	console.log(data);
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
	*/
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
   			let payload = {
	            notification: {
	                title: "Gossik",
	                body: "Hoiiiii " + new Date().toISOString()
	            },
	            data: {
	              	title: "Gossik",
	                body: "Hoiiiii " + new Date().toISOString(),
	                target: 'todo',
	                todoid: randomTodo.todoid
	            }
	        };
	        Object.values(user.val().devices).forEach( (device) => {
	        	promises.push(admin.messaging().sendToDevice(String(device), payload));
	        });
	    	let pushNotification = {
	    		message: "Hoiiiii " + new Date().toISOString(),
	    		todoid: randomTodo.todoid,
	    		createDate: new Date().toISOString()
	    	}
	    	if(user.val().profile.randomPushTodosReceived) {
	    		admin.database().ref('/users/' + user.key + '/profile').child('randomPushTodosReceived').set(user.val().profile.randomPushTodosReceived + 1);
	    	} else {
	    		admin.database().ref('/users/' + user.key + '/profile').child('randomPushTodosReceived').set(1);
	    	}
	    	admin.database().ref('/users/' + user.key + '/pushNotifications').push(pushNotification);
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
			promises.push(admin.database().ref('/users/' + user.key + '/profile').update(tutorial));
   			// update just one specific value
   			//promises.push(admin.database().ref('/users/' + user.key + '/profile').child('subscription').set('freeUser'));
   			promises.push(admin.database().ref('/users/' + user.key + '/profile').child('subscriptionPaid').set(false));
		   })
		   return Promise.all(promises);
   });
});
*/


