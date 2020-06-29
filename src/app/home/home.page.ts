import { Component, ViewChild } from '@angular/core';
import { IonContent, Platform, ModalController, AlertController, IonInput, MenuController, ToastController, IonDatetime, PickerController } from '@ionic/angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';

import { TranslateService } from '@ngx-translate/core';

import { AngularFireDatabase} from '@angular/fire/database';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { AuthenticationService } from '../services/authentication.service';
import { DatabaseService } from '../services/database.service';
import { NativeCalendarService } from '../services/native-calendar.service';

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
import { ChangeWeekModalPage } from '../change-week-modal/change-week-modal.page';
import { AssignProjectModalPage } from '../assign-project-modal/assign-project-modal.page';
import { ToDoFilterModalPage } from '../to-do-filter-modal/to-do-filter-modal.page';
import { FivetodosModalPage } from '../fivetodos-modal/fivetodos-modal.page';
import { TutorialProjectsModalPage } from '../tutorial-projects-modal/tutorial-projects-modal.page';


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
	goalKeyArray: string[];
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
	showCaptureDone: boolean = false;
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
	addingProject: boolean = false;
	formatOptions: any = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    deadlineFormatOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
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
		private firebase: FirebaseX,
		private nativeCalendar: NativeCalendarService,
		public toastCtrl: ToastController,
		public pickerCtrl: PickerController
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
	}

	initPushNotifications() {
		this.firebase.getToken().then(token => {
		this.db.saveDeviceToken(this.auth.userid, token);
		});
		this.firebase.onMessageReceived().subscribe(data => {
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
		});
	}

	changePageViaMenu() {
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
			this.goToToDoPage();
		}
	}

	updateTimezoneOffset() {
		let timezoneOffset = new Date().getTimezoneOffset();
		if (!this.userProfile.timezoneOffset || (this.userProfile.timezoneOffset && this.userProfile.timezoneOffset != timezoneOffset)) {
			this.db.updateTimezoneOffset(this.auth.userid, timezoneOffset);
		}
	}

	ngOnInit() {
  		this.auth.afAuth.authState
		.subscribe(
			user => {
			  if (user) {
				this.isAdmin = (this.auth.userid == 'R1CFRqnvsmdJtxIJZIvgF1Md0lr1' || this.auth.userid == 'PWM3MEhECQMxmYzOtXCJbH2Rx083');
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
				this.db.getUserProfile(this.auth.userid).valueChanges().subscribe( userProfile => {
					this.userProfile = userProfile;
					this.updateTimezoneOffset();
				});
				if(this.platform.is('cordova')) {
					this.nativeCalendar.hasReadWritePermission().then( hasReadWritePermission => {
						if(hasReadWritePermission) {
							this.nativeCalendar.updateDatabase();
						} else {
							this.nativeCalendar.requestReadWritePermission().then( hasReadWritePermission => {
								if(hasReadWritePermission) {
									this.nativeCalendar.updateDatabase();
								}
							});
						}
					});
				}
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
			},
			() => {
			  this.goToLoginPage();
			}
		);
  	}

  	menuOpen() {
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
  		this.translate.get([alertMessage, "OK"]).subscribe( translation => {
  			let buttons = [];
  			buttons = [
					      	{
						        text: translation["OK"]
					      	}
					    ];
  			if(alertMessage == 'fivetodosDone') {
  				buttons = [
					      	{
						        text: translation["OK"],
						        handler: () => {
						        	setTimeout(() => {
										this.presentAlert('tutorialTodoPageInit');
									}, 1000);
						        }
					      	}
					    ];
  			} else if(alertMessage == 'tutorialTodoPageInit') {
  				buttons = [
					      	{
						        text: translation["OK"],
						        handler: () => {
						        	setTimeout(() => {
										this.db.startTutorial(this.auth.userid, 'tutorialNextButton');
										this.showTutorial('tutorialNextButton');
									}, 1000);
						        }
					      	}
					    ];
  			}  else if(alertMessage == 'tutorialTodoPageTime') {
  				buttons = [
					      	{
						        text: translation["OK"],
						        handler: () => {
						        	this.db.finishTutorial(this.auth.userid, 'tutorialTodoPageTime', this.userProfile.tutorial.next);
						        }
					      	}
					    ];
  			}  else if(alertMessage == 'thoughtsAdd') {
  				buttons = [
					      	{
						        text: translation["OK"],
						        handler: () => {
						        	setTimeout(() => {
										this.presentAlert('thoughtsProcess');
									}, 1000);
						        }
					      	}
					    ];
  			}	else if(alertMessage == "tutorialProjectsDone") {
  				buttons = [
  					      	{
						        text: translation["OK"],
						        handler: () => {
						        	setTimeout(() => {
										this.presentAlert("tutorialEnd");
									}, 1000);
						        }
					      	}
					    ];
  			}	else if(alertMessage == "projectsAssign") {
  				buttons = [
  					      	{
						        text: translation["OK"],
						        handler: () => {
						        	this.tutorialAssignTodos();
						        }
					      	}
					    ];
  			}	else if(alertMessage == "tutorialEnd") {
  				buttons = [
  					      	{
						        text: translation["OK"],
						        handler: () => {
						        	setTimeout(() => {
										this.presentAlert("tutorialEndFeedback");
									}, 1000);
						        }
					      	}
					    ];
  			}
  			this.alertCtrl.create({
				message: translation[alertMessage],
				buttons: buttons
			}).then( alert => {
				alert.present();
			});
  		})
  	}

  	goToPrivacyPolicyPage() {
  		this.router.navigate(['privacy-policy'], { replaceUrl: true });
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
		this.db.login();
		this.auth.signInWithEmail(credentials)
			.then(
				() => {
						this.auth.afAuth.authState.subscribe( user => {
							this.goToToDoPage();
						});
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
			this.db.createUser(user.user.uid, user.user.email);
		}).then(
			() => {
				setTimeout(() => this.goToToDoPage());
			});
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
		this.pageTitle = "Settings";
  		this.changePage('SettingsPage');
  	}

  	// SettingsPage functions
  	logout() {
  		this.db.logout();
		this.auth.signOut();
		this.pageTitle = '';
		this.goToLoginPage();

    }

    goToFeedbackPage() {
    	this.pageTitle = "Feedback";
    	this.changePage('FeedbackPage');
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
		event.target.firstChild.placeholder = '';
		this.translate.get(["Input new capture"]).subscribe( translation => {
	  		if(this.newCapture.content == translation["Input new capture"]) {
	  			this.newCapture.content = '';
	  		}
		});
	}

	ionBlurCapture(event) {
		this.translate.get(["Input new capture"]).subscribe( translation => {
	  		if(!this.newCapture.content) {
	  			event.target.firstChild.placeholder = translation["Input new capture"];
	  		} else if(this.newCapture.content == '') {
	  			event.target.firstChild.placeholder = translation["Input new capture"];
	  		}
		});
	}

  	addCapture(capture: Capture) {
	    if(capture.content !== '' && capture.content !== null && capture.content !== undefined) {
			this.errorMsg = "";
			capture.userid = this.auth.userid;
			capture.active = true;
			this.db.addCapture(capture, this.auth.userid);
			this.newCapture = {} as Capture;
		  	this.newCapture.content = '';
			this.goToProcessPage();
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
  		this.translate.get(["Input new capture"]).subscribe( translation => {
	  		this.newCapture.content = translation["Input new capture"];
		});
		this.goToProcessPage();
  	}

  	deleteCapture(capture: Capture) {
  		if(this.viewpoint == 'CapturePage') {
  			this.db.deleteCapture(capture, this.auth.userid);
  		} else {
  			this.db.deleteCapture(capture, this.auth.userid).then( () => this.goToProcessPage())
  		}
  		this.translate.get(["Thought deleted"]).subscribe( translation => {
	  		this.presentToast(translation["Thought deleted"]);
		});
  	}

  	rushNextTutorial(nextTutorialPart) {
  		if(nextTutorialPart == 'thoughts') {
  			this.translate.get(["tutorialThoughtsPush", "OK"]).subscribe( translation => {
  				this.presentAlert(translation["tutorialThoughtsPush"]);
  				setTimeout( () => {
  					this.db.startTutorial(this.auth.userid, 'thoughts');
  				}, 3000);
  			});
  		} else if(nextTutorialPart == 'thoughtprocessing') {
			this.captureList = this.db.getCaptureListFromUser(this.auth.userid)
			.snapshotChanges()
			.pipe(take(1),
				map(
					changes => { 
						return changes.map( c => {
							let capture: Capture = { 
								key: c.payload.key, userid: c.payload.val().userid, createDate: c.payload.val().createDate, content: c.payload.val().content.replace(/\n/g, '<br>'), active: c.payload.val().active
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
				if(this.captureArray.length >= 1) {
					this.translate.get(["tutorialThoughtprocessingPush", "OK"]).subscribe( translation => {
		  				this.presentAlert(translation["tutorialThoughtprocessingPush"]);
		  				setTimeout( () => {
		  					this.db.startTutorial(this.auth.userid, 'thoughtprocessing');
		  				}, 3000);
		  			});
				} else {
					this.translate.get(["tutorialThoughtprocessingPushNoThoughts", "OK"]).subscribe( translation => {
		  				this.presentAlert(translation["tutorialThoughtprocessingPushNoThoughts"]);
		  			});
				}
			});  			
  		} else if(nextTutorialPart == 'projects') {
  			this.translate.get(["tutorialProjectsPush", "OK"]).subscribe( translation => {
  				this.presentAlert(translation["tutorialProjectsPush"]);
  				setTimeout( () => {
  					this.db.startTutorial(this.auth.userid, 'projects');
  				}, 3000);
  			});
  		}
  	}

  	showTutorial(tutorialPart) {
  		this.db.getUserProfile(this.auth.userid).valueChanges().pipe(take(1)).subscribe( userProfile => {
			this.userProfile = userProfile;
			if(this.userProfile.tutorial[tutorialPart]) {
				this.db.setTutorialStartdate(this.auth.userid, tutorialPart);
				let text = [];
				text["fivetodos"] = ["fivetodos", "OK"];
				text["thoughts"] = ["thoughts", "OK"];
				text["thoughtprocessing"] = ["thoughtprocessing", "Start", "Later"];
				text["process"] = ["process", "OK"];
				text["projects"] = ["projects", "OK"];
				text["calendar"] = ["calendar", "OK"];
				text["tutorialNextButton"] = ["tutorialNextButton", "OK"];
				this.translate.get(text[tutorialPart]).subscribe( translation => {
			  		let buttons = [];
			  		buttons["fivetodos"] = [
				      	{
					        text: translation["OK"],
				      	}
				    ];
				    buttons["tutorialNextButton"] = [
				      	{
					        text: translation["OK"],
					        handler: () => {
				    			this.db.finishTutorial(this.auth.userid, tutorialPart, 'thoughts');
				    		}
				      	}
				    ];
				    buttons["thoughts"] = [
				    	{
				    		text: translation["OK"],
				    		handler: () => {
				    			setTimeout(() => {
				    				this.presentAlert("thoughtsAdd");
								}, 1000);
				    			this.db.finishTutorial(this.auth.userid, tutorialPart, 'thoughtprocessing');
				    		}
				    	}
				    ];
				    buttons["thoughtprocessing"] = [
				      	{
					        text: translation["Start"],
					        handler: () => {
					        	this.db.finishTutorial(this.auth.userid, tutorialPart, 'process');
					        	this.db.startTutorial(this.auth.userid, 'process');
					        	setTimeout(() => {
					        		this.presentAlert("tutorialProcessInit");
								}, 1000);
					        }
				      	}, 
				      	{
				      		text: translation["Later"]
				      	}
				    ];
				    buttons["process"] = [
				    	{
				    		text: translation["OK"],
				    		handler: () => {
				    			setTimeout(() => {
				    				this.presentAlert("processInit");
								}, 1000);
				    		}
				    	}
				    ];
				    buttons["projects"] = [
				    	{
				    		text: translation["OK"],
				    		handler: () => {
				    			setTimeout(() => {
				    				this.presentAlert("projectsAssign");
								}, 1000);
				    		}
				    	}
				    ];
				    buttons["calendar"] = [
				    	{
				    		text: translation["OK"],
				    		handler: () => {
				    			setTimeout(() => {
				    				this.presentAlert("calendarEnd");
								}, 1000);
				    			this.db.finishTutorial(this.auth.userid, 'calendar', '');
				    		}
				    	}
				    ];
			  		this.alertCtrl.create({
						message: translation[tutorialPart],
						buttons: buttons[tutorialPart]
					}).then( alert => {
						alert.present();
					});
				});
			}
		});
  	}

  	startFivetodos() {
  		this.modalCtrl.create({ 
			component: FivetodosModalPage
		}).then( modal => {
			modal.present();
			modal.onDidDismiss().then( data => {
				if(data.data) {
					for(let actionContent of data.data) {
						let todo: Action = {
						    userid: this.auth.userid,
						    goalid: 'unassigned',
						    content: actionContent.content,
						    priority: 3,
						    time: 20,
						    taken: false,
						    active: true
						}
						this.db.addAction(todo, {} as Capture, this.auth.userid);
					}
					if(this.userProfile.tutorial.fivetodos) {
						this.presentAlert("fivetodosDone");
						this.db.finishTutorial(this.auth.userid, "fivetodos", "tutorialNextButton")
					}
					this.goToToDoPage();
				}
			});
		});
  	}

  	tutorialAssignTodos() {
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
				});
			})
		);
	    this.actionList.subscribe( actionArray => {
	      	this.actionArray = [];
	        for(let action of actionArray) {
	        	if(action.active != false) {
					if(!action.taken) {
					this.actionArray.push(action);
					}
				}
	        }
	        this.modalCtrl.create({ 
				component: TutorialProjectsModalPage,
				componentProps: {
					goalArray: this.goalArray,
					actionArray: this.actionArray,
					goalDict: this.goalDict,
					projectColors: this.projectColors
				}
			}).then( modal => {
				modal.present();
				modal.onDidDismiss().then( data => {
					if(data.data && data.data == 'assigned') {
						this.db.finishTutorial(this.auth.userid, 'projects', '');
						this.goToProjectsPage();
						this.presentAlert("tutorialProjectsDone");
					}
				});
			});
	    });
  	}

  	goToCapturePage() {
  		this.pageTitle = "Create new thought";
  		if(!this.capturePageStarted) {
	  		this.capturePageStarted = true;
	  	}
	  	this.captureList = this.db.getCaptureListFromUser(this.auth.userid)
		.snapshotChanges()
		.pipe(
			map(
				changes => { 
					return changes.map( c => {
						let capture: Capture = { 
							key: c.payload.key, userid: c.payload.val().userid, createDate: c.payload.val().createDate, content: c.payload.val().content.replace(/\n/g, '<br>'), active: c.payload.val().active
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

  	goToProcessPage() {
  		this.pageTitle = "Thoughts";
  		this.showTutorial('thoughts');
  		this.showTutorial('thoughtprocessing');
  		this.captureList = this.db.getCaptureListFromUser(this.auth.userid)
		.snapshotChanges()
		.pipe(
			map(
				changes => { 
					return changes.map( c => {
						let capture: Capture = { 
							key: c.payload.key, userid: c.payload.val().userid, createDate: c.payload.val().createDate, content: c.payload.val().content.replace(/\n/g, '<br>'), active: c.payload.val().active
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
		this.changePage('ProcessPage');
  	}

  	goToProcessCapturePage(capture: any, project?: Goal, type?: string, origin?: string) {
  		this.capture = capture;
  		this.captureContent = capture.content;
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
			goalArray.sort((a, b) => a.name.localeCompare(b.name));
			for(let goal of goalArray) {
				if(goal.active != false) {
					this.goalArray.push(goal);
				}
			}
		})
	  	this.newGoalForm = this.fb.group({
  			newGoal: ['', Validators.required]
    	});
    	this.duration = 0;
		this.capturePriority = undefined;
		this.captureDuration = undefined;
		this.captureDeadline = undefined;
		this.captureDeadlineText = undefined;
		this.showCaptureProject = false;
		this.showCaptureType = true;
		this.showCaptureDuration = false;
		this.showCapturePriority = false;
		this.showCaptureDeadline = false;
		this.showCaptureDone = false;
    	if(project != undefined) {
    		this.showCaptureProject = true;
    		this.captureProject = project;
    		this.showCaptureType = true;
    		this.showCaptureDuration = true
    		this.cameFromProjectOverviewPage = true;
    	} else {
    		this.captureProject = { key: 'unassigned'} as Goal;
    		this.cameFromProjectOverviewPage = false;
    	}
    	if(type != undefined) {
    		this.captureType = type;
    	} else {
  			this.captureType = 'action';
    	}
    	if(this.captureType == 'action') {
    		this.showCaptureDuration = true;
    	} else {
    		this.captureCheckIfDone();
    	}
    	if(this.userProfile.tutorial.process) {
    		this.captureType = 'action';
    		this.showCaptureType = true;
    		this.showCaptureDuration = true;
    	}
    	this.showTutorial('process');
    	this.cameFromProjectOverviewPage = (origin == 'ProjectOverviewPage');
    	this.cameFromFinishActionPage = (origin == 'FinishActionPage');
    	this.cameFromProcessPage = (origin == 'ProcessPage');
    	this.cameFromToDoPage = (origin == 'ToDoPage');
    	if(this.cameFromProjectOverviewPage && this.captureType == 'action') {
    		this.pageTitle = "Define action";
    		this.capturePlaceholder = "Define action";
    	} else if(this.cameFromProjectOverviewPage && this.captureType == 'note') {
    		this.pageTitle = "Define reference";
    		this.capturePlaceholder = "Define reference";
    	} else if(this.cameFromProcessPage){
    		this.pageTitle = "Process thought";
    		this.capturePlaceholder = "Define action or reference";
    	} else if (this.cameFromFinishActionPage) {
    		this.pageTitle = "Define action";
    		this.capturePlaceholder = "Define action";
    	} else if (this.cameFromToDoPage) {
    		this.pageTitle = "Define action";
    		this.capturePlaceholder = "Define action";
    	}
    	this.changePage('ProcessCapturePage');
  	}

  	goToProcessTakenActionPage(takenAction: Action) {
  		this.takenAction = takenAction;
  		this.changePage('ProcessTakenActionPage');
  	}

  	// ProcessCapturePage functions
  	assignProject() {
  		this.modalCtrl.create({ 
			component: AssignProjectModalPage,
			componentProps: {goalArray: this.goalArray, projectColors: this.projectColors}
		}).then( modal => {
			modal.present();
			modal.onDidDismiss().then( data => {
				if(data.data) {
					this.captureProject = data.data;
					this.captureCheckIfDone();
				}
			});
		});
  	}

  	assignType(type?: string) {
  		if(type) {
  			this.captureType = type;
  		}
  		if(this.captureType == 'action') {
  			this.assignAction();
  		} else if(this.captureType == 'note') {
  			this.assignNote();
  		}
  		if(this.captureType == 'action') {
    		this.pageTitle = "Define action";
    		this.capturePlaceholder = "Define action";
    	} else if(this.captureType == 'note') {
    		this.pageTitle = "Define reference";
    		this.capturePlaceholder = "Define reference";
    	} else if(this.cameFromProcessPage){
    		this.pageTitle = "Process thought";
    		this.capturePlaceholder = "Define action or reference";
    	}
  		this.captureCheckIfDone();
  	}

  	assignAction() {
  		if(this.captureContent) {
  			this.showCaptureDuration = true;
  		}
  		if(this.captureContent && this.captureDuration) {
  			this.showCapturePriority = true;
  		}
  		if(this.captureContent && this.capturePriority && this.captureDuration) {
  			this.showCaptureDeadline = true;
  			this.showCaptureProject = true;
  		} else {
  			this.showCaptureDeadline = false;
  			this.showCaptureProject = false;
  		}
  		this.captureCheckIfDone();
  	}

  	assignContent(event) {
  		console.log(event);
  		if(this.captureContent) {
  			if(this.captureType == 'action') {
		  		this.showCaptureDuration = true;
		  	}
  		} else {
  			this.translate.get(["Define action","Define reference", "Define action or reference"]).subscribe( translation => {
	  			if(this.captureType == 'action') {
	  				event.target.firstChild.placeholder = translation["Define action"] + "...";
	  			} else if(this.captureType == 'note') {
	  				event.target.firstChild.placeholder = translation["Define reference"] + "...";
	  			} else {
	  				event.target.firstChild.placeholder = translation["Define action or reference"] + "...";
	  			}
	  		});
  		}
  		this.captureCheckIfDone();
  	}

  	setCaptureContent(capture) {
  		this.captureContent = capture.content;
  		if(this.captureType == 'action') {
	  		this.showCaptureDuration = true;
	  	}
	  	this.captureCheckIfDone();
  	}

  	assignNote() {
  		this.showCaptureDuration = false;
  		this.showCapturePriority = false;
  		this.showCaptureDeadline = false;
  		this.showCaptureProject = true;
  		this.captureCheckIfDone();
  	}

  	timeSet() {
  		this.captureDuration = this.duration;
  		if(this.captureDuration > 0) {
  			if(this.userProfile.tutorial.process) {
  				this.presentAlert('processPriority');
  			}
			this.showCapturePriority = true;
	  		this.captureCheckIfDone();
  		}
  	}

  	assignPriority(priority?) {
  		if(priority) {
  			this.capturePriority = priority;
  		}
  		if(this.capturePriority) {
  			this.showCaptureDeadline = true;
  			this.showCaptureProject = true;
  		}
  		if(this.userProfile.tutorial.process) {
			this.presentAlert('processDone');
		}
  		this.captureCheckIfDone();
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
				this.captureCheckIfDone();
			});
		});
  	}

  	deleteDeadline() {
  		this.captureDeadline = undefined;
  		this.captureDeadlineText = undefined;
  		this.captureCheckIfDone();
  	}

  	captureCheckIfDone() {
  		if(this.captureType == 'action') {
  			if(this.captureContent && this.captureDuration && this.capturePriority) {
	  			this.showCaptureDone = true;
	  		} else {
	  			this.showCaptureDone = false
	  		}
  		} else if (this.captureType == 'note') {
  			if(this.captureContent && this.captureProject.key != 'unassigned') {
	  			this.showCaptureDone = true;
	  		} else {
	  			this.showCaptureDone = false
	  		}
  		}
  	}

  	processCapture() {
  		if(this.captureType == 'action') {
  			this.addActionFromCapture();
  			this.translate.get(["Todo saved"]).subscribe( translation => {
		  		this.presentToast(translation["Todo saved"]);
			});
  		} else if(this.captureType == 'note'){
  			this.addNoteFromCapture();
  			this.translate.get(["Thought saved"]).subscribe( translation => {
		  		this.presentToast(translation["Thought saved"]);
			});
  		}
  		if(this.cameFromProjectOverviewPage) {
  			this.reviewGoal(this.captureProject);
  		} else if (this.cameFromFinishActionPage || this.cameFromToDoPage) {
  			this.goToToDoPage();
  		} else {
  			this.goToProcessPage();
  		}
  		if(this.userProfile.tutorial.process) {
  			this.presentAlert("processEnd");
  			this.db.finishTutorial(this.auth.userid, 'process', 'projects');
  		}
  	}

  	addActionFromCapture() {
  		let action: Action = {
		    userid: this.auth.userid,
		    goalid: this.captureProject.key,
		    content: this.captureContent,
		    priority: this.capturePriority,
		    time: this.captureDuration,
		    taken: false,
		    active: true
  		}
  		if(this.captureDeadline) {
  			action.deadline = this.captureDeadline.toISOString();
			let deadlineStartTime = new Date (action.deadline).setHours(2);
			let deadlineEndTime = new Date (action.deadline).setHours(5);
			if(!this.captureProject.color) {
				this.captureProject.color = "#C0C0C0";
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
			}
			if(this.platform.is('cordova')) {
				console.log('is cordova!');
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
  	}

  	addNoteFromCapture() {
  		let reference: Reference = {
  			content: this.captureContent,
  			userid: this.auth.userid,
  			goalid: this.captureProject.key,
  			active: true
  		};
		this.db.addReference(reference, this.capture, this.auth.userid);
  	}

  	addGoal(goalname) {
  		this.goalList.pipe(take(1)).subscribe(
	      goalArray => {
	      	goalArray = goalArray.filter(goal => goal.active != false);
	      	for(let goal of goalArray) {
	      		if (goal.name == goalname) {
	      			this.translate.get(["You already have a goal with that name.", "Ok"]).subscribe( alertMessage => {
				  		this.alertCtrl.create({
							message: alertMessage["You already have a goal with that name."],
							buttons: [
								    	{
									        text: alertMessage["Ok"]
								      	}
								    ]
						}).then( alert => {
							alert.present();
						});
					});
				return;
	      		}
	      	}
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
			this.addingProject = false;
	    });
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
				this.finishAction();
			}
		});
	}

	abortAction() {
		this.takenAction.taken = false;
		this.db.editAction(this.takenAction, this.auth.userid);
		this.pageCtrl = 'actionAborted';
	}

	finishAction() {
		this.startedAction.endDate = new Date().toISOString();
		if(this.userProfile.tutorial.tutorialProgress < 2) {
			this.noFollowUpTodoRequired()
		} else {
			this.viewpoint = 'FinishActionPage';
		}
	}

	defineFollowUpTodoLater() {
		this.db.getGoalFromGoalid(this.startedAction.goalid, this.auth.userid).valueChanges().subscribe( data => {
			this.translate.get("Action finished").subscribe( translation => {
				let capture = {} as Capture;
				let stringInit = '';
				if(data) {
					stringInit = data.name + ': ';
				}
				capture.content =  stringInit + translation + ': ' + this.startedAction.content;
				capture.userid = this.auth.userid;
				capture.active = true;
				this.db.deleteAction(this.startedAction, this.auth.userid).then( () => {
					this.db.addCapture(capture, this.auth.userid);
					this.startedAction = {} as Action;
					this.goToToDoPage();
				});
			});
			this.translate.get(["One less, congrats!"]).subscribe( translation => {
        		this.presentToast(translation["One less, congrats!"]);
        	});
		});
	}

	defineFollowUpTodoNow() {
		if(this.startedAction.goalid != 'unassigned') {
			this.db.getGoalFromGoalid(this.startedAction.goalid, this.auth.userid).valueChanges().subscribe( data => {
				let capture = {} as Capture;
				data.key = this.startedAction.goalid;
				capture.content = this.startedAction.content;
				this.goToProcessCapturePage(capture, data, 'action', 'FinishActionPage');
			});
		} else {
			let capture = {} as Capture;
			capture.content = this.startedAction.content;
			this.goToProcessCapturePage(capture, { key: 'unassigned'} as Goal, 'action', 'FinishActionPage');	
		}
		this.db.deleteAction(this.startedAction, this.auth.userid).then( () => {
			this.startedAction = {} as Action;
		});
		this.translate.get(["One less, congrats!"]).subscribe( translation => {
    		this.presentToast(translation["One less, congrats!"]);
    	});
	}

	noFollowUpTodoRequired() {
		this.db.deleteAction(this.startedAction, this.auth.userid).then( () => {
			this.startedAction = {} as Action;
			this.goToToDoPage();
		});
		this.translate.get(["One less, congrats!"]).subscribe( translation => {
    		this.presentToast(translation["One less, congrats!"]);
    	});
	}

	// ProjectsPage functions
	goToProjectsPage() {
		this.pageTitle = "Overview";
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
  			goalArray.sort((a, b) => a.name.localeCompare(b.name));
  			goalArray.unshift({key: 'unassigned'} as Goal);
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
			}
	    });
	    this.changePage('ProjectsPage');
	    this.showTutorial('projects');
  	}

  	addProject() {
  		this.addingProject = true;
  	}
	
	reviewGoal(goal: Goal) {
		this.pageTitle = "Project overview";
		this.viewpoint = "ProjectsPage";
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
  		this.showTutorial('calendar');
  		this.calendar.currentDate = new Date();
  		this.goalArray = [];
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
							let data: CalendarEvent = { 
								key: c.payload.key, ...c.payload.val()
								};
							return data;
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
			this.pageTitle = "Calendar";
			this.changePage('CalendarPage');
		});
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
					if(this.platform.is('cordova')) {
						this.nativeCalendar.hasReadWritePermission().then( hasReadWritePermission => {
							if(hasReadWritePermission) {
								this.nativeCalendar.addEvent(eventData.title, eventData.eventLocation, eventData.startTime, eventData.endTime).then( event_id => {
									eventData.event_id = event_id;
									this.db.addCalendarEvent(eventData, this.auth.userid);
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
								this.db.addCalendarEvent(eventData, this.auth.userid);
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
						this.db.addCalendarEvent(eventData, this.auth.userid);
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

	editCalendarEvent(calendarEvent) {
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
		let modal = this.modalCtrl.create({
			component: CalendarEventModalPage,
			componentProps: {calendarEvent: calendarEvent}
		}).then( modal => {
			modal.present();
			modal.onDidDismiss().then(data => {
				if(data.data) {
					if(!data.data.goalid) {
						data.data.color = "#C0C0C0";
						data.data.goalid = '';
					} else {
					    let goal = this.goalArray.find(goal => goal.key == data.data.goalid);
					    if(goal) {
					    	data.data.color = goal.color;
						} else {
							data.data.color = "#C0C0C0";
						}
					}
					let calendarEventkey = data.data.key;
					this.db.editCalendarEvent(data.data, this.auth.userid)
					data.data.key = calendarEventkey;
					if(data.data.actionid) {
						this.db.getActionFromActionid(data.data.actionid, this.auth.userid).valueChanges().pipe(take(1)).subscribe( action => {
							action.key = data.data.actionid;
							action.deadline = data.data.startTime.toISOString();
							this.db.editAction(action, this.auth.userid);
						})
					}
					if(data.data.delegationid) {
						this.db.getDelegationFromDelegationid(data.data.delegationid, this.auth.userid).valueChanges().pipe(take(1)).subscribe( delegation => {
							delegation.key = data.data.delegationid;
							delegation.deadline = data.data.startTime.toISOString();
							this.db.editDelegation(delegation, this.auth.userid);
						})
					}
					data.data.startTime = new Date(data.data.startTime);
			        data.data.endTime = new Date(data.data.endTime);
					let events = this.eventSource;
					events.push(data.data);
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
			this.translate.get(["Goal", "Time", "Ok", "Delete", "Edit"]).subscribe( alertMessage => {
				if(event.goalid) {
					goal = alertMessage["Goal"] + ': ' + data.name + '<br>';
				}
				if(!event.allDay) {
					let start = moment(event.startTime).format('HH:mm');
					let end = moment(event.endTime).format('HH:mm');
					time = alertMessage["Time"] + ': ' + start + ' - ' + end;
				}
				this.alertCtrl.create({
						message: event.title + '<br>' + goal + time,
						buttons: [
							    	{
								        text: alertMessage['Ok']
							      	},
							      	{
								        text: alertMessage['Edit'],
								        handler: () => {
								          	this.editCalendarEvent(event);
								        }
							      	},
							      	{
								        text: alertMessage['Delete'],
								        handler: () => {
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
											this.eventSource = [];
											setTimeout(() => {
												this.eventSource = events;
											});
								        }
							      	}
							    ]
				}).then ( alert => {
					alert.present();
				});
			});
		});
	}

	onTimeSelected(event) {
		this.selectedDay = event.selectedTime;
		if(this.calendar.mode == 'day' || this.calendar.mode == 'week') {
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
							if(this.platform.is('cordova')) {
								this.nativeCalendar.hasReadWritePermission().then( hasReadWritePermission => {
									if(hasReadWritePermission) {
										this.nativeCalendar.addEvent(eventData.title, eventData.eventLocation, eventData.startTime, eventData.endTime).then( event_id => {
											eventData.event_id = event_id;
											this.db.addCalendarEvent(eventData, this.auth.userid)
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
							} else {
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
						}
					});
				});
			}
		}
	}

	changeCalendarMode(calendarMode) {
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

	changeDay(direction: number) {
		let nextDay = new Date(this.calendar.currentDate);
		nextDay.setDate(this.calendar.currentDate.getDate() +  direction);
		this.calendar.currentDate = nextDay;
	}

	changeDateToday() {
		this.calendar.currentDate = new Date();
	}

	changeDate() {
		let modal = this.modalCtrl.create({
				component: ChangeWeekModalPage
			}).then (modal => {
				modal.present();
				modal.onDidDismiss().then(data => {
					this.calendar.currentDate = data.data;
				});
			});
	}

	goToInitPage() {
		this.changePage('InitPage');
	}

  	// ToDoPage functions
	goToToDoPage() {
		this.db.getUserProfile(this.auth.userid).valueChanges().pipe(take(1)).subscribe( userProfile => {
			this.userProfile = userProfile;
			if(this.userProfile.tutorial.fivetodos) {
				this.showTutorial('fivetodos');
				this.goToInitPage();
			} else {
				if(this.userProfile.tutorial.tutorialProgress == 2 && this.userProfile.tutorial.tutorialTodoPageTime) {
					this.presentAlert("tutorialTodoPageTime");
				}
				this.duration = 0;
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
				this.goalList.pipe(take(1)).subscribe(
			      goalArray => {
		  			this.goalArray = [];
			        for(let goal of goalArray) {
			        	if(goal.active != false) {
			        		this.goalDict[goal.key] = goal;
			        		this.goalArray.push(goal);
			        	}
			        }
			    	this.takenActionList = this.db.getTakenActionListFromUser(this.auth.userid)
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
						if(this.startedAction.key) {
							this.pageTitle = "Let's get to work!";
							this.changePage('ActionPage');
						} else {
							this.pageTitle = "Do";
							this.doableActionArray = [];
							this.duration = 0;
							this.doableActionArray = [];
							this.goalKeyArray = [];
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
										if(!action.taken) {
										this.doableActionArray.push(action);
										}
									}
						        }
						        this.doableActionArray.sort((a, b) => (a.priority/1 < b.priority/1) ? 1 : -1);
						        this.changePage('ToDoPage');
						        if(this.timeAvailable) {
						    		setTimeout(() => {
							         this.timeAvailable.setFocus();
							    	}, 400);
						    	}
						      }
						    );
						}
					});
			    });
			}
		});
	}

	filterToDos() {
  		this.modalCtrl.create({ 
			component: ToDoFilterModalPage,
			componentProps: {goalArray: this.goalArray,
							goalKeyArray: this.goalKeyArray}
		}).then( modal => {
			modal.present();
			modal.onDidDismiss().then( data => {
				if(data.data) {
					this.goalKeyArray = data.data;
					this.showDoableActions();
				}
			});
		});
  	}

  	chooseGoal(event) {
  		if(event.detail.value.length == 0) {
  			this.goalKeyArray = [];
  		}
  		this.showDoableActions();
  	}

  	openPicker(pickerName) {
  		this.translate.get(["Done", "Cancel"]).subscribe( translation => {
    		let columnNames = [];
	  		let columnOptions = [[]];
	  		let selectedIndices = [0]
	  		if(pickerName == 'ToDoPageDuration' || pickerName == 'ProcessCapturePageDuration' || pickerName == 'StopActionPageDuration') {
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
		              	} else if(pickerName == 'ProcessCapturePageDuration') {
		              		this.duration = value.duration.value;
		              		this.timeSet();
		              	} else if(pickerName == 'StopActionPageDuration') {
		              		this.duration = value.duration.value;
		              		this.updateStartedActionTime();
		              	}
		            }
		          }
		        ]
		    }).then( picker => {
		    	picker.present();
		    });	
	    })
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

  	showDoableActions() {
  		this.skippedAllToDos = false;
  		if(this.duration > 0) {
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
						if(action.time/1 <= this.duration/1 && !action.taken && (this.goalKeyArray.indexOf(action.goalid) != -1 || this.goalKeyArray.length == 0 )) {
						this.doableActionArray.push(action);
						}
					}
		        }
		        this.doableActionArray.sort((a, b) => (a.priority/1 < b.priority/1) ? 1 : -1);
		        if(this.doableActionArray.length == 0) {
		        	this.translate.get(["There is no doable action for that time."]).subscribe( translation => {
		        		this.presentToast(translation["There is no doable action for that time."]);
		        	})
		        }
		      }
		    );
		} else if(this.duration == 0) {
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
						if(!action.taken && (this.goalKeyArray.indexOf(action.goalid) != -1 || this.goalKeyArray.length == 0 )) {
						this.doableActionArray.push(action);
						}
					}
		        }
		        this.doableActionArray.sort((a, b) => (a.priority/1 < b.priority/1) ? 1 : -1);
		        if(this.doableActionArray.length == 0) {
		        	this.translate.get(["There is no action for that filter."]).subscribe( translation => {
		        		this.presentToast(translation["There is no action for that filter."]);
		        	})
		        }
		      }
		    );
		}
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
		this.pageTitle = "Let's get to work!";
		this.changePage('ActionPage');
		this.translate.get(["Todo started"]).subscribe( translation => {
	  		this.presentToast(translation["Todo started"]);
		});
  	}

  	stopAction() {
  		if(this.userProfile.tutorial.tutorialProgress < 2) {
  			this.duration = this.startedAction.time;
  			this.updateStartedActionTime();
  		} else {
  			this.duration = this.startedAction.time;
  			this.changePage('StopActionPage');
  		}
  	}

  	updateStartedActionTime() {
  		this.startedAction.time = this.duration;
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