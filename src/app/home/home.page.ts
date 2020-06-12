import { Component, ViewChild } from '@angular/core';
import { IonContent, Platform, ModalController, AlertController, IonInput, MenuController, ToastController, IonDatetime } from '@ionic/angular';
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
	@ViewChild('processCapturePageDurationDatetime', { static: false }) processCapturePageDurationDatetime: IonDatetime;
	@ViewChild('toDoPageDurationDatetime', { static: false }) toDoPageDurationDatetime: IonDatetime;
	@ViewChild('stopActionPageDatetime', { static: false }) stopActionPageDatetime: IonDatetime;
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
	captureProject = {} as Goal;
	showCaptureProject: boolean = true;
	captureType: string;
	showCaptureType: boolean = false;
	captureDurationISOString: any;
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
	timeEstimateISOString: any;
	timeEstimate: number;
	startedAction = {} as Action;
	goalEmpty: boolean;
	startedActionTimeISOString: any;
	allDayLabel: any;
	pageTitle: string;
	cameFromProjectOverviewPage: boolean;
	cameFromGoalNotFinishedPage: boolean;
	calendarLoaded: boolean = false;
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
		public toastCtrl: ToastController
		) {
		this.isApp = !this.platform.is('desktop');
		console.log('for developing, this.isApp is set to true always because otherwhise, cannot test on desktop using --lab flag.');
		this.isApp = true;
		if(this.isApp) {
			this.calendar.mode = 'month'
		} else {
			this.calendar.mode = 'week';
		}
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

	openDatetime(datetime) {
		if(datetime == 'processCapturePageDurationDatetime') {
			this.processCapturePageDurationDatetime.open();
		} else if(datetime == 'toDoPageDurationDatetime') {
			this.toDoPageDurationDatetime.open();
		} else if(datetime == 'stopActionPageDatetime') {
			this.stopActionPageDatetime.open();
		}
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

	ngOnInit() {
  		this.auth.afAuth.authState
			.subscribe(
				user => {
				  if (user) {
					this.isAdmin = (this.auth.userid == 'R1CFRqnvsmdJtxIJZIvgF1Md0lr1' || this.auth.userid == 'PWM3MEhECQMxmYzOtXCJbH2Rx083');
					this.db.addTutorial(this.auth.userid);
				  	if(this.isApp) {
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
					this.nativeCalendar.updateDatabase();
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

  	showCals() {
  		this.cals = this.nativeCalendar.readCalendars();
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
	      duration: 5000
	    });
	    toast.present();
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
		this.auth.signInWithEmail(credentials)
			.then(
				() => {
						setTimeout(() => {
							this.goToCapturePage();
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
				setTimeout(() => this.goToCapturePage());
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
			this.translate.get(["Your thought has been saved and is ready to process"]).subscribe( translation => {
		  		this.presentToast(translation["Your thought has been saved and is ready to process"]);
			});
	      	//this.showTutorial('postitDone');
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

  	showTutorial(tutorialPart) {
  		let messages = {
            "welcome": "Welcome, I am Gossik. I will help you organize all your thoughts and tasks such that you can have a productive and stress-free life. In 3 phases we achieve an optimally set up workflow. Come with me, I'll show you around!",
            "postit": "Phase 1: Each of us has dozens of thoughts that buzz around in our head. Most of the time we don't process these thoughts immediately and therefore they get lost. Here you can write down your thought as a post-it within 5sec such that you can afterwards forget about it without regret because you know you will process it at some time in phase 2. I'll take care of them such that you can have a free and clear mind. Let's try it, what do you have in your mind? Example: 'Plan Ski-Trip, February in Switzerland'",
        	"postitDone": "You just freed your mind from that thought! Now you can forget about it, you'll find it anytime down here in the list with your other post-its. For this tutorial, let's process it right now. Click on your post-it to process it in phase 2.",
        	"processPostit": "Phase 2: Great to see you taking some time to process your post-it! Create a new project to organize your thoughts. A project can be anything that needs several interactions. Example: 'Plan Ski-Trip' is a project because it involves multiple things like 'Check equipment', 'Wait for confirmation from boss to take days off', 'Check rooms in Switzerland' and so on",
        	"createProject": "You just created your first project with Gossik, amazing! Now you can assign post-its to your project. Projects are divided into actions, waitingFors and references. Let's have a look at them. Click on Reference.",
        	"action": "An action is a concrete next step that you yourself need to do. Example: 'Check ski equipment'. It is important to take 20secs to define a concrete action. With this, you can directly start with the action once you have time without the need to rethink what exactly you need to do. Define a new action for this tutorial.",
        	"actionDefinedDesktop": "Now your post-it has been processed and is deleted from your post-its list. You can define additional actions, waitingFors and references if needed. As soon as you have some time, you can use your ToDo list to start working on your actions. Let's head over, click on ToDo.",
        	"actionDefinedMobile": "Now your post-it has been processed and is deleted from your post-its list. You can define additional actions, waitingFors and references if needed. As soon as you have some time, you can use your ToDo list to start working on your actions. Let's head over, open the menu and click on ToDo.",
        	"waitingFor": "A waitingFor is an event for which you need to wait. This can be a specific date or an action from an external person. Example: You need to wait for the 'Confirmation from boss to take days off' before you can plan your ski-trip or you need to wait for '7 days before Christmas' to start shopping your christmas presents. Now click on Action.",
        	"reference": "A reference is a collection of relevant information for the project that do not need any action. Example: The contact details of the airbnb can be saved in a reference or the list of participants and so on. Now, click on WaitingFor.",
        	"calendar": "You can save all your events and appointments in this calendar, I will remind you shortly before their start. You can also see the due deadlines on the top of each day. I will remind you early enough of your deadlines such that you can finish them in time.",
        	"projects": "Here I give you an overview of all your active projects. Click on one to go to its project overview.",
        	"projectOverview": "This is the project overview. You can have a look at all the actions, waitingFors and references. Also, you can see you calendar with only events and deadlines for this project. Later on we will add team functionality with a team chat, you can ignore the Team and Chat boxes for now.",
        	"todo": "Phase 3: You want to get something done from your todo list, awesome! To avoid feeling overwhelmed, input your available time and I will show you all your todos that are doable. Like this, you don't waste time with irrelevant todos. You can also use additional filters, for example to show you all todos corresponding to a specific project. Input a time to see the action you just defined.",
        	"todoTime": "An action is doable within that time. Click on it and start it.",
        	"todoDone": "Great, have fun while taking Action! Visit the post-its to finish this action.",
        	"finishAction": "Click on your started action.",
        	"finishProject": "Click on 'Not yet'",
        	"goalFinished": "Congratulations to finishing your first goal! Now let's head on to achieve the next ones!",
        	"goalNotFinished": "Congratulations to finishing your first action! Most actions have follow-up actions. Therefore, a new post-it has been put into your post-its list to remind you defining the next concrete follow-up action if needed. Now we are done with the tutorial and ready for a new productive and stressfree life. You can explore the two last menu buttons 'Calendar' and 'Projects' by yourself."
        }
  		this.db.getTutorialList(this.auth.userid).valueChanges().pipe(take(1)).subscribe( tutorial => {
			if(tutorial[tutorialPart]) {
				this.translate.get([messages[tutorialPart], "OK"]).subscribe( alertMessage => {
			  		this.alertCtrl.create({
						message: alertMessage[messages[tutorialPart]],
						buttons: [
							      	{
								        text: alertMessage["OK"],
								        handler: () => {
								        	this.db.finishTutorial(this.auth.userid, tutorialPart);
								        	if(tutorialPart == 'welcome') {
								        		this.capturePageStarted = false;
								        		//this.showTutorial('postit');
								        	}
								        	if(tutorialPart == 'finishAction') {
								        		this.capturePageStarted = false;
								        	}
								        	if(tutorialPart == 'reference' || tutorialPart == 'waitingFor') {
								        		this.modalCtrl.getTop().then( modal => modal.dismiss());
								        	}
								        }
							      	}
							    ]
					}).then( alert => {
						if(tutorial[tutorialPart] == 'finishAction') {
							if(!tutorial['welcome']) {
								alert.present();
							}
						} else {
							alert.present();
						}
					});
				});
			}
		});
  	}

  	goToCapturePage() {
  		this.pageTitle = "Create new thought";
  		if(!this.capturePageStarted) {
	  		this.capturePageStarted = true;
	  		//this.showTutorial('finishAction');
	  		//this.showTutorial('welcome');
	  	}
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

  	goToProcessPage() {
  		this.pageTitle = "Unprocessed thoughts";
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
		this.changePage('ProcessPage');
  	}

  	goToProcessCapturePage(capture: any, project?: Goal, type?: string, origin?: string) {
  		//this.showTutorial('processPostit');
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
  		this.captureContent = undefined;
		this.capturePriority = undefined;
		this.captureDuration = undefined;
		this.captureDeadline = undefined;
		this.captureDeadlineText = undefined;
		this.showCaptureProject = true;
		this.showCaptureType = false;
		this.showCaptureContent = false;
		this.showCaptureDuration = false;
		this.showCapturePriority = false;
		this.showCaptureDeadline = false;
		this.showCaptureDone = false;
    	if(project != undefined) {
    		this.captureProject = project;
    		this.showCaptureType = true;
    		this.cameFromProjectOverviewPage = true;
    	} else {
    		this.captureProject = undefined;
    		this.cameFromProjectOverviewPage = false;
    	}
    	if(type != undefined) {
    		this.captureType = type;
    		this.showCaptureContent = true;
    	} else {
  			this.captureType = undefined;
    	}
    	this.cameFromProjectOverviewPage = (origin == 'ProjectOverviewPage');
    	this.cameFromGoalNotFinishedPage = (origin == 'GoalNotFinishedPage');
    	this.cameFromProcessPage = (origin == 'ProcessPage');
    	if(this.cameFromProjectOverviewPage && this.captureType == 'action') {
    		this.pageTitle = "Define action";
    	} else if(this.cameFromProjectOverviewPage && this.captureType == 'note') {
    		this.pageTitle = "Define reference";
    	} else if(this.cameFromProcessPage){
    		this.pageTitle = "Process thought";
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
				this.captureProject = data.data;
				this.showCaptureType = true;
			});
		});
  	}

  	assignType() {
  		if(this.captureType == 'action') {
  			this.assignAction();
  		} else if(this.captureType == 'note') {
  			this.assignNote();
  		}
  	}

  	assignAction() {
  		this.showCaptureContent = true;
  		if(this.captureContent) {
  			if(!this.captureDuration) {
	  			this.captureDurationISOString = new Date();
		  		this.captureDurationISOString.setHours(0,0,0);
		  		this.captureDuration = this.captureDurationISOString.getMinutes();
		  		this.captureDurationISOString = this.captureDurationISOString.toISOString();
	  		}
  			this.showCaptureDuration = true;
  		}
  		if(this.captureDuration) {
  			this.showCapturePriority = true;
  		}
  		if(this.capturePriority) {
  			this.showCaptureDeadline = true;
  			this.showCaptureDone = true;
  		}
  	}

  	assignContent(event) {
  		if(this.captureContent) {
  			if(this.captureType == 'action') {
		  		if(!this.captureDuration) {
		  			this.captureDurationISOString = new Date();
			  		this.captureDurationISOString.setHours(0,0,0);
			  		this.captureDuration = this.captureDurationISOString.getMinutes();
			  		this.captureDurationISOString = this.captureDurationISOString.toISOString();
		  		}
		  		this.showCaptureDuration = true;
		  	} else if(this.captureType == 'note') {
		  		this.showCaptureDone = true;
		  	}
  		} else {
  			this.translate.get(["Define action","Define reference"]).subscribe( translation => {
	  			if(this.captureType == 'action') {
	  				event.target.firstChild.placeholder = translation["Define action"] + "...";
	  			} else if(this.captureType == 'note') {
	  				event.target.firstChild.placeholder = translation["Define reference"] + "...";
	  			}
	  		});
  		}
  	}

  	setCaptureContent(capture) {
  		this.captureContent = capture.content;
  		if(this.captureType == 'action') {
	  		if(!this.captureDuration) {
	  			this.captureDurationISOString = new Date();
		  		this.captureDurationISOString.setHours(0,0,0);
		  		this.captureDuration = this.captureDurationISOString.getMinutes();
		  		this.captureDurationISOString = this.captureDurationISOString.toISOString();
	  		}
	  		this.showCaptureDuration = true;
	  	} else if(this.captureType == 'note') {
	  		this.showCaptureDone = true;
	  	}
  	}

  	assignNote() {
  		this.showCaptureContent = true;
  		this.showCaptureDuration = false;
  		this.showCapturePriority = false;
  		this.showCaptureDeadline = false
  	}

  	timeSet() {
  		let time = new Date(this.captureDurationISOString);
  		this.captureDuration = time.getMinutes();
  		this.showCapturePriority = true;
  	}

  	assignPriority(priority) {
  		this.capturePriority = priority;
  		this.showCaptureDeadline = true;
  		this.showCaptureDone = true;
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

  	deleteDeadline() {
  		this.captureDeadline = undefined;
  		this.captureDeadlineText = undefined;
  	}

  	processCapture() {
  		if(this.captureType == 'action') {
  			this.addActionFromCapture();
  			this.translate.get(["Your todo has been saved and is ready to get done"]).subscribe( translation => {
		  		this.presentToast(translation["Your todo has been saved and is ready to get done"]);
			});
  		} else if(this.captureType == 'note'){
  			this.addNoteFromCapture();
  			this.translate.get(["Your information has been saved and can be seen in the project's overview page"]).subscribe( translation => {
		  		this.presentToast(translation["Your information has been saved and can be seen in the project's overview page"]);
			});
  		}
  		if(this.cameFromProjectOverviewPage) {
  			this.reviewGoal(this.captureProject);
  		} else if (this.cameFromGoalNotFinishedPage) {
  			this.db.deleteAction(this.startedAction, this.auth.userid);
  			this.startedAction = {} as Action;
  			this.goToToDoPage();
  		} else {
  			this.goToProcessPage();
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
  		//this.showTutorial('createProject');
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
	    });
	}

	addAction(goal, capture) {
		//this.showTutorial('action');
		this.modalCtrl.create({ 
			component: DefineActionModalPage,
			componentProps: {capture: capture, goal: goal.name}
		}).then( modal => {
			modal.present();
			modal.onDidDismiss().then( data => {
				if(this.isApp) {
					//this.showTutorial('actionDefinedMobile');
				} else {
					//this.showTutorial('actionDefinedDesktop');
				}
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
						this.db.addAction(action, capture, this.auth.userid);
					}
				}
			});
		});
	}

	addDelegation(goal, capture) {
		//this.showTutorial('waitingFor');
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
						this.db.addDelegation(delegation, capture, this.auth.userid);
					}
				}
			});
		});
	}

	addReference(goal, capture) {
		//this.showTutorial('reference');
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
			//this.showTutorial('finishProject');
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
		this.db.getGoalFromGoalid(this.startedAction.goalid, this.auth.userid).valueChanges().pipe(take(1)).subscribe( goal => {
			goal.key = this.startedAction.goalid;
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
										//this.showTutorial('goalFinished');
										this.startedAction = {} as Action;
							          	this.db.deleteGoal(goal, this.auth.userid).then( () => this.goToToDoPage());
							        }
						      	}
						    ]
				}).then( alert => {
					alert.present();
				});
			});
		});
	}

	goalNotFinished() {
		this.viewpoint = 'GoalNotFinishedPage';
	}

	defineFollowUpTodoLater() {
		//this.showTutorial('goalNotFinished');
		this.db.getGoalFromGoalid(this.startedAction.goalid, this.auth.userid).valueChanges().subscribe( data => {
			this.translate.get("Action finished").subscribe( translation => {
				let capture = {} as Capture;
				capture.content =  data.name + ' - ' + translation + ': ' + this.startedAction.content;
				capture.userid = this.auth.userid;
				capture.active = true;
				this.db.deleteAction(this.startedAction, this.auth.userid).then( () => {
					this.db.addCapture(capture, this.auth.userid);
					this.startedAction = {} as Action;
					this.goToToDoPage();
				});
			});
			this.translate.get(["Todo finished. A new thought has been created if you want to define a follow-up todo"]).subscribe( translation => {
        		this.presentToast(translation["Todo finished. A new thought has been created if you want to define a follow-up todo"]);
        	});
		});
	}

	defineFollowUpTodoNow() {
		this.db.getGoalFromGoalid(this.startedAction.goalid, this.auth.userid).valueChanges().subscribe( data => {
			let capture = {} as Capture;
			data.key = this.startedAction.goalid;
			capture.content = this.startedAction.content;
			this.goToProcessCapturePage(capture, data, 'action', 'GoalNotFinishedPage');
		});
	}

	noFollowUpTodoRequired() {
		this.db.deleteAction(this.startedAction, this.auth.userid).then( () => {
			this.startedAction = {} as Action;
			this.goToToDoPage();
		})
	}

	// ProjectsPage functions
	goToProjectsPage() {
		//this.showTutorial('projects');
		this.pageTitle = "Project list";
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
		//this.showTutorial('projectOverview');
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
		this.calendarLoaded = false;
	    this.pageCtrl = 'ProjectOverview';
	    setTimeout( () => {
			this.calendarLoaded = true;
		}, 2000);
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
  		this.calendarLoaded = false;
  		//this.showTutorial('calendar');
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
			setTimeout( () => {
				this.calendarLoaded = true;
			}, 1000);
		});
		//this.onEventSelected(this.calendar.currentDate);
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
					this.nativeCalendar.addEvent(eventData.title, eventData.eventLocation, eventData.startTime, eventData.endTime).then( event_id => {
						eventData.event_id = event_id;
						this.db.addCalendarEvent(eventData, this.auth.userid);
						this.translate.get(["Your calendar event has been saved"]).subscribe( translation => {
					  		this.presentToast(translation["Your calendar event has been saved"]);
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
								          	this.nativeCalendar.deleteEvent(event.event_id);
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

	changeCalendarMode(calendarMode) {
		this.calendar.mode = calendarMode;
	}

	onViewTitleChanged(title) {
		this.viewTitle = title;
	}

	onTimeSelected(event) {
		if(this.calendarLoaded) {
			this.calendarLoaded = false;
			setTimeout(() => {
				this.calendarLoaded = true;
			}, 1000);
			this.selectedDay = event.selectedTime;
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
						}
					});
				});
			}
		}
	}

	changeWeek(direction: number) {
		let nextWeek = new Date(this.calendar.currentDate);
		nextWeek.setDate(this.calendar.currentDate.getDate() +  direction * 7);
		this.calendar.currentDate = nextWeek;
	}

	changeDay(direction: number) {
		this.calendarLoaded = false;
		let nextDay = new Date(this.calendar.currentDate);
		nextDay.setDate(this.calendar.currentDate.getDate() +  direction);
		this.calendar.currentDate = nextDay;
		setTimeout( () => {
			this.calendarLoaded = true;
		}, 1000);
	}

	changeDateToday() {
		this.calendarLoaded = false;
		this.calendar.currentDate = new Date();
		setTimeout( () => {
			this.calendarLoaded = true;
		}, 1000);
	}

	changeDate() {
		let modal = this.modalCtrl.create({
				component: ChangeWeekModalPage
			}).then (modal => {
				modal.present();
				modal.onDidDismiss().then(data => {
					this.calendarLoaded = false;
					this.calendar.currentDate = data.data;
					setTimeout( () => {
						this.calendarLoaded = true;
					}, 1000);
				});
			});
	}

  	// ToDoPage functions
	goToToDoPage() {
		if(this.startedAction.key) {
			this.pageTitle = "Started todo";
			this.changePage('ActionPage');
		} else {
			this.pageTitle = "Do todos";
			this.doableActionArray = [];
			this.timeEstimateISOString = new Date();
		  	this.timeEstimateISOString.setHours(0,0,0);
		  	this.timeEstimateISOString = this.timeEstimateISOString.toISOString();
			//this.showTutorial('todo');
			this.doableActionArray = [];
			this.goalKeyArray = [];
	  		this.giveTimeForm = this.fb.group({
	      		timeEstimate: ['', Validators.required]
	    	});
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
	}

	filterToDos() {
  		this.modalCtrl.create({ 
			component: ToDoFilterModalPage,
			componentProps: {goalArray: this.goalArray,
							goalKeyArray: this.goalKeyArray}
		}).then( modal => {
			modal.present();
			modal.onDidDismiss().then( data => {
				this.goalKeyArray = data.data;
				this.showDoableActions();
			});
		});
  	}

  	chooseGoal(event) {
  		if(event.detail.value.length == 0) {
  			this.goalKeyArray = [];
  		}
  		this.showDoableActions();
  	}

  	showDoableActions() {
  		this.timeEstimateISOString = new Date(this.timeEstimateISOString);
  		let timeEstimate = this.timeEstimateISOString.getMinutes();
  		if(timeEstimate > 0) {
			this.timeEstimateISOString = this.timeEstimateISOString.toISOString();
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
						if(action.time/1 <= timeEstimate/1 && !action.taken && (this.goalKeyArray.indexOf(action.goalid) != -1 || this.goalKeyArray.length == 0 )) {
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
		}
  	}

  	skipAction() {
  		this.doableActionArray.splice(0, 1);
  		if(this.doableActionArray.length == 0) {
        	this.errorMsg = "There is no doable action for that time.";
        } else {
        	this.errorMsg = '';
        }
  	}

  	startAction(action) {
  		action.taken = true;
  		this.startedAction = action;
		this.db.editAction(action, this.auth.userid);
		this.pageTitle = "Started todo";
		this.changePage('ActionPage');
		this.translate.get(["You started with this todo, finish it here when it is done"]).subscribe( translation => {
	  		this.presentToast(translation["You started with this todo, finish it here when it is done"]);
		});
  	}

  	finishAction() {
  		this.nextActionList = this.db.getNextActionListFromGoal(this.startedAction.goalid, this.auth.userid)
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
			//this.showTutorial('finishProject');
			if(nextActionArray.length == 1) {
				this.changePage('FinishGoalPage');
			} else {
				this.goalNotFinished();
			}
		});
  	}

  	stopAction() {
  		let minutes = this.startedAction.time % 60;
  		let hours = (this.startedAction.time - minutes) / 60;
  		this.startedActionTimeISOString = new Date();
  		this.startedActionTimeISOString.setHours(hours, minutes);
  		this.startedActionTimeISOString = this.startedActionTimeISOString.toISOString();
  		this.changePage('StopActionPage');
  	}

  	updateStartedActionTime() {
  		let time = new Date(this.startedActionTimeISOString);
  		time.getMinutes();
  		this.startedAction.taken = false;
  		this.db.editAction(this.startedAction, this.auth.userid);
  		this.startedAction = {} as Action;
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
								        	//this.showTutorial('todoDone');
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