import { Component, ViewChild } from '@angular/core';
import { IonContent, Platform, ModalController, AlertController, IonInput, MenuController } from '@ionic/angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';

import { TranslateService } from '@ngx-translate/core';

import { AngularFireDatabase} from '@angular/fire/database';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { AuthenticationService } from '../services/authentication.service';
import { DatabaseService } from '../services/database.service';

import { Capture } from '../../model/capture/capture.model';
import { Goal } from '../../model/goal/goal.model';
import { User } from '../../model/user/user.model';
import { Action } from '../../model/action/action.model';
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

import * as moment from 'moment';

import { FirebaseX } from "@ionic-native/firebase-x/ngx";

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

	@ViewChild(IonContent, { read: IonContent, static: true }) content: IonContent;
	@ViewChild('TimeAvailable', {  static: false })  timeAvailable: IonInput;
	loginForm: FormGroup;
	loginError: string;
	forgotPasswordForm: FormGroup;
	signUpForm: FormGroup;
	signUpError: string;
  	viewpoint: string;
	captureList: Observable<Capture[]>;
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
	newGoal = {} as Goal;
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
  	newGoalForm: FormGroup;
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
		mode: 'week',
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
	projectColors: string[] = ['#F38787', '#F0D385', '#C784E4', '#B7ED7B', '#8793E8', '#87E8E5', '#B9BB86', '#EAA170']
 

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
		private firebase: FirebaseX
		) {
		this.isApp = !this.platform.is('desktop');
		if(this.isApp) {
			this.calendar.mode = 'day'
		} else {
			this.calendar.mode = 'week';
		}
	}

	ngOnInit() {
  		this.auth.afAuth.authState
			.subscribe(
				user => {
				  if (user) {
				  	if(this.isApp) {
					  	this.firebase.getToken().then(token => {
							this.db.saveDeviceToken(this.auth.userid, token);
						});
						this.firebase.onMessageReceived().subscribe(data => {
							this.alertCtrl.create({
								message: data.title + ' ' + data.body,
								buttons: [
									    	{
										        text: "Ok"
									      	}
									    ]
							}).then( alert => {
								alert.present();
							});
						});
					}
					this.db.changeLanguage(this.auth.userid, this.translate.currentLang);
				  	this.db.trackLogin(this.auth.userid);
				  	this.loggedin = true;
				  	this.router.events.subscribe(res => {
						if (res instanceof NavigationEnd) {
							let page = this.activatedRoute.snapshot.paramMap.get('page');
							if(page) {
								if(page == 'capture') {
									this.goToCapturePage();
								} else if(page == 'todo') {
									this.goToToDoPage();
								} else if(page == 'projects') {
									this.goToProjectsPage();
								} else if(page == 'calendar') {
									this.goToCalendarPage();
								} else if(page == 'settings') {
									this.goToSettingsPage();
								}
							} else {
								this.goToCapturePage();
							}
						} 
					});
				  	let page = this.activatedRoute.snapshot.paramMap.get('page');
					if(page) {
						if(page == 'capture') {
							this.goToCapturePage();
						} else if(page == 'todo') {
							this.goToToDoPage();
						} else if(page == 'projects') {
							this.goToProjectsPage();
						} else if(page == 'calendar') {
							this.goToCalendarPage();
						} else if(page == 'settings') {
							this.goToSettingsPage();
						}
					} else {
						this.goToCapturePage();
					}
				  } else {
				  	this.loggedin = false;
				    this.goToLoginPage();
				  }
				},
				() => {
				  this.goToLoginPage();
				}
			);
  	}

  	menuOpen() {
  		this.menuCtrl.toggle();
  	}

	changePage(viewpoint: string) {
  		this.content.scrollToTop();
  		this.errorMsg = '';
  		this.pageCtrl = '';
  		this.viewpoint = viewpoint;
  	}

  	// LoginPage functions
	goToLoginPage() {
		this.loginForm = this.fb.group({
			email: ['', Validators.compose([Validators.required, Validators.email])],
			password: ['', Validators.compose([Validators.required, Validators.minLength(6)])]
		});
		this.forgotPasswordForm = this.fb.group({
			email: ['', Validators.compose([Validators.required, Validators.email])]
		});
		this.signUpForm = this.fb.group({
			email: ['', Validators.compose([Validators.required, Validators.email])],
			password: ['', Validators.compose([Validators.required, Validators.minLength(6)])]
		});
		this.changePage('LoginPage');
	}

  	login() {
		let data = this.loginForm.value;
		if (!data.email) {
			return;
		}
		let credentials = {
			email: data.email,
			password: data.password
		};
		this.auth.signInWithEmail(credentials)
			.then(
				() => {
					console.log('login!!!!!');
						this.goToCapturePage();
				},
				error => this.loginError = error.message
			);
  	} 

  	goToSignUp(){
		this.pageCtrl = 'signUp';
	}

	signUp() {
		let data = this.signUpForm.value;
		let credentials = {
			email: data.email,
			password: data.password
		};
		this.auth.signUp(credentials).then(user =>  {
			console.log('done');
			//this.db.createUser(user.user.uid, user.user.email);
		}).then(
			() => this.pageCtrl = '',
			error => this.errorMsg = error.message
		);
  	}
	
	goToForgotPassword() {
		this.pageCtrl = 'forgotPassword';
	}

	resetPassword() {
		let email = this.forgotPasswordForm.value.email;
		if (!email) {
			return;
		}
		this.auth.sendPasswordResetEmail(email)
			.then(
				() => this.pageCtrl = ''
				);
	}

	goToSettingsPage() {
  		this.changePage('SettingsPage');
  	}

  	// SettingsPage functions
  	logout() {
    	this.auth.signOut().then( () => this.changePage('LoginPage'));
    }

	//HomePage functions
  	addCapture(capture: Capture) {
	    if(capture.content !== '' && capture.content !== null && capture.content !== undefined) {
	      this.errorMsg = "";
	      capture.userid = this.auth.userid;
	      capture.active = true;
	      this.db.addCapture(capture, this.auth.userid);
	      this.newCapture = {} as Capture;
	    } else {
	      this.errorMsg = "You cannot save an empty capture.";
	    }
  	}

  	deleteCapture(capture: Capture) {
  		if(this.viewpoint == 'CapturePage') {
  			this.db.deleteCapture(capture, this.auth.userid);
  		} else {
  			this.db.deleteCapture(capture, this.auth.userid).then( () => this.goToCapturePage())
  		}
  	}

  	goToCapturePage() {
  		this.captureList = this.db.getCaptureListFromUser(this.auth.userid)
		.snapshotChanges()
		.pipe(
			map(
				changes => { 
					return changes.map( c => {
						let capture: Capture = { 
							key: c.payload.key, userid: c.payload.val().userid, content: c.payload.val().content.replace(/\n/g, '<br>'), active: c.payload.val().active
							};
						return capture;
				});}));
		this.captureList.subscribe( captureArray => {
			this.captureArray = []
			for(let capture of captureArray) {
				if(capture.active != false){
					this.captureArray.push(capture);
				}
			}
			this.captureListNotEmpty = (this.captureArray.length > 0);
		});
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
		});
		this.changePage('CapturePage');
  	}

  	goToProcessCapturePage(capture: Capture) {
  		this.capture = capture;
  		this.goalList = this.db.getGoalList(this.auth.userid)
		.snapshotChanges()
		.pipe(
			map(
				changes => { 
					return changes.map( c => {
						let goal: Goal = { 
							key: c.payload.key, ...c.payload.val()
							};
						return goal;
				});}));
		this.goalList.subscribe( goalArray => {
			this.goalArray = [];
			for(let goal of goalArray) {
				if(goal.active != false) {
					this.goalArray.push(goal);
				}
			}
		})
	  	this.newGoalForm = this.fb.group({
  			newGoal: ['', Validators.required]
    	});
    	this.changePage('ProcessCapturePage');
  	}

  	goToProcessTakenActionPage(takenAction: Action) {
  		this.takenAction = takenAction;
  		this.changePage('ProcessTakenActionPage');
  	}

  	// ProcessCapturePage functions
  	addGoal(goalname) {
  		this.goalList.pipe(take(1)).subscribe(
	      goalArray => {
	      	goalArray = goalArray.filter(goal => goal.active != false);
	        if(goalname !== '' && goalname !== null && goalname !== undefined) {
				this.newGoal.userid = this.auth.userid;
				this.newGoal.name = goalname;
				this.newGoal.active = true;
				let numberGoals = goalArray.length;
				let colorFound = false;
				while(!colorFound) {
					for(let color of this.projectColors) {
						if(!goalArray.find(goal => goal.color == color)) {
							this.newGoal.color = color;
							colorFound = true;
						}
					}
					if(!colorFound) {
						this.newGoal.color = '#FFFFFF';
						colorFound = true;
					}
				}
				this.db.addGoal(this.newGoal, this.auth.userid);
				this.goalname = "";
				this.errorMsg = "";
			} else {
				this.errorMsg = "You cannot create a goal without a name.";
			}
	    });
	}

	addAction(goal, capture) {
		this.modalCtrl.create({ 
			component: DefineActionModalPage,
			componentProps: {capture: capture}
		}).then( modal => {
			modal.present();
			modal.onDidDismiss().then( data => {
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
			            this.db.addCalendarEvent(eventData, this.auth.userid).then( event => {
			            	action.deadlineid = event.key;
			            	this.db.addAction(action, capture, this.auth.userid);
			            });
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
			componentProps: {capture: capture}
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
						this.db.addCalendarEvent(eventData, this.auth.userid).then( event => {
			            	delegation.deadlineid = event.key;
			            	this.db.addDelegation(delegation, capture, this.auth.userid);
			            });
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
	    	componentProps: {capture: capture}
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

	// ProcessTakenActionPage function
	actionFinished() {
		this.nextActionList = this.db.getNextActionListFromGoal(this.takenAction.goalid, this.auth.userid)
		  	.snapshotChanges()
		  	.pipe(take(1),
				map(
					changes => { 
						return changes.map( c => {
							let action: Action = { 
								key: c.payload.key, ...c.payload.val()
								};
							return action;
			});}));
		this.nextActionList.subscribe( nextActionArray => {
			nextActionArray = nextActionArray.filter(action => action.active != false);
			if(nextActionArray.length == 1) {
				this.pageCtrl = 'actionFinished';
			} else {
				this.goalNotFinished();
			}
		});
	}

	abortAction() {
		this.takenAction.taken = false;
		this.db.editAction(this.takenAction, this.auth.userid);
		this.pageCtrl = 'actionAborted';
	}

	goalFinished() {
		this.db.getGoalFromGoalid(this.takenAction.goalid, this.auth.userid).valueChanges().subscribe( goal => {
			goal.key = this.takenAction.goalid;
			this.db.deleteGoal(goal, this.auth.userid).then( () => {
				this.pageCtrl = 'goalFinished';
			});
		});
	}

	goalNotFinished() {
	this.db.getGoalFromGoalid(this.takenAction.goalid, this.auth.userid).valueChanges().subscribe( data => {
		let capture = {} as Capture;
		capture.content = 'Action finished: ' + this.takenAction.content + '\n from goal: ' + data.name;
		capture.userid = this.auth.userid;
		capture.active = true
		this.db.deleteAction(this.takenAction, this.auth.userid).then( () => {
			this.db.addCapture(capture, this.auth.userid);
			this.goToCapturePage();
		});
	});
	}

	// ProjectsPage functions
	goToProjectsPage() {
  		this.goal.name = '';
	    this.goalList = this.db.getGoalList(this.auth.userid)
		.snapshotChanges()
		.pipe(
			map(
				changes => { 
					return changes.map( c => {
						let goal: Goal = { 
							key: c.payload.key, ...c.payload.val()
							};
						return goal;
			});}));
	    this.goalList.subscribe(
	      goalArray => {
  			this.goalArray = [];
	        for(let goal of goalArray) {
	        	if(goal.active != false) {
		        	this.goalArray.push(goal);
			    	this.actionList = this.db.getNextActionListFromGoal(goal.key, this.auth.userid)
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
				    this.actionList.subscribe( actionArray => {
				    	this.actions[goal.key] = [];
				    	for(let action of actionArray) {
				    		if(action.active != false) {
				      			this.actions[goal.key].push(action);
				      		}
				      	}
				    });
				}
			};
	    });
	    this.changePage('ProjectsPage');
  	}
	
	reviewGoal(goal: Goal) {
		this.content.scrollToTop();
		this.eventSource = [];
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
			});}));
		this.calendarEventList.subscribe(
	      	calendarEventArray => {
	      	this.eventSource = [];
	        for(let calendarEvent of calendarEventArray) {
	        	if(calendarEvent.active != false) {
		        	if(calendarEvent.goalid == goal.key) {
			        	calendarEvent.startTime = new Date(calendarEvent.startTime);
			        	calendarEvent.endTime = new Date(calendarEvent.endTime);
			        	this.eventSource.push(calendarEvent);
			        }
			    }
	        };
	        let events = this.eventSource;
			this.eventSource = [];
			setTimeout(() => {
				this.eventSource = events;
			});
		});
	    this.pageCtrl = 'ProjectOverview';
	    this.goal = goal;
	    this.referenceList = this.db.getReferenceListFromGoal(goal.key, this.auth.userid)
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
			for( let reference of referenceArray) {
				if(reference.active != false) {
					this.referenceArray.push(reference);
				}
			}
		});
	    this.nextActionList = this.db.getNextActionListFromGoal(goal.key, this.auth.userid)
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
		this.nextActionList.subscribe( actionArray => {
			this.actionArray = [];
			for( let action of actionArray) {
				if(action.active != false) {
					this.actionArray.push(action);
				}
			}
		});
	    this.delegationList = this.db.getDelegationListFromGoal(goal.key, this.auth.userid)
		  	.snapshotChanges()
		  	.pipe(
				map(
					changes => { 
						return changes.map( c => {
							let delegation: Delegation = { 
								key: c.payload.key, ...c.payload.val()
								};
							return delegation;
			});}));
		this.delegationList.subscribe( delegationArray => {
			this.delegationArray = [];
			for( let delegation of delegationArray) {
				if(delegation.active != false) {
					this.delegationArray.push(delegation);
				}
			}
		});
	}

  	reviewAction(action: Action) {
		this.modalCtrl.create({
			component: ActionDetailsModalPage,
			componentProps: {action: action}
		}).then( modal => {
			modal.present();
			modal.onDidDismiss();
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
  		let modal = this.modalCtrl.create({
  			component: GoalDetailsModalPage,
  			componentProps: {goal: goal}
  		}).then( modal => {
  			modal.present();
  			modal.onDidDismiss().then ( () => {
  				this.reviewGoal(this.goal);
  			})
  		});
  	}

  	deleteAction(action: Action, goal) {
    	this.db.deleteAction(action, this.auth.userid);
  	}

  	deleteDelegation(delegation: Delegation, goal) {
    	this.db.deleteDelegation(delegation, this.auth.userid);
  	}

  	deleteReference(reference: Reference, goal) {
    	this.db.deleteReference(reference, this.auth.userid);
  	}

  	deleteGoal(goal: Goal) {
  		console.log('goal.key');
  		console.log(goal);
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
					          	this.db.deleteGoal(goal, this.auth.userid).then( () => this.goToProjectsPage());
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
  		this.goalArray = [];
  		this.goalList = this.db.getGoalList(this.auth.userid)
		  	.snapshotChanges()
		  	.pipe(
				map(
					changes => { 
						return changes.map( c => {
							let goal: Goal = { 
								key: c.payload.key, ...c.payload.val()
								};
							return goal;
			});}));
	    this.goalList.subscribe(
	      goalArray => {
	        for(let goal of goalArray) {
	        	if(goal.active != false) {
	        		this.goalArray.push(goal);
	        	}
	        }
	    });
  		this.eventSource = [];
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
			});}));
		this.calendarEventList.subscribe(
	      	calendarEventArray => {
	      	this.eventSource = [];
	        for(let calendarEvent of calendarEventArray) {
	        	if(calendarEvent.active != false) {
		        	let goal = this.goalArray.find(goal => goal.key == calendarEvent.goalid);
		        	if(goal) {
				    	calendarEvent.color = goal.color;
					} else {
						calendarEvent.color = "#C0C0C0";
					}
					calendarEvent.startTime = new Date(calendarEvent.startTime);
		        	calendarEvent.endTime = new Date(calendarEvent.endTime);
		        	this.eventSource.push(calendarEvent);
		        }
	        };
	        let events = this.eventSource;
			this.eventSource = [];
			setTimeout(() => {
				this.eventSource = events;
			});
		});
		this.changePage('CalendarPage');
  	}
  	
  	addEvent(){
  		this.goalArray = [];
  		this.goalList = this.db.getGoalList(this.auth.userid)
		  	.snapshotChanges()
		  	.pipe(
				map(
					changes => { 
						return changes.map( c => {
							let goal: Goal = { 
								key: c.payload.key, ...c.payload.val()
								};
							return goal;
			});}));
	    this.goalList.subscribe(
	      goalArray => {
	        for(let goal of goalArray) {
	        	if(goal.active != false) {
	        		this.goalArray.push(goal);
	        	}
	        }
	    });
  		this.selectedDay = new Date();
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
						eventData.color = "#C0C0C0";
						eventData.goalid = '';
					} else {
					    let goal = this.goalArray.find(goal => goal.key == data.data.goalid);
					    if(goal) {
					    	eventData.color = goal.color;
						} else {
							eventData.color = "#C0C0C0";
						}
					}
					this.db.addCalendarEvent(eventData, this.auth.userid)
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
		});
	}

	onEventSelected(event){
		this.db.getGoalFromGoalid(event.goalid, this.auth.userid).valueChanges().subscribe( data => {
			let goal = '';
			let time = '';
			this.translate.get(["Goal", "Time", "Ok", "Delete"]).subscribe( alertMessage => {
				if(event.goalid) {
					goal = alertMessage["Goal"] + ': ' + data.name + '<br>';
				}
				if(!event.allDay) {
					let start = moment(event.startTime).format('HH:mm');
					let end = moment(event.endTime).format('HH:mm');
					time = alertMessage["Time"] + ': ' + start + ' - ' + end;
				}
			});
			this.alertCtrl.create({
					message: event.title + '<br>' + goal + time,
					buttons: [
						    	{
							        text: 'OK'
						      	},
						      	{
							        text: 'Delete',
							        handler: () => {
							          	this.db.deleteCalendarEvent(event.key, this.auth.userid)
							          	this.goToCalendarPage();
							        }
						      	}
						    ]
			}).then ( alert => {
				alert.present();
			});
		});
	}

	onViewTitleChanged(title) {
		this.viewTitle = title;
	}

	onTimeSelected(event) {
		this.goalArray = [];
  		this.goalList = this.db.getGoalList(this.auth.userid)
		  	.snapshotChanges()
		  	.pipe(
				map(
					changes => { 
						return changes.map( c => {
							let goal: Goal = { 
								key: c.payload.key, ...c.payload.val()
								};
							return goal;
			});}));
	    this.goalList.subscribe(
	      goalArray => {
	        for(let goal of goalArray) {
	        	if(goal.active != false) {
	        		this.goalArray.push(goal);
	        	}
	        }
	    });
		if(event.events == undefined || event.events.length == 0) {
			this.selectedDay = new Date(event.selectedTime);
			let modal = this.modalCtrl.create({
				component: CalendarEventModalPage,
				componentProps: {selectedDay: this.selectedDay}
			}).then (modal => {
				modal.present();
				modal.onDidDismiss().then(data => {
					if(data.data){
						let eventData: CalendarEvent = data.data;
						eventData.userid = this.auth.userid;
						eventData.allDay = false;
						eventData.active = true;
						if(!data.data.goalid) {
							eventData.color = "#C0C0C0";
							eventData.goalid = '';
						} else {
						    let goal = this.goalArray.find(goal => goal.key == data.data.goalid);
						    if(goal) {
						    	eventData.color = goal.color;
							} else {
								eventData.color = "#C0C0C0";
							}
						}
						this.db.addCalendarEvent(eventData, this.auth.userid)
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
			});
		}
	}

  	// ToDoPage functions
	goToToDoPage() {
		this.doableActionArray = [];
  		this.goalList = this.db.getGoalList(this.auth.userid)
		  	.snapshotChanges()
		  	.pipe(
				map(
					changes => { 
						return changes.map( c => {
							let goal: Goal = { 
								key: c.payload.key, ...c.payload.val()
								};
							return goal;
			});}));
		this.goalList.subscribe(
	      goalArray => {
  			this.goalArray = [];
	        for(let goal of goalArray) {
	        	if(goal.active != false) {
	        		this.goalDict[goal.key] = goal;
	        		this.goalArray.push(goal);
	        	}
	        }
	    })
  		this.giveTimeForm = this.fb.group({
      		timeEstimate: ['', Validators.required]
    	});
    	this.goal =  <Goal>{key: 'None'};;
    	this.changePage('ToDoPage');
    	setTimeout(() => {
	         this.timeAvailable.setFocus();
	    }, 400);
	}

  	chooseGoal(goalid) {
  		if(goalid != 'None') {
	  		this.db.getGoalFromGoalid(goalid, this.auth.userid).valueChanges().subscribe( goal => {
			this.goal = {key: goalid, name: goal.name, userid: goal.userid, color: goal.color};
			});
		} else {
			this.goal.key = 'None';
		}
  		this.showDoableActions();
  	}

  	showDoableActions() {
  		if(this.giveTimeForm.value.timeEstimate) {
		    this.actionList = this.db.getNextActionListFromUser(this.auth.userid)
			  	.snapshotChanges()
			  	.pipe(take(1),
					map(
						changes => { 
							return changes.map( c => {
								let action: Action = { 
									key: c.payload.key, ...c.payload.val()
									};
								return action;
				});}));
		    this.actionList.subscribe(
		      actionArray => {
		      	this.doableActionArray = [];
		        for(let action of actionArray) {
		        	if(action.active != false) {
		        		console.log(action.time);
		        		console.log(this.giveTimeForm.value.timeEstimate);
		        		console.log((action.time <= this.giveTimeForm.value.timeEstimate));
		        		console.log(action.time/1);
		        		console.log(this.giveTimeForm.value.timeEstimate/1);
		        		console.log((action.time/1 <= this.giveTimeForm.value.timeEstimate/1));
						if(action.time/1 <= this.giveTimeForm.value.timeEstimate/1 && !action.taken && ((action.goalid == this.goal.key) || this.goal.key == 'None')) {
						this.doableActionArray.push(action);
						}
					}
		        }
		        console.log(this.doableActionArray);
		        this.doableActionArray.sort((a, b) => (a.priority/1 < b.priority/1) ? 1 : -1)
		        console.log(this.doableActionArray);
		        if(this.doableActionArray.length == 0) {
		        	this.errorMsg = "There is no doable action for that time.";
		        } else {
		        	this.errorMsg = '';
		        }
		      }
		    );
		}
  	}

  	takeThisAction(action: Action) {
	    action.taken = true;
	    this.db.editAction(action, this.auth.userid);
	    this.doableActionArray.splice(this.doableActionArray.indexOf(action), 1);
	    this.viewpoint = '';
	    this.errorMsg = "Great, have fun while taking Action! Visit the Captures to process this action when you finished it.";
  	}
}