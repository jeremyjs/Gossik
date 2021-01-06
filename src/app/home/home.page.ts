import { Component, ViewChild } from '@angular/core';
import { IonContent, Platform, ModalController, AlertController, IonInput, MenuController, ToastController, PickerController, DomController, PopoverController, IonToolbar } from '@ionic/angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { AngularFireFunctions } from '@angular/fire/functions';

import { TranslateService } from '@ngx-translate/core';

import { AngularFireDatabase} from '@angular/fire/database';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { AuthenticationService } from '../services/authentication.service';
import { DatabaseService } from '../services/database.service';
import { NativeCalendarService } from '../services/native-calendar.service';

import { Capture } from '../../model/capture/capture.model';
import { Goal } from '../../model/goal/goal.model';
import { Action } from '../../model/action/action.model';
import { Attribute } from '../../model/attribute/attribute.model';
import { Reference } from '../../model/reference/reference.model';
import { Delegation } from '../../model/delegation/delegation.model';
import { CalendarEvent } from '../../model/calendarEvent/calendarEvent.model';

import { ActionDetailsModalPage } from '../action-details-modal/action-details-modal.page';
import { DelegationDetailsModalPage } from '../delegation-details-modal/delegation-details-modal.page';
import { ReferenceDetailsModalPage } from '../reference-details-modal/reference-details-modal.page';
import { DefineActionModalPage } from '../define-action-modal/define-action-modal.page';
import { DefineDelegationModalPage } from '../define-delegation-modal/define-delegation-modal.page';
import { DefineReferenceModalPage } from '../define-reference-modal/define-reference-modal.page';
import { GoalDetailsModalPage } from '../goal-details-modal/goal-details-modal.page';
import { CalendarEventModalPage } from '../calendar-event-modal/calendar-event-modal.page';
import { ChangeWeekModalPage } from '../change-week-modal/change-week-modal.page';
import { AssignProjectModalPage } from '../assign-project-modal/assign-project-modal.page';
import { ToDoFilterModalPage } from '../to-do-filter-modal/to-do-filter-modal.page';
import { FivetodosModalPage } from '../fivetodos-modal/fivetodos-modal.page';
import { PopoverAddPage } from '../popover-add/popover-add.page';
import { PopoverAddProjectPage } from '../popover-add-project/popover-add-project.page';
import { PopoverAddThoughtPage } from '../popover-add-thought/popover-add-thought.page';
import { PopoverAddToDoPage } from '../popover-add-to-do/popover-add-to-do.page';
import { PopoverAddCalendarEventPage } from '../popover-add-calendar-event/popover-add-calendar-event.page';
import { PopoverFinishToDoPage } from '../popover-finish-to-do/popover-finish-to-do.page';


import * as moment from 'moment';

import { FirebaseX } from "@ionic-native/firebase-x/ngx";
import { PrivacyPolicyPage } from '../privacy-policy/privacy-policy.page';
import { PopoverFilterToDosPage } from '../popover-filter-to-dos/popover-filter-to-dos.page';
import { PopoverInteractionPage } from '../popover-interaction/popover-interaction.page';
import { Suggestion } from 'src/model/suggestion/suggestion.model';
import { PopoverInteractionPageModule } from '../popover-interaction/popover-interaction.module';
import { stringify } from 'querystring';
import { PopoverAddAttributePageModule } from '../popover-add-attribute/popover-add-attribute.module';
import { PopoverAddAttributePage } from '../popover-add-attribute/popover-add-attribute.page';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

	@ViewChild(IonContent, { read: IonContent, static: true }) content: IonContent;
	@ViewChild('TimeAvailable', {  static: false })  timeAvailable: IonInput;
	loginEmail: string;
	loginPassword: string;
	loginError: string;
	resetPasswordError: string;
	resetPasswordEmail: string;
	signUpEmail: string;
	signUpPassword: string;
	signUpError: string;
  	viewpoint: string;
	captureList: Observable<Capture[]>;
	feedbackList: any;
	feedbackArray = [];
	takenActionList: Observable<Action[]>;
	captureListCheckEmpty: Observable<Capture[]>;
	takenActionListCheckEmpty: Observable<Action[]>;
	newCapture = {} as Capture;
	errorMsg: string;
	isApp: boolean;
	platforms: string;
	capture: Capture;
	goalList: Observable<Goal[]>;
	goalArray: Goal[];
	goalname: string = '';
	referenceList: Observable<Reference[]>;
	nextActionList: Observable<Action[]>;
	delegationList: Observable<Delegation[]>;
	pageCtrl: string;
	assignedGoal = {} as Goal;
	showNextActions: boolean = false;
	showDelegations: boolean = false;
	showReferences: boolean = false;
	defineActionForm: FormGroup;
	defineDelegationForm: FormGroup;
	defineReferenceForm: FormGroup;
	checkDeadline: boolean;
	deadline: string;
	newAction = {} as Action;
	newDelegation = {} as Delegation;
	newReference = {} as Reference;
	takenAction = {} as Action;
	goal = {} as Goal;
  	showAction: string;
  	showDelegation: string;
  	showReference: string;
  	action = {} as Action;
  	delegation = {} as Delegation;
  	reference = {} as Reference;
  	editActionForm: FormGroup;
  	editDelegationForm: FormGroup;
  	editReferenceForm: FormGroup;
  	doableActionList: Observable<Action[]>;
	doableAction = {} as Action;
	giveTimeForm: FormGroup;
	doableActionArray: Action[];
	doableHighPriorityActions: Action[];
	goalFromAction = {} as Goal;
	eventSource = [];
	calendarEventList: Observable<CalendarEvent[]>;
	actionList: Observable<Action[]>;
	viewTitle: string;
	selectedDay = new Date();
	calendar = {
		mode: 'month',
		currentDate: new Date()
	};
	actions = {};
	goals: number;
	takenActionListNotEmpty: boolean;
	captureListNotEmpty: boolean;
	language: string;
	captureArray: Capture[];
	actionArray: Action[];
	delegationArray: Delegation[];
	referenceArray: Reference[];
	takenActionArray: Action[];
	goalDict = {};
	loggedin: boolean;
	chosenGoalArray: string[];
	backButton: any;
	capturePageStarted: boolean = false;
	feedback: string;
	isAdmin: boolean = false;
	manualPushEN: string;
	manualPushDE: string;
	cals = [];
	nativeEvents = [];
	capturePlaceholder: string;
	captureProject = {} as Goal;
	showCaptureProject: boolean = true;
	captureType: string;
	showCaptureType: boolean = false;
	captureDuration: number;
	showCaptureDuration: boolean = false;
	capturePriority: number;
	showCapturePriority: boolean = false;
	captureContent: string;
	showCaptureContent: boolean = false;
	captureDeadline: any;
	showCaptureDeadline: boolean = false;
	captureDeadlineText: string;
	showCaptureSchedule: boolean = false;
	captureSchedule: any;
	captureScheduleISOString: string;
	showCaptureDone: boolean = false;
	captureShowAdd: boolean = true;
	startedAction = {} as Action;
	goalEmpty: boolean;
	allDayLabel: any;
	pageTitle: string;
	cameFromProjectOverviewPage: boolean;
	cameFromFinishActionPage: boolean;
	cameFromProcessPage: boolean;
	cameFromToDoPage: boolean;
	skippedAllToDos: boolean = false;
	duration: number;
	userProfile: any;
	calendarEvents: CalendarEvent[] = [];
	todoview: string = 'list';
	showNavigationBar: boolean = true;
	showOptionals: boolean;
	assistant: string;
	references: any;
	attributeArray: Attribute[];
	suggestionArray: Suggestion[];
	chosenAttributeArray: any[] = [];
	calendarEventsToday: CalendarEvent[] = [];
	elapsedTime: number = 0;
	focusProjects: string[];
	ionChangeGuard: boolean = true;
	formatOptions: any = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    deadlineFormatOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
	projectColors: string[] = ['#6DCADE', '#6DDEA8', '#DE6D6D', '#DEC56D', '#6D9ADE', '#F2994A'];
	priorities: string[] = ["", "Low", "Medium", "High", "High", "High", "High", "High", "High", "High", "High"];
 

	constructor(
		public fb: FormBuilder,
		public translate: TranslateService,
		private auth: AuthenticationService,
		public db: DatabaseService,
		public platform: Platform,
		private afDatabase: AngularFireDatabase,
		public modalCtrl: ModalController,
		public alertCtrl: AlertController,
		private activatedRoute: ActivatedRoute,
		private router: Router,
		private menuCtrl: MenuController,
		private firebase: FirebaseX,
		private nativeCalendar: NativeCalendarService,
		public toastCtrl: ToastController,
		public pickerCtrl: PickerController,
		public domCtrl: DomController,
		public popoverCtrl: PopoverController,
		private functions: AngularFireFunctions
		) {
		this.isApp = this.platform.is('cordova');
		console.log('for developing, this.isApp is set to true always because otherwhise, cannot test on desktop using --lab flag.');
		this.isApp = true;
		this.backButton = this.platform.backButton;
		this.backButton.subscribe(()=>{
			this.alertCtrl.getTop().then ( alert => {
				if(alert) {
					alert.dismiss();
				} else {
					this.modalCtrl.getTop().then( modal => {
						if(modal)  {
							modal.dismiss();
						} else {
							navigator['app'].exitApp();
						}
					})
				}
			})
		});
	}

	getCalendarEvents() {
		this.calendarEventList = this.db.getCalendarEventListFromUser(this.auth.userid)
		.snapshotChanges()
		.pipe(
			map(
				changes => { 
					return changes.map( c => {
						let calendarEvent: CalendarEvent = { 
							key: c.payload.key, ...c.payload.val()
							};
						return calendarEvent;
				});
			})
		);
		this.calendarEventList.subscribe( calendarEventArray => {
			this.calendarEvents = [];
	        for(let calendarEvent of calendarEventArray) {
	        	if(calendarEvent.active != false) {
		        	calendarEvent.startTime = new Date(calendarEvent.startTime);
		        	calendarEvent.endTime = new Date(calendarEvent.endTime);
		        	this.calendarEvents.push(calendarEvent);
		        }
	        };
	        if(this.platform.is('cordova') && (this.userProfile.subscription != 'syncCalendarFeature' || this.userProfile.subscription == 'syncCalendarFeature' && this.userProfile.subscriptionPaid)) {
				this.nativeCalendar.hasReadWritePermission().then( hasReadWritePermission => {
					if(hasReadWritePermission) {
						this.loadNativeCalendarEvents();
					} else {
						this.nativeCalendar.requestReadWritePermission().then( hasReadWritePermission => {
							if(hasReadWritePermission) {
								this.loadNativeCalendarEvents();
							}
						});
					}
				});
			} else {
				this.loadCalendarEventsToday();
			}
	    });
	}

	loadNativeCalendarEvents() {
		this.nativeCalendar.loadEventsFromNativeCalendar().then(nativeEvents => {
			if(this.calendarEvents.length > 0) {
				for(let calendarEvent of this.calendarEvents) {
					if(calendarEvent.event_id) {
							let nativeEventFromGossik = nativeEvents.findIndex(nativeEvent => nativeEvent.event_id == calendarEvent.event_id);
							if(nativeEventFromGossik != -1) {
								nativeEvents.splice(nativeEventFromGossik,1);
							}
					}
				}
			}
			if(this.platform.is('ios')) {
				for(let nativeEvent of nativeEvents) {
					nativeEvent.startTime.setHours(nativeEvent.startTime.getHours() + this.userProfile.timezoneOffset/60);
					nativeEvent.endTime.setHours(nativeEvent.endTime.getHours() + this.userProfile.timezoneOffset/60);
				}
			}
			this.calendarEvents.push(...nativeEvents);
			this.loadCalendarEventsToday();
		});
	}

	loadCalendarEventsToday() {
		this.calendarEventsToday = [];
		for(let calendarEvent of this.calendarEvents) {
			let startDate = new Date(calendarEvent.startTime);
			if(this.isDateToday(startDate)) {
				calendarEvent.startTimeString = this.dateToTimeString(new Date(calendarEvent.startTime));
				this.calendarEventsToday.push(calendarEvent);
			}
		}
	}

	dateToTimeString(date: Date) {
		let result: string;
		if(date.getHours() > 9) { 
			result = String(date.getHours());
		} else {
			result = '0' + String(date.getHours());
		}
		result += ':';
		if(date.getMinutes() > 9) { 
			result += String(date.getMinutes());
		} else {
			result += '0' + String(date.getMinutes());
		}
		return result;
	}

	isDateToday = (date) => {
		const today = new Date()
		return date.getDate() === today.getDate() &&
			date.getMonth() === today.getMonth() &&
			date.getFullYear() === today.getFullYear();
	};

	getStartedAction() {
		this.takenActionList = this.db.getTakenActionListFromUser(this.auth.userid)
		.snapshotChanges()
		.pipe(
			map(
				changes => { 
					return changes.map( c => {
						let action: Action = { 
							key: c.payload.key, ...c.payload.val()
							};
						return action;
				});}));
		this.takenActionList.subscribe( takenActionArray => {
			this.takenActionArray = [];
			for(let action of takenActionArray) {
				if(action.active != false){
					this.takenActionArray.push(action);
				}
			}
			this.takenActionListNotEmpty = (this.takenActionArray.length > 0);
			if(this.takenActionListNotEmpty) {
				this.startedAction = this.takenActionArray[0];
			} else {
				this.startedAction = {} as Action;
			}
		});
	}

	getGoals() {
		this.goalList = this.db.getGoalList(this.auth.userid)
		  	.snapshotChanges()
		  	.pipe(
				map(
					changes => { 
						return changes.map( c => {
							let data: Goal = { 
								key: c.payload.key, ...c.payload.val()
								};
							return data;
			});}));
		this.goalList.subscribe( goalArray => {
			this.goalArray = [];
			this.goalDict = {};
			goalArray.sort((a, b) => a.name.localeCompare(b.name));
			goalArray.unshift({key: 'unassigned'} as Goal);
			for(let goal of goalArray) {
				if(goal.active != false) {
					this.goalArray.push(goal);
					this.goalDict[goal.key] = goal;
				}
			}
		});
	}

	getActions() {
		this.nextActionList = this.db.getNextActionListFromUser(this.auth.userid)
		.snapshotChanges()
		.pipe(
			map(
				changes => { 
					return changes.map( c => {
						let action: Action = { 
							key: c.payload.key, ...c.payload.val()
							};
						return action;
					});
				}
			)
		);
		this.nextActionList.subscribe( actionArray => {
			this.actionArray = [];
			this.actions = {};
			for(let action of actionArray) {
				if(action.active != false) {
					this.actionArray.push(action);
					if(this.actions[action.goalid]) {
						this.actions[action.goalid].push(action);
					} else {
						this.actions[action.goalid] = [action];
					}
				}
			}
			this.showDoableActions();
		});
	}

	getCaptures() {
		this.captureList = this.db.getCaptureListFromUser(this.auth.userid)
		.snapshotChanges()
		.pipe(
			map(
				changes => { 
					return changes.map( c => {
						let capture: Capture = { 
							key: c.payload.key, ...c.payload.val()
						};
						return capture;
				});}));
		this.captureList.subscribe( captureArray => {
			this.captureArray = [];
			for(let capture of captureArray) {
				if(capture.active != false){
					this.captureArray.push(capture);
				}
			}
			this.captureListNotEmpty = (this.captureArray.length > 0);
		});
	}

	getReferences() {
		this.referenceList = this.db.getReferenceListFromUser(this.auth.userid)
		  	.snapshotChanges()
		  	.pipe(
				map(
					changes => { 
						return changes.map( c => {
							let reference: Reference = { 
								key: c.payload.key, ...c.payload.val()
								};
							return reference;
			});}));
		this.referenceList.subscribe( referenceArray => {
			this.referenceArray = [];
			this.references = {};
			for( let reference of referenceArray) {
				if(reference.active != false) {
					this.referenceArray.push(reference);
					if(this.references[reference.goalid]) {
						this.references[reference.goalid].push(reference);
					} else {
						this.references[reference.goalid] = [reference];
					}
				}
			}
		});
	}

	getAttributes() {
		this.db.getAttributeListFromUser(this.auth.userid)
		  	.snapshotChanges()
		  	.pipe(
				map(
					changes => { 
						return changes.map( c => {
							let attribute: Attribute = { 
								key: c.payload.key, ...c.payload.val()
								};
							return attribute;
			});
		}))
		.subscribe( attributeArray => {
			this.attributeArray = [];
			for( let attribute of attributeArray) {
				if(attribute.active != false) {
					this.attributeArray.push(attribute);
				}
			}
		});
	}

	getSuggestions() {
		this.db.getSuggestionListFromUser(this.auth.userid)
		  	.snapshotChanges()
		  	.pipe(
				map(
					changes => { 
						return changes.map( c => {
							let suggestion: Suggestion = { 
								key: c.payload.key, ...c.payload.val()
								};
							return suggestion;
			});
		}))
		.subscribe( suggestionArray => {
			this.suggestionArray = [];
			for( let suggestion of suggestionArray) {
				if(suggestion.active != false) {
					this.suggestionArray.push(suggestion);
				}
			}
		});
	}

	initPushNotifications() {
		this.firebase.getToken().then(token => {
			this.db.saveDeviceToken(this.auth.userid, token);
		});
		this.firebase.onMessageReceived().subscribe(data => {
			if(!data.target) {
				let title = '';
				if(data.title) {
					title = data.title;
				} else if(data.notification && data.notification.title) {
					title = data.notification.title;
				} else if(data.aps && data.aps.alert && data.aps.alert.title) {
					title = data.aps.alert.title;
				}
				let body = '';
				if(data.body){
			        body = data.body;
			    } else if(data.notification && data.notification.body){
			        body = data.notification.body;
			    } else if(data.aps && data.aps.alert && data.aps.alert.body){
			        body = data.aps.alert.body;
			    }
				this.alertCtrl.create({
					message: title + ' ' + body,
					buttons: [
						    	{
							        text: "Ok"
						      	}
						    ]
				}).then( alert => {
					alert.present();
				});
			} else {
				this.goToToDoPage(data.todoid);
			}
		});
	}

	changePageViaMenu() {
		let page = this.activatedRoute.snapshot.paramMap.get('page');
		if(page) {
			if(page == 'settings') {
				this.goToSettingsPage();
			} else if(page == 'privacy-policy') {
				this.goToPrivacyPolicyPage();
			} else if(page == 'rerun-tutorial') {
				this.db.startTutorial(this.auth.userid);
				this.goToToDoPage();
			} else if(page == 'give-feedback') {
				this.goToFeedbackPage();
			} else if(page == 'show-feedback') {
				this.goToShowFeedbackPage();
			}
		} else {
			this.goToToDoPage();
		}
	}

	updateTimezoneOffset() {
		let timezoneOffset = new Date().getTimezoneOffset();
		if (!this.userProfile.timezoneOffset || (this.userProfile.timezoneOffset && this.userProfile.timezoneOffset != timezoneOffset)) {
			this.db.updateTimezoneOffset(this.auth.userid, timezoneOffset);
		}
	}

	showInfo(info:string) {
		if(info == 'smartAssistant') {
			let text = "I will consider all your deadlines, tasks, projects, and even your behavior and workflow routines to prioritize your to-dos for you. With this, I can show you the tasks that are relevant right now for you and you don’t waste time looking at your complete to-do list.";
			let buttons = ['Close'];
			let title = "What is the Smart Assistant?";
			this.presentPopover('showInteraction', [text, buttons, title]);
		}
	}

	ngOnInit() {
  		this.auth.afAuth.authState
		.subscribe(
			user => {
			  if (user) {
				if(this.isApp && this.platform.is('cordova')) {
			  		this.firebase.hasPermission().then( hasPermission => {
			  			if(hasPermission) {
			  				this.initPushNotifications();
				  		} else {
				  			this.firebase.grantPermission().then( hasPermission => {
				  				if(hasPermission) {
				  					this.initPushNotifications();
				  				}
				  			})
				  		}
			  		})
				}
				this.getStartedAction();
				this.getGoals();
				this.getActions();
				this.getCaptures();
				this.getReferences();
				this.getAttributes();
				this.getSuggestions();
				this.db.getUserProfile(this.auth.userid).valueChanges().subscribe( userProfile => {
					this.userProfile = userProfile;
					this.focusProjects = [];
					for(let key in this.userProfile.focusProjects) {
						this.focusProjects.push(this.userProfile.focusProjects[key]);
					}
					if(this.userProfile.smartAssistant == undefined) {
						this.db.switchSmartAssistant(true, this.auth.userid);
					}
					this.isAdmin = this.userProfile.isAdmin;
					this.updateTimezoneOffset();
					this.assistant = this.userProfile.assistant;
					if(!this.userProfile.learnedSchedule) {
						this.db.initiateLearnedSchedule(this.auth.userid);
					}
					if(this.userProfile.subscription == 'completeApp' && !this.userProfile.subscriptionPaid) {
						this.presentAlert("unpaidCompleteAppSubscription");
						this.logout();
					}
					this.getCalendarEvents();
				});
				if(this.isApp) {
					this.calendar.mode = 'month'
				} else {
					this.calendar.mode = 'week';
				}
				this.db.changeLanguage(this.auth.userid, this.translate.currentLang);
				this.db.trackLogin(this.auth.userid);
			  	this.loggedin = true;
			  	this.router.events.subscribe(res => {
					if (res instanceof NavigationEnd) {
						this.changePageViaMenu();
					}
				});
			  	this.changePageViaMenu();
			  } else {
				  this.loggedin = false;
			    this.goToLoginPage();
			  }
			}
		);
  	}

  	openMenu() {
  		this.menuCtrl.toggle();
  	}

	changePage(viewpoint: string, pageCtrl?: string) {
  		this.content.scrollToTop();
  		this.errorMsg = '';
  		if(pageCtrl != undefined) {
  			this.pageCtrl = pageCtrl;
  		} else {
  			this.pageCtrl = '';
		  }
  		this.viewpoint = viewpoint;
  	}

  	changePageCtrl(pageCtrl: string) {
  		this.pageCtrl = pageCtrl;
  	}

  	async presentToast(toastMessage) {
	    const toast = await this.toastCtrl.create({
	      message: toastMessage,
	      cssClass: 'toast',
	      duration: 3000
	    });
	    toast.present();
  	}

  	presentAlert(alertMessage) {
		if(alertMessage == "Have you been referred by another Gossik user?") {
			this.translate.get([alertMessage, "Yes", "No"]).subscribe( translation => {
				let buttons = [];
				buttons = [
								{
								  text: translation["Yes"],
								  handler: () => {
									let credentials = {
										email: this.signUpEmail,
										password: this.signUpPassword
									};
									this.auth.signUp(credentials).then(user =>  {
										this.db.createUser(user.user.uid, user.user.email, true);
									}).then(
										() => {
											this.translate.get(["Successfully registered"]).subscribe( translation => {
												  this.presentToast(translation["Successfully registered"]);
											});
											setTimeout(() => this.goToToDoPage());
										},
										error => this.signUpError = error.message
									);
								  }
								},
								{
								  text: translation["No"],
								  handler: () => {
									let credentials = {
										email: this.signUpEmail,
										password: this.signUpPassword
									};
									this.auth.signUp(credentials).then(user =>  {
										this.db.createUser(user.user.uid, user.user.email, false);
									}).then(
										() => {
											this.translate.get(["Successfully registered"]).subscribe( translation => {
												  this.presentToast(translation["Successfully registered"]);
											});
											setTimeout(() => this.goToToDoPage());
										},
										error => this.signUpError = error.message
									);
								  }
								}
						  ];
				this.alertCtrl.create({
				  message: translation[alertMessage],
				  buttons: buttons
			  }).then( alert => {
				  alert.present();
			  });
			})
		} else {
			this.translate.get([alertMessage, "OK"]).subscribe( translation => {
				let buttons = [];
				buttons = [
								{
								  text: translation["OK"]
								}
						  ];
				this.alertCtrl.create({
				  message: translation[alertMessage],
				  buttons: buttons
			  }).then( alert => {
				  alert.present();
			  });
			});
		}
	  }
	  
	async presentPopover(name, params?) {
		if(name == 'add') {
			let cssClass: string = 'popover-add';
			let componentProps: any = {};
			if(params && params.tutorial) {
				cssClass = 'popover-add-tutorial';
				componentProps = {'tutorial': true};
			}
			const popover = await this.popoverCtrl.create({
			component: PopoverAddPage,
			componentProps: componentProps,
			cssClass: cssClass
			});
			await popover.present();
			popover.onDidDismiss().then( data => {
				if(data.data) {
					this.presentPopover(data.data);
				} else {
					if(params && params.tutorial) {
						let text = "Here on the Do page, you can work off your to-dos.";
						let buttons = ["Next"];
						let title = '(3/8)';
						this.presentPopover('showInteraction', [text, buttons, title,1]);
					}
				}
			});
		} else if(name == 'addProject') {
			const popover = await this.popoverCtrl.create({
			component: PopoverAddProjectPage,
			componentProps: {'projectColors': this.projectColors},
			cssClass: 'popover-add-project'
			});
			await popover.present();
			popover.onDidDismiss().then( data => {
				if(data.data) {
					this.addGoal(data.data);
				}
			});
		} else if(name == 'editProject') {
			let componentProps: any = {
				'project': params,
				'projectColors': this.projectColors
			};
			const popover = await this.popoverCtrl.create({
			component: PopoverAddProjectPage,
			cssClass: 'popover-add-project',
			componentProps: componentProps
			});
			await popover.present();
			popover.onDidDismiss().then( data => {
				if(data.data) {
					if(data.data == 'delete') {
						this.deleteGoal(params);
					} else {
						let goalkey = params.key;
						this.db.editGoal(data.data, this.auth.userid);
						data.data.key = goalkey;
					}
				}
			});
		} else if(name == 'addThought') {
			let componentProps: any = {
				'goalDict': this.goalDict,
				'projectColors': this.projectColors
			};
			if(this.viewpoint == 'ProjectOverviewPage') {
				componentProps['goalid'] = this.goal.key;
			}
			const popover = await this.popoverCtrl.create({
			component: PopoverAddThoughtPage,
			cssClass: 'popover-add-thought',
			componentProps: componentProps
			});
			await popover.present();
			popover.onDidDismiss().then( data => {
				if(data.data) {
					if(data.data[1]) {
						this.addNoteFromCapture(data.data[0], data.data[1]);
					} else {
						this.addCapture(data.data[0]);
					}
				}
			});
		} else if(name == 'addToDo') {
			let componentProps: any = {
				'goalDict': this.goalDict,
				'projectColors': this.projectColors
			};
			if(this.viewpoint == 'ProjectOverviewPage') {
				componentProps['projectid'] = this.goal.key;
			}
			if(params) {
				componentProps['thought'] = params;
			}
			const popover = await this.popoverCtrl.create({
			component: PopoverAddToDoPage,
			componentProps: componentProps,
			cssClass: 'popover-add-to-do'
			});
			await popover.present();
			popover.onDidDismiss().then( data => {
				if(data.data) {
					this.addToDo(data.data);
					if(params) {
						if(!params.goalid) {
							this.deleteCapture(params);
						} else {
							this.deleteReference(params);
						}
					}
				}
			});
		} else if(name == 'addCalendarEvent') {
			let componentProps: any = {
				'goalDict': this.goalDict,
				'projectColors': this.projectColors
			};
			if(params) {
				componentProps['startTime'] = params;
			}
			const popover = await this.popoverCtrl.create({
			component: PopoverAddCalendarEventPage,
			componentProps: componentProps,
			cssClass: 'popover-add-calendar-event'
			});
			await popover.present();
			popover.onDidDismiss().then( data => {
				if(data.data) {
					this.addCalendarEvent(data.data);
				}
			});
		} else if(name == 'showToDo') {
			let componentProps: any = {
				'goalDict': this.goalDict,
				'todo': params,
				'projectColors': this.projectColors
			};
			const popover = await this.popoverCtrl.create({
			component: PopoverAddToDoPage,
			componentProps: componentProps,
			cssClass: 'popover-add-calendar-event'
			});
			await popover.present();
			popover.onDidDismiss().then( data => {
				if(data.data) {
					if(data.data == 'delete') {
						this.deleteAction(params);
					} else if(data.data == 'start') {
						this.startAction(params);
					} else if(data.data == 'markDone') {
						this.finishToDo(params);
					} else {
						this.db.editAction(data.data, this.auth.userid);
					}
				}
			});
		} else if(name == 'finishToDo') {
			if(!params) {
				params = this.startedAction;
			}
			const popover = await this.popoverCtrl.create({
			component: PopoverFinishToDoPage,
			cssClass: 'popover-finish-to-do'
			});
			await popover.present();
			popover.onDidDismiss().then( data => {
				if(data.data) {
					if(data.data == 'createNow') {
						this.defineFollowUpTodoNow(params);
					} else if(data.data == 'createLater') {
						this.defineFollowUpTodoLater(params);
					} else if(data.data == 'noFollowUp') {
						this.noFollowUpTodoRequired(params);
					}
				}
			});
		} else if(name == 'showThought') {
			const popover = await this.popoverCtrl.create({
			component: PopoverAddThoughtPage,
			componentProps: {
				'thought': params[0],
				'goalid': params[1],
				'goalDict': this.goalDict,
				'projectColors': this.projectColors
			},
			cssClass: 'popover-add-thought'
			});
			await popover.present();
			popover.onDidDismiss().then( data => {
				if(data.data && params[0].goalid) {
					// Assigned thought, i.e. reference
					if(data.data == 'delete') {
						this.deleteReference(params[0]);
					} else if(data.data == 'createToDo') {
						this.presentPopover('addToDo', params[0]);
					} else {
						data.data[0].goalid = data.data[1];
						this.db.editReference(data.data[0], this.auth.userid);
					}
				} else {
					// Unassigned thought, i.e. capture
					if(data.data == 'delete') {
						this.deleteCapture(params[0]);
					} else if(data.data == 'createToDo') {
						this.presentPopover('addToDo', params[0]);
					} else if(!data.data[1]) {
						this.db.editCapture(data.data[0], this.auth.userid);
					} else if(data.data[1]) {
						this.addNoteFromCapture(data.data[0], data.data[1]);
					}
				}
			});
		} else if(name == 'filterToDos') {
			const popover = await this.popoverCtrl.create({
			component: PopoverFilterToDosPage,
			componentProps: {
				'attributeArray': this.attributeArray,
				'chosenAttributeArray': this.chosenAttributeArray,
				'chosenGoalArray': this.chosenGoalArray,
				'goalArray': this.goalArray
			},
			cssClass: 'popover-filter-to-dos'
			});
			await popover.present();
			popover.onDidDismiss().then( data => {
				if(data.data) {
					this.chosenGoalArray = data.data.chosenGoalArray;
					this.chosenAttributeArray = data.data.chosenAttributeArray;
					for(let goalid of this.chosenGoalArray) {
						if(goalid != 'unassigned') {
							let dates = [new Date()];
							this.db.learnLearnedSchedule(this.auth.userid, this.chosenGoalArray, dates, 1);
						}
					}
					this.showDoableActions();
				}
			});
		} else if(name == 'showCalendarEvent') {
			let componentProps: any = {
				'goalDict': this.goalDict,
				'projectColors': this.projectColors
			};
			if(params) {
				componentProps['calendarEvent'] = params;
			}
			const popover = await this.popoverCtrl.create({
			component: PopoverAddCalendarEventPage,
			componentProps: componentProps,
			cssClass: 'popover-add-calendar-event'
			});
			await popover.present();
			popover.onDidDismiss().then( data => {
				params.startTime = new Date(params.startTime);
				params.endTime = new Date(params.endTime);
				if(data.data) {
					if(data.data == 'delete') {
						this.deleteCalendarEvent(params);
					} else {
						this.editCalendarEvent(data.data);
					}
				}
			});
		} else if(name == 'showInteraction') {
			let componentProps: any = {
				'text': params[0],
				'buttons': params[1],
				'title': params[2]
			};
			const popover = await this.popoverCtrl.create({
			component: PopoverInteractionPage,
			componentProps: componentProps,
			cssClass: 'popover-interaction'
			});
			await popover.present();
			popover.onDidDismiss().then( data => {
				if(params[3] == 0) {
					this.presentPopover('add', {tutorial: true});
				} else if(params[3] == 1) {
					if(data.data == 'Next') {
						let text = "On the top, you can enter your available time. For example, when you have 20min available, I will only show you to-dos that are doable within 20min.";
						let buttons = ["Back", "Next"];
						let title = '(4/8)';
						this.presentPopover('showInteraction', [text, buttons, title, 2]);
					}
				} else if(params[3] == 2) {
					if(data.data == 'Next') {
						let text = "The smart assistant will prioritize your to-dos for you and show your the most relevant tasks according to your current situation.";
						let buttons = ["Back", "Next"];
						let title = '(5/8)';
						this.presentPopover('showInteraction', [text, buttons, title, 3]);
					} else if(data.data == 'Back') {
						let text = "Here on the Do page, you can work off your to-dos.";
						let buttons = ["Next"];
						let title = '(3/8)';
						this.presentPopover('showInteraction', [text, buttons, title,1]);
					}
				} else if(params[3] == 3) {
					this.goToAssistantPage();
					if(data.data == 'Next') {
						let text = "Here on the Assistant page, I show you statistics and facts that I learned and observed.";
						let buttons = ["Back", "Next"];
						let title = '(6/8)';
						this.presentPopover('showInteraction', [text, buttons, title, 4]);
					} else if(data.data == 'Back') {
						let text = "On the top, you can enter your available time. For example, when you have 20min available, I will only show you to-dos that are doable within 20min.";
						let buttons = ["Back", "Next"];
						let title = '(4/8)';
						this.presentPopover('showInteraction', [text, buttons, title, 2]);
					}
				} else if(params[3] == 4) {
					if(data.data == 'Next') {
						let text = "You can also change these things to modify how I prioritize and schedule your to-dos for you.";
						let buttons = ["Back", "Next"];
						let title = '(7/8)';
						this.presentPopover('showInteraction', [text, buttons, title, 5]);
					} else if(data.data == 'Back') {
						let text = "The smart assistant will prioritize your to-dos for you and show your the most relevant tasks according to your current situation.";
						let buttons = ["Back", "Next"];
						let title = '(5/8)';
						this.presentPopover('showInteraction', [text, buttons, title, 3]);
					}
				} else if(params[3] == 5) {
					if(data.data == 'Next') {
						let text = "And I give you suggestions that should help you to get everything under control. For example, when a deadline approaches, I will suggest you to increase the priority of this task to avoid stress.";
						let buttons = ["Back", "Close"];
						let title = '(8/8)';
						this.presentPopover('showInteraction', [text, buttons, title, 6]);
					} else if(data.data == 'Back') {
						let text = "Here on the Assistant page, I show you statistics and facts that I learned and observed.";
						let buttons = ["Back", "Next"];
						let title = '(6/8)';
						this.presentPopover('showInteraction', [text, buttons, title, 4]);
					}
				} else if(params[3] == 6) {
					if(data.data == 'Close') {
						this.db.finishTutorial(this.auth.userid);
					} else if(data.data == 'Back') {
						let text = "You can also change these things to modify how I prioritize and schedule your to-dos for you.";
						let buttons = ["Back", "Next"];
						let title = '(7/8)';
						this.presentPopover('showInteraction', [text, buttons, title, 5]);
					}
				} else if(params[3] == 'suggestion') {
					if(data.data) {
						if(params[4].type == 'IncreasePriority') {
							if(data.data == 'Follow suggestion') {
								let todo = this.actionArray[this.actionArray.findIndex(todo => todo.key == params[4].todoid)];
								todo.priority = todo.priority + 1;
								this.db.editAction(todo, this.auth.userid).then( () => {
									this.db.deleteSuggestion(params[4], this.auth.userid).then( () => {
										this.translate.get(["Priority has been increased"]).subscribe( translation => {
											this.presentToast(translation["Priority has been increased"]);
									  });
									});
								});
							} else {
								this.db.deleteSuggestion(params[4], this.auth.userid);
							}
						} else if (params[4].type == 'SetFocus') {
							if(data.data == 'Follow suggestion') {
								this.db.setFocus(params[4].projectid, this.auth.userid).then( () => {
									this.db.deleteSuggestion(params[4], this.auth.userid).then( () => {
										this.translate.get(["Focus set"]).subscribe( translation => {
											this.presentToast(translation["Focus set"]);
									  });
									});
								});
							} else {
								this.db.deleteSuggestion(params[4], this.auth.userid);
							}
						} else if (params[4].type == 'SliceTask') {
							if(data.data == 'Follow suggestion') {
								let todo = this.actionArray[this.actionArray.findIndex(todo => todo.key == params[4].todoid)];
								this.showToDo(todo);
								this.db.deleteSuggestion(params[4], this.auth.userid);
							} else {
								this.db.deleteSuggestion(params[4], this.auth.userid);
							}
						} else if (params[4].type == 'DeleteToDo') {
							if(data.data == 'Follow suggestion') {
								let todo = this.actionArray[this.actionArray.findIndex(todo => todo.key == params[4].todoid)];
								this.deleteAction(todo);
								this.db.deleteSuggestion(params[4], this.auth.userid);
							} else {
								this.db.deleteSuggestion(params[4], this.auth.userid);
							}
						} else if (params[4].type == 'SetNewDeadline') {
							if(data.data == 'Follow suggestion') {
								let todo = this.actionArray[this.actionArray.findIndex(todo => todo.key == params[4].todoid)];
								this.showToDo(todo);
								this.db.deleteSuggestion(params[4], this.auth.userid);
							} else {
								this.db.deleteSuggestion(params[4], this.auth.userid);
							}
						}
					}
				} else if(params[3] == 'assignAssistant') {
					if(data.data) {
						this.db.updateAssistant(this.auth.userid, data.data);
					}
				}
			});
		} else if(name == 'showAttribute') {
			const popover = await this.popoverCtrl.create({
			component: PopoverAddAttributePage,
			componentProps: {
				'attribute': params,
			},
			cssClass: 'popover-add-attribute'
			});
			await popover.present();
			popover.onDidDismiss().then( data => {
				if(data.data ) {
					if(data.data == 'delete') {
						this.db.deleteAttribute(params, this.auth.userid);
					} else {
						this.db.editAttribute(data.data, this.auth.userid);
					}
				}
			});
		} 
	}

  	goToPrivacyPolicyPage() {
		  this.changePage('PrivacyPolicyPage');
		  this.pageTitle = 'Privacy Policy';
  	}

  	// LoginPage functions
	goToLoginPage() {
		this.loginError = undefined;
		this.changePage('LoginPage');
	}

  	login() {
		let credentials = {
			email: this.loginEmail,
			password: this.loginPassword
		};
		this.auth.signInWithEmail(credentials)
			.then(
				() => {
					this.db.login();
				},
				error => this.loginError = error.message
			);
  	} 

  	goToSignUp(){
  		this.signUpError = undefined;
		  this.changePage('SignUpPage');
	}

	signUp() {
		this.presentAlert("Have you been referred by another Gossik user?");

  	}
	
	goToForgotPassword() {
		this.resetPasswordError = undefined;
		this.changePage('ResetPasswordPage');
	}

	resetPassword() {
		this.auth.sendPasswordResetEmail(this.resetPasswordEmail)
		.then(
				() => {
						
							this.pageCtrl = '';
				},
				error => this.resetPasswordError = error.message
			);
	}

	goToSettingsPage() {
		this.pageTitle = "Settings";
  		this.changePage('SettingsPage');
  	}

  	// SettingsPage functions
  	logout() {
		this.db.logout();
		this.auth.signOut().then( () => {
			this.pageTitle = '';
			this.goToLoginPage();
		});
    }

    goToFeedbackPage() {
    	this.pageTitle = "Feedback";
    	this.changePage('FeedbackPage');
	}
	
	showAttribute(attribute: Attribute) {
		this.presentPopover('showAttribute', attribute);
	}
	
	goToThemesPage() {
		if(this.userProfile.subscription != 'themesFeature' || this.userProfile.subscription == 'themesFeature' && this.userProfile.subscriptionPaid) {
			this.presentAlert("paidFeatureMissingSubscription");
		} else if(this.userProfile.subscription == 'themesFeature' && !this.userProfile.subscriptionPaid) {
			this.presentAlert("unpaidFeatureSubscription");
		} else {
			this.presentAlert("featureMissing");
		}
	}

    goToAssistantPage() {
		this.checkUserTracking();
		this.showLoggedIn7Days();
		if(this.userProfile && !this.userProfile['assistant']) {
			this.db.initiateAssistant(this.auth.userid);
		}
		this.pageTitle = "Assistant";
		this.changePage('AssistantPage', 'today');
	}
	
	switchAssistantTab(event) {
		this.pageCtrl = event.detail.value;
	}

    assignAssistant() {
		if(this.userProfile.subscription == 'assistantFeature' && !this.userProfile.subscriptionPaid) {
			this.presentAlert("unpaidAssistantSubscription");
			this.assistant = 'silent';
			this.db.updateAssistant(this.auth.userid, this.assistant);
		} else {
			let title : string = "Choose assistant type";
			let text: string = "assistant description";
			let buttons: string[] = ["Silent", "Chiller", "Standard", "Pusher"];
			this.presentPopover('showInteraction', [text, buttons, title, 'assignAssistant']);
		}
	}

	setFocus(event) {
		if(event && this.isIterable(event.detail.value) && event.detail.value.length > 0 && this.ionChangeGuard) {
			this.ionChangeGuard = false;
			this.db.clearFocus(this.auth.userid).then( () => {
				for(let focus of event.detail.value) {
					this.db.setFocus(focus, this.auth.userid).then( () => {
						setTimeout( () => {
							this.ionChangeGuard = true;
						}, 1000);
					});
				}
			});
		} else if(event && event.detail.value.length == 0 && this.ionChangeGuard) {
			this.ionChangeGuard = false;
			this.db.clearFocus(this.auth.userid).then( () => {
				setTimeout( () => {
					this.ionChangeGuard = true;
				}, 1000);
			})
		}
	}

	isIterable(obj) {
		// checks for null and undefined
		if (obj == null) {
		  return false;
		}
		return typeof obj[Symbol.iterator] === 'function';
	  }

	checkUserTracking() {
		let dates = [];
		let firstOne = new Date("2020-08-05T00:00:00.138Z");
		let today = new Date();
		/*
		while(today.getTime() >= firstOne.getTime()) {
			firstOne.setDate(firstOne.getDate() + 1);
			this.functions.httpsCallable('trackingSystemNew')({startDate: firstOne.toISOString()}).subscribe( data => {
				console.log(data);
			})
		}
		*/
		this.functions.httpsCallable('trackingSystemNew')({startDate: new Date("2020-08-05T00:00:00.138Z").toISOString()}).subscribe( data => {
			//(data);
		})
	}
	
	showLoggedIn7Days() {
		let sevenDaysAgo = new Date(new Date().getTime() - 7*24*3600*1000).toISOString();
		for(let numberDays of [1,2,3,4,5,6]) {
			this.functions.httpsCallable('loginStats')({startDate: sevenDaysAgo, endDate: new Date().toISOString(), numberDays: numberDays}).subscribe( loginStats => {
				//console.log(String(numberDays) + ' or more days logged in: ' + String(loginStats.activeUsers) + ' users');
			});
		}
	}

    goToShowFeedbackPage() {
    	this.feedbackList = this.db.getFeedbackList()
		.snapshotChanges()
		.pipe(
			map(
				changes => { 
					return changes.map( c => {
						let feedback = { 
							key: c.payload.key, ...c.payload.val()
							};
						return feedback;
				});}))
		.subscribe( feedbackArray => {
			this.feedbackArray = feedbackArray;
		});
		this.pageTitle = 'Feedback';
    	this.changePage('ShowFeedbackPage');
    }

    // FeedbackPage functions
    sendFeedback(feedback) {
    	let time = new Date();
    	this.db.sendFeedback(feedback, time.toISOString(), this.auth.userid).then( () => {
    		this.feedback = '';
    		this.translate.get(["Thank you very much for your feedback. We'll do our best to improve Gossik for you.", "OK"]).subscribe( alertMessage => {
			  		this.alertCtrl.create({
						message: alertMessage["Thank you very much for your feedback. We'll do our best to improve Gossik for you."],
						buttons: [
							      	{
								        text: alertMessage["OK"]
							      	}
							    ]
					}).then( alert => {
						alert.present();
					});
				});
    	});
    }

    goToSendPushPage() {
    	this.changePage('SendPushPage');
    }

    // SendPushPage functions
    sendPush(manualPushEN, manualPushDE) {
    	this.db.sendPush(manualPushEN, manualPushDE).then(() => {
    		this.manualPushDE = '';
    		this.manualPushEN = '';
    	});
    }

	// CapturePage functions

	ionFocus(event){
		this.showNavigationBar = false;
	}

	ionBlur(event) {
		this.showNavigationBar = true;
	}

  	addCapture(capture: Capture) {
	    if(capture.content !== '' && capture.content !== null && capture.content !== undefined) {
			this.errorMsg = "";
			capture.userid = this.auth.userid;
			capture.active = true;
			this.db.addCapture(capture, this.auth.userid);
			this.newCapture = {} as Capture;
		  	this.newCapture.content = '';
			this.translate.get(["Thought saved"]).subscribe( translation => {
				this.presentToast(translation["Thought saved"]);
			});
	    } else {
	      this.errorMsg = "You cannot save an empty capture.";
	    }
  	}

  	addCapturePicture() {
  		//ToDo
  	}

  	addCaptureVoice() {
  		//ToDo
  	}

  	cancelCapture() {
  		this.newCapture.content = '';
		this.goToProcessPage();
  	}

  	deleteCapture(capture: Capture) {
  		this.db.deleteCapture(capture, this.auth.userid);
  		this.translate.get(["Thought deleted"]).subscribe( translation => {
	  		this.presentToast(translation["Thought deleted"]);
		});
  	}

  	goToCapturePage() {
		if(this.userProfile.subscription == 'limitedFeatures' && !this.userProfile.subscriptionPaid && this.captureArray.length >= 10) {
			this.presentAlert("unpaidLimitedFeaturesSubscription")
		} else {
			this.pageTitle = "Create new thought";
			if(!this.capturePageStarted) {
				this.capturePageStarted = true;
			}
			this.changePage('CapturePage');
		}
	  }
	
	goToItemsPage(pageCtrl?) {
		if(pageCtrl) {
			this.changePage('ItemsPage', pageCtrl);
		} else {
			this.changePage('ItemsPage', 'thoughts');
		}
		this.pageTitle = "Items";
		if(this.userProfile.subscription == 'thoughtsFeature' && !this.userProfile.subscriptionPaid) {
			this.switchItems({detail: { value: 'projects'}});
		}
	}

	switchItems(event) {
		if(this.userProfile.subscription == 'thoughtsFeature' && !this.userProfile.subscriptionPaid && event.detail.value == 'thoughts') {
			this.presentAlert("unpaidFeatureSubscription");
		} else {
			this.pageCtrl = event.detail.value;
		}
	}

	showThought(thought, type) {
		this.presentPopover('showThought', [thought, type]);
	}

	showSuggestion(suggestion: Suggestion) {
		this.presentPopover('showInteraction', [suggestion.content, ["Follow suggestion", "Reject suggestion"], 'Suggestion', 'suggestion', suggestion]);
	}

  	goToProcessPage() {
		if(this.userProfile.subscription == 'thoughtsFeature' && !this.userProfile.subscriptionPaid) {
			this.presentAlert("unpaidFeatureSubscription");
		} else {
			this.pageTitle = "Thoughts";
			this.changePage('ProcessPage');
		}
  	}

  	stopFollowUp() {
  		this.defineFollowUpTodoLater();
  	}

  	assignDeadline() {
  		let modal = this.modalCtrl.create({
			component: ChangeWeekModalPage
		}).then (modal => {
			modal.present();
			modal.onDidDismiss().then(data => {
				if(data.data) {
					this.captureDeadline = data.data;
					this.captureDeadlineText = new Date (this.captureDeadline).toLocaleDateString(this.translate.currentLang, this.formatOptions);
				}
			});
		});
  	}

  	setSchedule() {
  		if(new Date(this.captureScheduleISOString) != new Date()) {
  			this.captureSchedule = new Date(this.captureScheduleISOString);
  		} else {
  			this.captureSchedule = undefined;
  		}
  	}
	  
	addToDo(todo: Action, capture: Capture = {} as Capture) {
		if(this.userProfile.subscription == 'limitedFeatures' && !this.userProfile.subscriptionPaid && this.actionArray.length >= 10) {
			this.presentAlert("unpaidLimitedFeaturesSubscription");
		} else {
			let attributes = todo.content.split('#');
			todo.content = attributes.shift();
			for(let iter= 0; iter < attributes.length; iter++) {
				while(/\s$/.test(attributes[iter])) {
					attributes[iter] = attributes[iter].slice(0,-1);
				}
			}
			todo.attributes = [...attributes];
			while(attributes.length > 0) {
				let checkAttribute: Attribute = {
					userid: this.auth.userid,
					active: true,
					createDate: new Date().toISOString(),
					content: attributes.pop()
				}
				let newAttribute: boolean = true;
				for(let attribute of this.attributeArray) {
					if(attribute.content == checkAttribute.content) {
						newAttribute = false;
					}
				}
				if(newAttribute) {
					this.db.addAttribute(checkAttribute, this.auth.userid);
				}
			}
			todo.userid = this.auth.userid;
			todo.active = true;
			todo.taken = false;
			if(!todo.goalid) {
				todo.goalid = 'unassigned';
			}
			if(!todo.time) {
				todo.time = 0;
			}
			if(!todo.priority) {
				todo.priority = 1;
			}
			if(todo.deadline) {
				let eventData: CalendarEvent = {
					userid: this.auth.userid,
					goalid: todo.goalid,
					startTime: new Date(todo.deadline).toISOString(),
					endTime: new Date (new Date(todo.deadline).getTime() + 3600*1000).toISOString(),
					title: 'Deadline: ' + todo.content,
					allDay: true,
					active: true,
					color: "#EDF2FF"
				};
				if(this.goalDict[todo.goalid].color) {
					eventData.color = this.goalDict[todo.goalid].color;
				}
				if(this.platform.is('cordova')) {
					this.nativeCalendar.hasReadWritePermission().then( hasReadWritePermission => {
						if(hasReadWritePermission) {
							this.nativeCalendar.addEvent(eventData.title, eventData.eventLocation, eventData.startTime, eventData.endTime).then( event_id => {
								eventData.event_id = event_id;
								this.db.addCalendarEvent(eventData, this.auth.userid).then( event => {
									todo.deadlineid = event.key;
									this.db.addAction(todo, capture, this.auth.userid).then( actionAddedkey => {
										this.db.getActionFromActionid(actionAddedkey.key, this.auth.userid).snapshotChanges().pipe(take(1)).subscribe( actionAdded => {
											this.db.getCalendarEventFromCalendarEventId(event.key, this.auth.userid).valueChanges().subscribe( calendarEvent => {
												calendarEvent.key = event.key;
												calendarEvent.actionid = actionAddedkey.key;
												this.db.editCalendarEvent(calendarEvent, this.auth.userid);
											});
										});
									});
								});
							});
						} else {
							this.db.addCalendarEvent(eventData, this.auth.userid).then( event => {
								todo.deadlineid = event.key;
								this.db.addAction(todo, capture, this.auth.userid).then( actionAddedkey => {
									this.db.getActionFromActionid(actionAddedkey.key, this.auth.userid).snapshotChanges().pipe(take(1)).subscribe( actionAdded => {
										this.db.getCalendarEventFromCalendarEventId(event.key, this.auth.userid).valueChanges().subscribe( calendarEvent => {
											calendarEvent.key = event.key;
											calendarEvent.actionid = actionAddedkey.key;
											this.db.editCalendarEvent(calendarEvent, this.auth.userid);
										});
									});
								});
							});
						}
					});
				} else {
					this.db.addCalendarEvent(eventData, this.auth.userid).then( event => {
						todo.deadlineid = event.key;
						this.db.addAction(todo, capture, this.auth.userid).then( actionAddedkey => {
							this.db.getActionFromActionid(actionAddedkey.key, this.auth.userid).snapshotChanges().pipe(take(1)).subscribe( actionAdded => {
								this.db.getCalendarEventFromCalendarEventId(event.key, this.auth.userid).valueChanges().subscribe( calendarEvent => {
									calendarEvent.key = event.key;
									calendarEvent.actionid = actionAddedkey.key;
									this.db.editCalendarEvent(calendarEvent, this.auth.userid);
								});
							});
						});
					});
				}
			} else {
				this.db.addAction(todo, capture, this.auth.userid);
			}
			this.translate.get(["Todo saved"]).subscribe( translation => {
				this.presentToast(translation["Todo saved"]);
			});
			/*
			if(this.captureSchedule) {
				let eventData: CalendarEvent = {
					userid: this.auth.userid,
					allDay: false,
					active: true,
					startTime: this.captureSchedule.toISOString(),
					endTime: new Date(this.captureSchedule.getTime() + this.captureDuration*60*1000).toISOString(),
					title: this.captureContent,
					goalid: ''
				}
				if(this.captureProject.key == 'unassigned') {
					eventData.color = "#EDF2FF";
					eventData.goalid = '';
				} else {
					eventData.color = this.captureProject.color;
					eventData.goalid = this.captureProject.key;
					let dates = [new Date(eventData.startTime)];
					let minute = 0;
					let hourUpdated = new Date(eventData.startTime).getHours();
					while(new Date(new Date(eventData.startTime).getTime() + minute*60*1000).getTime() <= new Date(eventData.endTime).getTime()) {
						if(new Date(new Date(eventData.startTime).getTime() + minute*60*1000).getHours() != hourUpdated) {
							dates.push(new Date(new Date(eventData.startTime).getTime() + minute*60*1000));
							hourUpdated++;
						}
						minute++;
					}
					this.db.learnLearnedSchedule(this.auth.userid, [eventData.goalid], dates, 1);
				}
				if(this.platform.is('cordova')) {
					this.nativeCalendar.hasReadWritePermission().then( hasReadWritePermission => {
						if(hasReadWritePermission) {
							this.nativeCalendar.addEvent(eventData.title, eventData.eventLocation, eventData.startTime, eventData.endTime).then( event_id => {
								eventData.event_id = event_id;
								this.db.addCalendarEvent(eventData, this.auth.userid).then( event => {
									eventData.key = event.key;
								});
							});
						} else {
							this.db.addCalendarEvent(eventData, this.auth.userid).then( event => {
								eventData.key = event.key;
							});
						}
					});
				} else {
					this.db.addCalendarEvent(eventData, this.auth.userid).then( event => {
						eventData.key = event.key;
					});
				}
			}
			*/
		}
  	}

  	addActionFromCapture() {
		if(this.userProfile.subscription == 'limitedFeatures' && !this.userProfile.subscriptionPaid && this.actionArray.length >= 10) {
			this.presentAlert("unpaidLimitedFeaturesSubscription");
		} else {
			let captureContentParts = this.captureContent.split('#');
			for(let iter= 0; iter < captureContentParts.length; iter++) {
				if(/\s$/.test(captureContentParts[iter])) {
					captureContentParts[iter] = captureContentParts[iter].slice(0,-1);
				}
			}
			let action: Action = {
				userid: this.auth.userid,
				goalid: this.captureProject.key,
				content: captureContentParts.shift(),
				attributes: captureContentParts,
				priority: this.capturePriority,
				time: this.captureDuration,
				taken: false,
				active: true
			};
			let captureAttributes = [...captureContentParts];
			while(captureAttributes.length > 0) {
				let checkAttribute: Attribute = {
					userid: this.auth.userid,
					active: true,
					createDate: new Date().toISOString(),
					content: captureAttributes.pop()
				}
				let saveAttribute: boolean = true;
				for(let attribute of this.attributeArray) {
					if(attribute.content == checkAttribute.content) {
						saveAttribute = false;
					}
				}
				if(saveAttribute) {
					this.db.addAttribute(checkAttribute, this.auth.userid);
				}
			}
			if(this.captureDeadline) {
				action.deadline = this.captureDeadline.toISOString();
				let deadlineStartTime = new Date (action.deadline).setHours(2);
				let deadlineEndTime = new Date (action.deadline).setHours(5);
				if(!this.captureProject.color) {
					this.captureProject.color = "#EDF2FF";
				}
				let eventData: CalendarEvent = {
					userid: this.auth.userid,
					goalid: action.goalid,
					startTime: new Date(deadlineStartTime).toISOString(),
					endTime: new Date (deadlineEndTime).toISOString(),
					title: 'Deadline: ' + action.content,
					allDay: true,
					active: true,
					color: this.captureProject.color
				};
				if(this.platform.is('cordova')) {
					this.nativeCalendar.hasReadWritePermission().then( hasReadWritePermission => {
						if(hasReadWritePermission) {
							this.nativeCalendar.addEvent(eventData.title, eventData.eventLocation, eventData.startTime, eventData.endTime).then( event_id => {
								eventData.event_id = event_id;
								this.db.addCalendarEvent(eventData, this.auth.userid).then( event => {
									action.deadlineid = event.key;
									this.db.addAction(action, this.capture, this.auth.userid).then( actionAddedkey => {
										this.db.getActionFromActionid(actionAddedkey.key, this.auth.userid).snapshotChanges().pipe(take(1)).subscribe( actionAdded => {
											this.db.getCalendarEventFromCalendarEventId(event.key, this.auth.userid).valueChanges().subscribe( calendarEvent => {
												calendarEvent.key = event.key;
												calendarEvent.actionid = actionAddedkey.key;
												this.db.editCalendarEvent(calendarEvent, this.auth.userid);
											});
										});
									});
								});
							});
						} else {
							this.db.addCalendarEvent(eventData, this.auth.userid).then( event => {
								action.deadlineid = event.key;
								this.db.addAction(action, this.capture, this.auth.userid).then( actionAddedkey => {
									this.db.getActionFromActionid(actionAddedkey.key, this.auth.userid).snapshotChanges().pipe(take(1)).subscribe( actionAdded => {
										this.db.getCalendarEventFromCalendarEventId(event.key, this.auth.userid).valueChanges().subscribe( calendarEvent => {
											calendarEvent.key = event.key;
											calendarEvent.actionid = actionAddedkey.key;
											this.db.editCalendarEvent(calendarEvent, this.auth.userid);
										});
									});
								});
							});
						}
					});
				} else {
					this.db.addCalendarEvent(eventData, this.auth.userid).then( event => {
						action.deadlineid = event.key;
						this.db.addAction(action, this.capture, this.auth.userid).then( actionAddedkey => {
							this.db.getActionFromActionid(actionAddedkey.key, this.auth.userid).snapshotChanges().pipe(take(1)).subscribe( actionAdded => {
								this.db.getCalendarEventFromCalendarEventId(event.key, this.auth.userid).valueChanges().subscribe( calendarEvent => {
									calendarEvent.key = event.key;
									calendarEvent.actionid = actionAddedkey.key;
									this.db.editCalendarEvent(calendarEvent, this.auth.userid);
								});
							});
						});
					});
				}
			} else {
				this.db.addAction(action, this.capture, this.auth.userid);
			}
			this.translate.get(["Todo saved"]).subscribe( translation => {
				this.presentToast(translation["Todo saved"]);
			});
			if(this.captureSchedule) {
				let eventData: CalendarEvent = {
					userid: this.auth.userid,
					allDay: false,
					active: true,
					startTime: this.captureSchedule.toISOString(),
					endTime: new Date(this.captureSchedule.getTime() + this.captureDuration*60*1000).toISOString(),
					title: this.captureContent,
					goalid: ''
				}
				if(this.captureProject.key == 'unassigned') {
					eventData.color = "#EDF2FF";
					eventData.goalid = '';
				} else {
					eventData.color = this.captureProject.color;
					eventData.goalid = this.captureProject.key;
					let dates = [new Date(eventData.startTime)];
					let minute = 0;
					let hourUpdated = new Date(eventData.startTime).getHours();
					while(new Date(new Date(eventData.startTime).getTime() + minute*60*1000).getTime() <= new Date(eventData.endTime).getTime()) {
						if(new Date(new Date(eventData.startTime).getTime() + minute*60*1000).getHours() != hourUpdated) {
							dates.push(new Date(new Date(eventData.startTime).getTime() + minute*60*1000));
							hourUpdated++;
						}
						minute++;
					}
					this.db.learnLearnedSchedule(this.auth.userid, [eventData.goalid], dates, 1);
				}
				if(this.platform.is('cordova')) {
					this.nativeCalendar.hasReadWritePermission().then( hasReadWritePermission => {
						if(hasReadWritePermission) {
							this.nativeCalendar.addEvent(eventData.title, eventData.eventLocation, eventData.startTime, eventData.endTime).then( event_id => {
								eventData.event_id = event_id;
								this.db.addCalendarEvent(eventData, this.auth.userid).then( event => {
									eventData.key = event.key;
								});
							});
						} else {
							this.db.addCalendarEvent(eventData, this.auth.userid).then( event => {
								eventData.key = event.key;
							});
						}
					});
				} else {
					this.db.addCalendarEvent(eventData, this.auth.userid).then( event => {
						eventData.key = event.key;
					});
				}
			}
		}
  	}

  	addNoteFromCapture(capture: Capture, goalid: string) {
  		let reference: Reference = {
  			content: capture.content,
  			userid: this.auth.userid,
  			goalid: goalid,
  			active: true
  		};
		this.translate.get(["Thought saved"]).subscribe( translation => {
			this.presentToast(translation["Thought saved"]);
	  	});
		this.db.addReference(reference, capture, this.auth.userid);
  	}

  	addGoal(project: Goal) {
		for(let goal of this.goalArray) {
			if (goal.name == project.name) {
				this.translate.get(["You already have a goal with that name.", "OK"]).subscribe( alertMessage => {
					this.alertCtrl.create({
						message: alertMessage["You already have a goal with that name."],
						buttons: [
									{
										text: alertMessage["OK"]
									}
								]
					}).then( alert => {
						alert.present();
					});
				});
			return;
			}
		}
		if(project.name !== '' && project.name !== null && project.name !== undefined) {
			project.userid = this.auth.userid;
			project.active = true;
			if(!project.color) {
				project.color = "#FFFFFF";
			}
			this.db.addGoal(project, this.auth.userid);
			this.errorMsg = "";
		} else {
			this.errorMsg = "You cannot create a goal without a name.";
		}
	}

	addAction(goal, capture) {
		this.modalCtrl.create({ 
			component: DefineActionModalPage,
			componentProps: {capture: capture, goal: goal.name}
		}).then( modal => {
			modal.present();
			modal.onDidDismiss().then( data => {
				this.backButton.subscribe(()=>{ navigator['app'].exitApp(); });
				if(data.data != 'cancel' && data.data.content) {
					let action: Action = data.data;
					action.userid = this.auth.userid;
					action.taken = false;
					action.goalid = goal.key;
					action.active = true;
					if(!action.priority) {
						action.priority = 0
					}
					if(!action.time) {
						action.time = 0
					}
					if(!capture) {
						capture = {} as Capture;
					}
					if(action.deadline) {
						let deadlineStartTime = new Date (action.deadline).setHours(2);
						let deadlineEndTime = new Date (action.deadline).setHours(5);
						let eventData: CalendarEvent = {
							userid: this.auth.userid,
							goalid: goal.key,
							startTime: new Date(deadlineStartTime).toISOString(),
							endTime: new Date (deadlineEndTime).toISOString(),
							title: 'Deadline: ' + action.content,
							allDay: true,
							active: true,
							color: goal.color
						}
						if(this.platform.is('cordova')) {
							this.nativeCalendar.hasReadWritePermission().then( hasReadWritePermission => {
								if(hasReadWritePermission) {
									this.nativeCalendar.addEvent(eventData.title, eventData.eventLocation, eventData.startTime, eventData.endTime).then( event_id => {
										eventData.event_id = event_id;
										this.db.addCalendarEvent(eventData, this.auth.userid).then( event => {
							            	action.deadlineid = event.key;
							            	this.db.addAction(action, capture, this.auth.userid).then( actionAddedkey => {
							            		this.db.getActionFromActionid(actionAddedkey.key, this.auth.userid).snapshotChanges().pipe(take(1)).subscribe( actionAdded => {
							            			this.db.getCalendarEventFromCalendarEventId(event.key, this.auth.userid).valueChanges().subscribe( calendarEvent => {
							            				calendarEvent.key = event.key;
							            				calendarEvent.actionid = actionAddedkey.key;
							            				this.db.editCalendarEvent(calendarEvent, this.auth.userid);
							            			});
							            		});
							            	});
							            });
									});
								} else {
									this.db.addCalendarEvent(eventData, this.auth.userid).then( event => {
						            	action.deadlineid = event.key;
						            	this.db.addAction(action, capture, this.auth.userid).then( actionAddedkey => {
						            		this.db.getActionFromActionid(actionAddedkey.key, this.auth.userid).snapshotChanges().pipe(take(1)).subscribe( actionAdded => {
						            			this.db.getCalendarEventFromCalendarEventId(event.key, this.auth.userid).valueChanges().subscribe( calendarEvent => {
						            				calendarEvent.key = event.key;
						            				calendarEvent.actionid = actionAddedkey.key;
						            				this.db.editCalendarEvent(calendarEvent, this.auth.userid);
						            			});
						            		});
						            	});
						            });
								}
							});
						} else {
							this.db.addCalendarEvent(eventData, this.auth.userid).then( event => {
				            	action.deadlineid = event.key;
				            	this.db.addAction(action, capture, this.auth.userid).then( actionAddedkey => {
				            		this.db.getActionFromActionid(actionAddedkey.key, this.auth.userid).snapshotChanges().pipe(take(1)).subscribe( actionAdded => {
				            			this.db.getCalendarEventFromCalendarEventId(event.key, this.auth.userid).valueChanges().subscribe( calendarEvent => {
				            				calendarEvent.key = event.key;
				            				calendarEvent.actionid = actionAddedkey.key;
				            				this.db.editCalendarEvent(calendarEvent, this.auth.userid);
				            			});
				            		});
				            	});
				            });
						}
			        } else {
						this.db.addAction(action, capture, this.auth.userid);
					}
				}
			});
		});
	}

	addDelegation(goal, capture) {
		this.modalCtrl.create({
			component: DefineDelegationModalPage,
			componentProps: {capture: capture, goal: goal.name}
		}).then( modal => {
			modal.present();
			modal.onDidDismiss().then(data => {
				if(data.data != 'cancel' && data.data.content) {
					let delegation: Delegation = data.data;
					delegation.userid = this.auth.userid;
					delegation.goalid = goal.key;
					delegation.active = true;
					if(!capture) {
						capture = {} as Capture;
					}
					if(delegation.deadline) {
						let deadlineStartTime = new Date (delegation.deadline).setHours(2);
						let deadlineEndTime = new Date (delegation.deadline).setHours(5);
						let eventData: CalendarEvent = {
							userid: this.auth.userid,
							goalid: goal.key,
							startTime: new Date(deadlineStartTime).toISOString(),
							endTime: new Date (deadlineEndTime).toISOString(),
							title: 'Deadline Delegation: ' + delegation.content,
							allDay: true,
							active: true,
							color: goal.color
						}
						if(this.platform.is('cordova')) {
							this.nativeCalendar.hasReadWritePermission().then( hasReadWritePermission => {
								if(hasReadWritePermission) {
									this.nativeCalendar.addEvent(eventData.title, eventData.eventLocation, eventData.startTime, eventData.endTime).then( event_id => {
										eventData.event_id = event_id;
										this.db.addCalendarEvent(eventData, this.auth.userid).then( event => {
							            	delegation.deadlineid = event.key;
							            	this.db.addDelegation(delegation, capture, this.auth.userid).then( delegationAddedkey => {
							            		this.db.getDelegationFromDelegationid(delegationAddedkey.key, this.auth.userid).snapshotChanges().pipe(take(1)).subscribe( delegationAdded => {
							            			this.db.getCalendarEventFromCalendarEventId(event.key, this.auth.userid).valueChanges().subscribe( calendarEvent => {
							            				calendarEvent.key = event.key;
							            				calendarEvent.delegationid = delegationAddedkey.key;
							            				this.db.editCalendarEvent(calendarEvent, this.auth.userid);
							            			});
							            		});
							            	});
							            });
							        });
								} else {
									this.db.addCalendarEvent(eventData, this.auth.userid).then( event => {
						            	delegation.deadlineid = event.key;
						            	this.db.addDelegation(delegation, capture, this.auth.userid).then( delegationAddedkey => {
						            		this.db.getDelegationFromDelegationid(delegationAddedkey.key, this.auth.userid).snapshotChanges().pipe(take(1)).subscribe( delegationAdded => {
						            			this.db.getCalendarEventFromCalendarEventId(event.key, this.auth.userid).valueChanges().subscribe( calendarEvent => {
						            				calendarEvent.key = event.key;
						            				calendarEvent.delegationid = delegationAddedkey.key;
						            				this.db.editCalendarEvent(calendarEvent, this.auth.userid);
						            			});
						            		});
						            	});
						            });
								}
							});
						} else {
							this.db.addCalendarEvent(eventData, this.auth.userid).then( event => {
				            	delegation.deadlineid = event.key;
				            	this.db.addDelegation(delegation, capture, this.auth.userid).then( delegationAddedkey => {
				            		this.db.getDelegationFromDelegationid(delegationAddedkey.key, this.auth.userid).snapshotChanges().pipe(take(1)).subscribe( delegationAdded => {
				            			this.db.getCalendarEventFromCalendarEventId(event.key, this.auth.userid).valueChanges().subscribe( calendarEvent => {
				            				calendarEvent.key = event.key;
				            				calendarEvent.delegationid = delegationAddedkey.key;
				            				this.db.editCalendarEvent(calendarEvent, this.auth.userid);
				            			});
				            		});
				            	});
				            });
						}
					} else {
						this.db.addDelegation(delegation, capture, this.auth.userid);
					}
				}
			});
		});
	}

	addReference(goal, capture) {
	    let modal = this.modalCtrl.create({
	    	component: DefineReferenceModalPage,
	    	componentProps: {capture: capture, goal: goal.name}
	    }).then( modal => {
	    	modal.present();
			modal.onDidDismiss().then(data => {
				if(data.data != 'cancel' && data.data.content) {
					let reference: Reference = data.data;
					reference.userid = this.auth.userid;
					reference.goalid = goal.key;
					reference.active = true;
					if(!capture) {
						capture = {} as Capture;
					}
					this.db.addReference(reference, capture, this.auth.userid);
				}
			});
	    });
	}

	finishToDo(todo?: Action) {
		this.presentPopover('finishToDo', todo);
	}

	defineFollowUpTodoLater(todo?: Action) {
		this.translate.get("Action finished").subscribe( translation => {
			let capture = {} as Capture;
			let stringInit = '';
			if(todo) {
				if(todo.goalid != 'unassigned') {
					stringInit = this.goalDict[todo.goalid].name + ': ';
					capture.content =  stringInit + translation + ': ' + todo.content;
				} else {
					capture.content =  translation + ': ' + todo.content;
				}
			} else {
				if(todo.goalid != 'unassigned') {
					stringInit = this.goalDict[this.startedAction.goalid].name + ': ';
					capture.content =  stringInit + translation + ': ' + this.startedAction.content;
				} else {
					capture.content =  translation + ': ' + todo.content;
				}
			}
			capture.userid = this.auth.userid;
			capture.active = true;
			if(todo) {
				this.db.deleteAction(todo, this.auth.userid).then( () => {
					this.db.addCapture(capture, this.auth.userid);
					this.goToToDoPage();
				});
			} else {
				this.db.deleteAction(this.startedAction, this.auth.userid).then( () => {
					this.db.addCapture(capture, this.auth.userid);
					this.startedAction = {} as Action;
					this.goToToDoPage();
				});
			}
		});
		this.translate.get(["One less, congrats!"]).subscribe( translation => {
			this.presentToast(translation["One less, congrats!"]);
		});
	}

	defineFollowUpTodoNow(todo?: Action) {
		if(todo) {
			this.db.deleteAction(todo, this.auth.userid).then( () => {
				this.goToToDoPage();
			});
		} else {
			this.db.deleteAction(this.startedAction, this.auth.userid).then( () => {
				this.startedAction = {} as Action;
				this.goToToDoPage();
			});
		}
		this.presentPopover('addToDo');
		this.translate.get(["One less, congrats!"]).subscribe( translation => {
    		this.presentToast(translation["One less, congrats!"]);
    	});
	}

	noFollowUpTodoRequired(todo?: Action) {
		if(todo) {
			this.db.deleteAction(todo, this.auth.userid).then( () => {
				this.goToToDoPage();
			});
		} else {
			this.db.deleteAction(this.startedAction, this.auth.userid).then( () => {
				this.startedAction = {} as Action;
				this.goToToDoPage();
			});
		}
		this.translate.get(["One less, congrats!"]).subscribe( translation => {
    		this.presentToast(translation["One less, congrats!"]);
    	});
	}

	// ProjectsPage functions
	goToProjectsPage() {
		this.pageTitle = "Overview";
		this.goal = {name: ''} as Goal;
	    this.changePage('ProjectsPage');
  	}
	
	goToProjectOverviewPage(goal: Goal) {
		if(goal.key != 'unassigned') {
			this.pageTitle = goal.name;
			this.changePage("ProjectOverviewPage");
			this.goal = goal;
		}
	}

  	reviewAction(action: Action) {
		this.modalCtrl.create({
			component: ActionDetailsModalPage,
			componentProps: {action: action}
		}).then( modal => {
			modal.present();
			modal.onDidDismiss().then( data => {
				if(data.data == 'start') {
					this.startAction(action);
				}
			});
		});
  	}

	reviewDelegation(delegation: Delegation) {
		this.modalCtrl.create({
			component: DelegationDetailsModalPage,
			componentProps: {delegation: delegation}
		}).then( modal => {
			modal.present();
			modal.onDidDismiss();
		});
	}

  	reviewReference(reference: Reference) {
		this.modalCtrl.create({
			component: ReferenceDetailsModalPage,
			componentProps: {reference: reference}
		}).then( modal => {
			modal.present();
			modal.onDidDismiss();
		});
  	}

  	editGoal(goal: Goal) {
  		this.presentPopover('editProject', goal);
  	}

  	deleteAction(action: Action) {
		this.db.deleteAction(action, this.auth.userid);
		if(this.doableActionArray.findIndex(element => element.key == action.key) != -1) {
			this.doableActionArray.splice(this.doableActionArray.findIndex(element => element.key == action.key),1);
		}
  	}

  	deleteDelegation(delegation: Delegation, goal) {
    	this.db.deleteDelegation(delegation, this.auth.userid);
  	}

  	deleteReference(reference: Reference) {
    	this.db.deleteReference(reference, this.auth.userid);
  	}

  	deleteGoal(goal: Goal) {
  		this.translate.get(["Are you sure you want to delete this goal?", "No", "Delete"]).subscribe( alertMessage => {
	  		this.alertCtrl.create({
				message: alertMessage["Are you sure you want to delete this goal?"],
				buttons: [
					    	{
						        text: alertMessage["No"]
					      	},
					      	{
						        text: alertMessage["Delete"],
						        handler: () => {
						        	this.translate.get(["Project deleted"]).subscribe( translation => {
								      this.presentToast(translation["Project deleted"]);
								    });
						          	this.db.deleteGoal(goal, this.auth.userid).then( () => this.goToItemsPage('projects'));
						        }
					      	}
					    ]
			}).then( alert => {
				alert.present();
			});
		});
  	}

  	// CalendarPage functions
  	goToCalendarPage() {
  		this.calendar.currentDate = new Date();
  		this.eventSource = [];
        for(let calendarEvent of this.calendarEvents) {
        	if(calendarEvent.active != false) {
	        	this.eventSource.push(calendarEvent);
	        }
        };
        let events = this.eventSource;
		this.eventSource = [];
		setTimeout(() => {
			this.eventSource = events;
		});
		this.pageTitle = "Calendar";
		this.changePage('CalendarPage');
	}
  	
  	addEvent(){
	    if(!this.selectedDay) {
  			this.selectedDay = new Date();
	    }
		let modal = this.modalCtrl.create({
			component: CalendarEventModalPage,
			componentProps: {selectedDay: this.selectedDay}
		}).then( modal => {
			modal.present();
			modal.onDidDismiss().then(data => {
				if(data.data) {
					let eventData: CalendarEvent = data.data;
					eventData.userid = this.auth.userid;
					eventData.allDay = false;
					eventData.active = true;
					if(!data.data.goalid) {
						eventData.color = "#EDF2FF";
						eventData.goalid = '';
					} else {
					    let goal = this.goalArray.find(goal => goal.key == data.data.goalid);
					    if(goal) {
					    	eventData.color = goal.color;
						} else {
							eventData.color = "#EDF2FF";
						}
						let dates = [new Date(eventData.startTime)];
						let minute = 0;
						let hourUpdated = new Date(eventData.startTime).getHours();
						while(new Date(new Date(eventData.startTime).getTime() + minute*60*1000).getTime() <= new Date(eventData.endTime).getTime()) {
							if(new Date(new Date(eventData.startTime).getTime() + minute*60*1000).getHours() != hourUpdated) {
								dates.push(new Date(new Date(eventData.startTime).getTime() + minute*60*1000));
								hourUpdated++;
							}
							minute++;
						}
						this.db.learnLearnedSchedule(this.auth.userid, [eventData.goalid], dates, 1);
					}
					if(this.platform.is('cordova')) {
						this.nativeCalendar.hasReadWritePermission().then( hasReadWritePermission => {
							if(hasReadWritePermission) {
								this.nativeCalendar.addEvent(eventData.title, eventData.eventLocation, eventData.startTime, eventData.endTime).then( event_id => {
									eventData.event_id = event_id;
									this.db.addCalendarEvent(eventData, this.auth.userid).then( event => {
										eventData.key = event.key;
									});
									this.translate.get(["Event saved"]).subscribe( translation => {
								  		this.presentToast(translation["Event saved"]);
									});
									eventData.startTime = new Date(eventData.startTime);
							        eventData.endTime = new Date(eventData.endTime);
									let events = this.eventSource;
									events.push(eventData);
									this.eventSource = [];
									setTimeout(() => {
										this.eventSource = events;
									});
								});
							} else {
								this.db.addCalendarEvent(eventData, this.auth.userid).then( event => {
									eventData.key = event.key;
								});
								this.translate.get(["Event saved"]).subscribe( translation => {
							  		this.presentToast(translation["Event saved"]);
								});
								eventData.startTime = new Date(eventData.startTime);
						        eventData.endTime = new Date(eventData.endTime);
								let events = this.eventSource;
								events.push(eventData);
								this.eventSource = [];
								setTimeout(() => {
									this.eventSource = events;
								});
							}
						});
					} else {
						this.db.addCalendarEvent(eventData, this.auth.userid).then( event => {
							eventData.key = event.key;
						});
						this.translate.get(["Event saved"]).subscribe( translation => {
					  		this.presentToast(translation["Event saved"]);
						});
						eventData.startTime = new Date(eventData.startTime);
				        eventData.endTime = new Date(eventData.endTime);
						let events = this.eventSource;
						events.push(eventData);
						this.eventSource = [];
						setTimeout(() => {
							this.eventSource = events;
						});
					}
				}
			});
		});
	}

	addCalendarEvent(calendarEvent: CalendarEvent){
		if(!calendarEvent.userid) {
			calendarEvent.userid = this.auth.userid;
		}
		if(!calendarEvent.allDay) {
			calendarEvent.allDay = false;
		}
		if(!calendarEvent.active) {
			calendarEvent.active = true;
		}
		if(!calendarEvent.goalid) {
			calendarEvent.color = "#EDF2FF";
			calendarEvent.goalid = '';
		} else {
			let goal = this.goalArray.find(goal => goal.key == calendarEvent.goalid);
			if(goal && goal.key != 'unassigned') {
				calendarEvent.color = goal.color;
			} else {
				calendarEvent.color = "#EDF2FF";
			}
			let dates = [new Date(calendarEvent.startTime)];
			let minute = 0;
			let hourUpdated = new Date(calendarEvent.startTime).getHours();
			while(new Date(new Date(calendarEvent.startTime).getTime() + minute*60*1000).getTime() <= new Date(calendarEvent.endTime).getTime()) {
				if(new Date(new Date(calendarEvent.startTime).getTime() + minute*60*1000).getHours() != hourUpdated) {
					dates.push(new Date(new Date(calendarEvent.startTime).getTime() + minute*60*1000));
					hourUpdated++;
				}
				minute++;
			}
			this.db.learnLearnedSchedule(this.auth.userid, [calendarEvent.goalid], dates, 1);
		}
		if(this.platform.is('cordova')) {
			this.nativeCalendar.hasReadWritePermission().then( hasReadWritePermission => {
				if(hasReadWritePermission) {
					this.nativeCalendar.addEvent(calendarEvent.title, calendarEvent.eventLocation, calendarEvent.startTime, calendarEvent.endTime).then( event_id => {
						calendarEvent.event_id = event_id;
						this.db.addCalendarEvent(calendarEvent, this.auth.userid).then( event => {
							calendarEvent.key = event.key;
						});
						this.calendarEventSaved(calendarEvent);
					});
				} else {
					this.db.addCalendarEvent(calendarEvent, this.auth.userid).then( event => {
						calendarEvent.key = event.key;
					});
					this.calendarEventSaved(calendarEvent);
				}
			});
		} else {
			this.db.addCalendarEvent(calendarEvent, this.auth.userid).then( event => {
				calendarEvent.key = event.key;
			});
			this.calendarEventSaved(calendarEvent);
		}
	}

	calendarEventSaved(calendarEvent: CalendarEvent) {
		this.translate.get(["Event saved"]).subscribe( translation => {
			this.presentToast(translation["Event saved"]);
		});
		calendarEvent.startTime = new Date(calendarEvent.startTime);
		calendarEvent.endTime = new Date(calendarEvent.endTime);
		let events = this.eventSource;
		events.push(calendarEvent);
		this.eventSource = [];
		setTimeout(() => {
			this.eventSource = events;
		});
	}

	editCalendarEvent(calendarEvent) {
		if(!calendarEvent.goalid) {
			calendarEvent.color = "#EDF2FF";
			calendarEvent.goalid = '';
		} else {
			let goal = this.goalArray.find(goal => goal.key == calendarEvent.goalid);
			if(goal && goal.key != 'unassigned') {
				calendarEvent.color = goal.color;
			} else {
				calendarEvent.color = "#EDF2FF";
			}
		}
		if(calendarEvent.startTime.toISOString) {
			calendarEvent.startTime = calendarEvent.startTime.toISOString();
		}
		if(calendarEvent.endTime.toISOString) {
			calendarEvent.endTime = calendarEvent.endTime.toISOString();
		}
		let calendarEventkey = calendarEvent.key;
		this.db.editCalendarEvent(calendarEvent, this.auth.userid);
		calendarEvent.key = calendarEventkey;
		if(calendarEvent.actionid) {
			this.db.getActionFromActionid(calendarEvent.actionid, this.auth.userid).valueChanges().pipe(take(1)).subscribe( action => {
				action.key = calendarEvent.actionid;
				action.deadline = calendarEvent.startTime.toISOString();
				this.db.editAction(action, this.auth.userid);
			})
		}
		calendarEvent.startTime = new Date(calendarEvent.startTime);
		calendarEvent.endTime = new Date(calendarEvent.endTime);
		let events = this.eventSource;
		let index = events.indexOf(calendarEvent);
		events[index] = calendarEvent;
		let calendarEventsIndex = this.calendarEvents.indexOf(calendarEvent);
		this.calendarEvents[calendarEventsIndex] = calendarEvent;
		this.eventSource = [];
		setTimeout(() => {
			this.eventSource = events;
		});
	}

	deleteCalendarEvent(event: CalendarEvent) {
		this.translate.get(["Event deleted"]).subscribe( translation => {
			this.presentToast(translation["Event deleted"]);
		});
		this.db.deleteCalendarEvent(event.key, this.auth.userid);
		if(event.event_id && this.platform.is('cordova')) {
			this.nativeCalendar.hasReadWritePermission().then( hasReadWritePermission => {
				if(hasReadWritePermission) {
					this.nativeCalendar.deleteEvent(event.event_id);
				}
			});
		}
		let events = this.eventSource;
		let index = events.indexOf(event);
		events.splice(index,1);
		let calendarEventsIndex = this.calendarEvents.indexOf(event);
		this.calendarEvents.splice(calendarEventsIndex,1);
		this.eventSource = [];
		setTimeout(() => {
			this.eventSource = events;
		});
	}

	onEventSelected(event, origin?: string){
		this.presentPopover('showCalendarEvent', event);
	}

	onTimeSelected(event) {
		this.selectedDay = event.selectedTime;
		if(this.calendar.mode == 'day' || this.calendar.mode == 'week') {
			if(event.events == undefined || event.events.length == 0) {
				this.presentPopover('addCalendarEvent', event.selectedTime);
			}
		}
	}

	changeCalendarMode(event) {
		let calendarMode = event.detail.value;
		if(calendarMode == 'month') {
			this.selectedDay = this.calendar.currentDate;
		} else if(calendarMode == 'day') {
			this.calendar.currentDate = this.selectedDay;
		}
		this.calendar.mode = calendarMode;
	}

	onViewTitleChanged(title) {
		this.viewTitle = title;
	}

	changeWeek(direction: number) {
		let nextWeek = new Date(this.calendar.currentDate);
		nextWeek.setDate(this.calendar.currentDate.getDate() +  direction * 7);
		this.calendar.currentDate = nextWeek;
	}

	changeMonth(direction: number) {
		let nextMonth = new Date(this.calendar.currentDate);
		nextMonth.setDate(this.calendar.currentDate.getDate() +  direction * 31);
		this.calendar.currentDate = nextMonth;
	}

	changeDay(direction: number) {
		let nextDay = new Date(this.calendar.currentDate);
		nextDay.setDate(this.calendar.currentDate.getDate() +  direction);
		this.calendar.currentDate = nextDay;
	}

	changeDateToday() {
		this.calendar.currentDate = new Date();
	}

	changeDate(direction: number) {
		if(this.calendar.mode == 'day') {
			this.changeDay(direction);
		} else if(this.calendar.mode == 'week') {
			this.changeWeek(direction);
		} else if(this.calendar.mode == 'month') {
			this.changeMonth(direction);
		}
	}

	goToInitPage() {
		this.changePage('InitPage');
	}

  	// ToDoPage functions
	goToToDoPage(todoid?: string) {
		this.skippedAllToDos = false;
		this.db.getUserProfile(this.auth.userid).valueChanges().pipe(take(1)).subscribe( userProfile => {
			this.userProfile = userProfile;
			if(this.userProfile.tutorial) {
				this.db.finishTutorial(this.auth.userid);
				let text = "I am your personal digital assistant. I will get to know you and learn from you to actively help you organize your day and manage your tasks.";						   
				let buttons = ['Next'];
				let title = "Welcome to Gossik!";
				this.presentPopover('showInteraction', [text, buttons, title, 0]);
			}
			this.duration = 0;
			if(this.startedAction.key) {
				this.pageTitle = "Focus";
				this.elapsedTime = Math.floor((new Date().getTime() - new Date(this.startedAction.startDate).getTime()) / 60000);
				setTimeout( () => {
					this.changePage('ActionPage');
				}, 1000);
			} else {
				this.pageTitle = "Do";
				this.doableActionArray = [];
				this.chosenGoalArray = [];
				let targetTodo = undefined;
				if(this.actionArray) {
					for(let action of this.actionArray) {
						if(action.active != false) {
							if(!action.taken) {
								this.doableActionArray.push(action);
								if(todoid && action.key == todoid) {
									this.todoview = 'task';
									targetTodo = action;
								}
							}
						}
					}
					this.doableActionArray.sort((a, b) => (a.priority/1 < b.priority/1) ? 1 : -1);
					if(todoid) {
						this.doableActionArray.unshift(targetTodo);
					}
					this.changePage('ToDoPage');
					if(this.timeAvailable) {
						setTimeout(() => {
							this.timeAvailable.setFocus();
						}, 400);
					}
				} else {
					this.goToToDoPage();
				}
			}
		});
	}

	changeTodo(todoview) {
		this.todoview = todoview;
	}

	showToDo(todo) {
		this.presentPopover('showToDo', todo);
	}

	askStartTodo(todo) {
		this.translate.get(["Do you want to start with this action?", "Start", "No"]).subscribe( alertMessage => {
			this.alertCtrl.create({
					message: alertMessage["Do you want to start with this action?"],
					buttons: [
						      	{
							        text: alertMessage['Start'],
							        handler: () => {
							        	this.startAction(todo);
							        }
						      	},
						      	{
							        text: alertMessage['No']
						      	}
						    ]
			}).then ( alert => {
				alert.present();
			});
		});
	}

	filterToDos() {
		if(this.userProfile.subscription == 'filterAndDurationFeature' && !this.userProfile.subscriptionPaid) {
			this.presentAlert("unpaidFeatureSubscription");
		} else {
			this.presentPopover('filterToDos');
		}
	  }
	  
	dateFormated(date) {
		return new Date(date).toLocaleDateString();
	}

  	chooseGoal(event) {
		// This function is deprecated, only the desktop version still uses it, therefore I don't delete it.
		/*  
		if(event.detail.value.length == 0) {
  			this.chosenGoalArray = [];
  		}
		  this.showDoableActions();
		*/
	  }
	  
	setAvailableTime() {
		this.openPicker('ToDoPageDuration');
	}

  	openPicker(pickerName) {
		if(pickerName == 'ToDoPageDuration' && this.userProfile.subscription == 'filterAndDurationFeature' && !this.userProfile.subscriptionPaid) {
			this.presentAlert("unpaidFeatureSubscription");
		} else {
			this.translate.get(["Done", "Cancel"]).subscribe( translation => {
				let columnNames = [];
				let columnOptions = [[]];
				let selectedIndices = [0]
				if(pickerName == 'ToDoPageDuration' || pickerName == 'ProcessCapturePageDuration') {
					columnNames = ['duration'];
					for(let i = 0; i <= 80; i++) {
						columnOptions[0].push(5*i);
					}
					if(this.duration) {
						selectedIndices[0] = columnOptions[0].findIndex(option => option == this.duration);
					}
				}
				this.pickerCtrl.create({
					columns: this.getColumns(columnNames, columnOptions, selectedIndices),
					buttons: [
					{
						text: translation["Cancel"],
						role: 'cancel'
					},
					{
						text: translation["Done"],
						handler: (value) => {
							if(pickerName == 'ToDoPageDuration') {
								this.duration = value.duration.value;
								this.showDoableActions();
							}
						}
					}
					]
				}).then( picker => {
					picker.present();
				});	
			})
		}
    }

    getColumns(columnNames, columnOptions, selectedIndices) {
      let columns = [];
      for (let i = 0; i < columnNames.length; i++) {
        columns.push({
          name: columnNames[i],
          selectedIndex: selectedIndices[i],
          options: this.getColumnOptions(columnOptions[i])
        });
      }
      return columns;
    }

    getColumnOptions(columnOptions) {
      let options = [];
      for (let i of columnOptions) {
        options.push({
          text: i,
          value: i
        })
      }
      return options;
	}
	
	smartAssistant(event) {
		this.sortToDosByPriority();
		this.db.switchSmartAssistant(event.detail.checked, this.auth.userid);
	}

	sortToDosByPriority() {
		if(this.userProfile.smartAssistant) {
			this.doableActionArray.sort((a, b) => (this.computeDynamicPriority(a) < this.computeDynamicPriority(b)) ? 1 : -1);
		} else {
			this.doableActionArray.sort((a, b) => (a.priority < b.priority) ? 1 : -1);
		}
	}

  	showDoableActions() {
		this.skippedAllToDos = false;
		let duration: number = 100000;
		if(this.duration > 0) {
			duration = this.duration;
		}
		this.doableActionArray = [];
		for(let action of this.actionArray) {
			if(action.active != false) {
				let attributeCheck: boolean = true;
				if(this.chosenAttributeArray.length > 0) {
					if(action.attributes) {
						for(let filterAttribute of this.chosenAttributeArray) {
							if(action.attributes.indexOf(filterAttribute) == -1) {
								attributeCheck = false;
							}
						}
					} else {
						attributeCheck = false;
					}
				}
				if(!action.goalid) {
					action.goalid = "unassigned";
				}
				if(action.time/1 <= duration/1 && !action.taken && (this.chosenGoalArray.indexOf(action.goalid) != -1 || this.chosenGoalArray.length == 0 ) && attributeCheck) {
				this.doableActionArray.push(action);
				}
			}
		}
		this.sortToDosByPriority();
		if(this.doableActionArray.length == 0 && this.actionArray.length > 0) {
			this.translate.get(["There is no doable action for that time."]).subscribe( translation => {
				this.presentToast(translation["There is no doable action for that time."]);
			})
		}
	}

	computeDynamicPriority(action: Action): number {
		let priorityInfluenceDeadlie: number = 0;
		let daysUntilDeadline: number;
		if(action.deadline) {
			daysUntilDeadline = Math.round((new Date(action.deadline).getTime() - new Date().getTime())/(24*3600*1000));
			if(daysUntilDeadline < 5) {
				priorityInfluenceDeadlie = (5-daysUntilDeadline)*10;
			}
		}
		let priorityInfluenceProcastination: number = 0;
		let daysSinceCreated: number;
		if(action.createDate) {
			daysSinceCreated = Math.round((new Date().getTime() - new Date(action.createDate).getTime())/(24*3600*1000));
			priorityInfluenceProcastination = daysSinceCreated / 6;
		}
		let priorityInfluenceSchedule: number = 0;
		let learnedSchedule = JSON.parse(this.userProfile['learnedSchedule'].toString());
		let localeDate = new Date(new Date().getTime() - Number(this.userProfile.timezoneOffset*60*1000));
		let weekDay = localeDate.getDay() - 1;
		if(weekDay == -1) {
			weekDay = 6;
		}
		//getHours() gives locale hours already, so no need to use localeDate
		let hour = new Date().getHours();
		let learnedScheduleHour = weekDay * 24 + hour;
		let max: number = 0;
		let maxKey = undefined;
		let scoreDict:any = {};
		for(let projectid in learnedSchedule[learnedScheduleHour]) {
			if(learnedSchedule[learnedScheduleHour][projectid] > max) {
				max = learnedSchedule[learnedScheduleHour][projectid];
				maxKey = projectid;
			}
			if(learnedSchedule[learnedScheduleHour][projectid] > 0) {
				scoreDict[projectid] = learnedSchedule[learnedScheduleHour][projectid];
			}
		}
		if(max > 0 && scoreDict[action.goalid]) {
			priorityInfluenceSchedule = scoreDict[action.goalid] / max * 20;
		}
		let priorityInfluencePriority: number = 10 * action.priority;
		// compute influence factor based on focus
		let priorityInfluenceFocus: number = 0;
		for(let key in this.userProfile.focusProjects) {
			if(this.userProfile.focusProjects[key] == action.goalid) {
				priorityInfluenceFocus = 15;
			}
		}
		return priorityInfluenceDeadlie + priorityInfluencePriority + priorityInfluenceProcastination + priorityInfluenceSchedule + priorityInfluenceFocus;
	}

  	skipAction() {
  		this.doableActionArray.splice(0, 1);
  		if(this.doableActionArray.length == 0) {
  			this.skippedAllToDos = true;
  			this.translate.get(["You skipped all doable todos."]).subscribe( translation => {
		  		this.presentToast(translation["You skipped all doable todos."]);
			});
        } else {
  			this.skippedAllToDos = false;
        }
  	}

  	startAction(action) {
  		action.taken = true;
		action.startDate = new Date().toISOString();
  		this.startedAction = action;
		this.db.editAction(action, this.auth.userid);
		if(this.action.goalid != 'unassigned') {
			let dates = [new Date()];
			let minute = 0;
			let hourUpdated = new Date().getHours();
			while(minute <= action.time) {
				if(new Date(new Date().getTime() + minute*60*1000).getHours() != hourUpdated) {
					dates.push(new Date(new Date().getTime() + minute*60*1000));
					hourUpdated++;
				}
				minute++;
			}
			this.db.learnLearnedSchedule(this.auth.userid, [action.goalid], dates, 1);
		}
		this.pageTitle = "Focus";
		this.changePage('ActionPage');
		this.translate.get(["Todo started"]).subscribe( translation => {
	  		this.presentToast(translation["Todo started"]);
		});
  	}
	  
	stopToDo() {
		this.startedAction.taken = false;
		this.db.editAction(this.startedAction, this.auth.userid);
		this.goToToDoPage();
	}

  	takeThisAction(action: Action) {
  		this.translate.get(["Do you want to start with this action?", "Start", "No", "Great, have fun while taking Action! Visit the Captures to process this action when you finished it."]).subscribe( alertMessage => {
			this.alertCtrl.create({
					message: alertMessage["Do you want to start with this action?"],
					buttons: [
						      	{
							        text: alertMessage['Start'],
							        handler: () => {
							          	action.taken = true;
									    this.db.editAction(action, this.auth.userid);
									    this.doableActionArray.splice(this.doableActionArray.indexOf(action), 1);
							        }
						      	},
						      	{
							        text: alertMessage['No']
						      	}
						    ]
			}).then ( alert => {
				alert.present();
			});
		});
  	}
}