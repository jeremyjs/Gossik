import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { Capture } from '../../model/capture/capture.model';
import { Goal } from '../../model/goal/goal.model';
import { User } from '../../model/user/user.model';
import { Action } from '../../model/action/action.model';
import { Reference } from '../../model/reference/reference.model';
import { Delegation } from '../../model/delegation/delegation.model';
import { CalendarEvent } from '../../model/calendarEvent/calendarEvent.model';

import { map, take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {

  	userData = {} as User;
    tutorial = {
            'welcome': true,
            'postit': true,
            'postitDone': true,
            'processPostit': true,
            'createProject': true,
            'action': true,
            'actionDefinedDesktop': true,
            'actionDefinedMobile': true,
            'waitingFor': true,
            'reference': true,
            'calendar': true,
            'projects': true,
            'todo': true,
            'todoTime': true,
            'todoDone': true,
            'goalFinished': true,
            'goalNotFinished': true,
            'projectOverview': true,
            'finishAction': true,
            'finishProject': true
        };
 
    constructor(
    	private db: AngularFireDatabase
	) { }
    
    createUser(userid, email) {
        this.userData.email = email;
        this.userData.tutorial = this.tutorial;
        this.userData.signUpDate = new Date().toISOString();
        console.log('created Account');
        console.log(this.userData);
        return this.db.list('users').set(userid, this.userData); 
    }

    logout() {
        this.db.database.goOffline();

    }

    addTutorial(userid) {
        this.db.object<any>('users/' + userid).valueChanges().pipe(take(1)).subscribe( user => {
            if(!user.hasOwnProperty('tutorial')) {
                return this.db.list('users/' + userid).set('tutorial', this.tutorial);
            }
        });
    }

    getTutorialList(userid) {
        return this.db.object('users/' + userid + '/tutorial');
    }

    finishTutorial(userid, tutorialPart) {
        let tutorials = {
            "welcome": { welcome: false },
            "postit": { postit: false },
            "postitDone": { postitDone: false },
            "processPostit": { processPostit: false },
            "createProject": { createProject: false },
            "action": { action: false },
            "actionDefinedDesktop": { actionDefinedDesktop: false },
            "actionDefinedMobile": { actionDefinedMobile: false },
            "waitingFor": { waitingFor: false },
            "reference": { reference: false },
            "calendar": { calendar: false },
            "projects": { projects: false },
            "todo": { todo: false },
            "todoTime": { todoTime: false },
            "todoDone": { todoDone: false },
            "goalFinished": { goalFinished: false },
            "goalNotFinished": { goalNotFinished: false },
            "projectOverview": { projectOverview: false },
            "finishAction": { finishAction: false },
            "finishProject": { finishProject: false }
        }
        return this.db.list('users/' + userid).update('tutorial', tutorials[tutorialPart]);
    }

    sendFeedback(feedback, time, userid) {
        let fb = {
            'userid': userid,
            'time': time,
            'feedback': feedback
        }
        return this.db.list('feedback').push(fb);
    }

    getFeedbackList() {
        return this.db.list('feedback');
    }

    sendPush(manualPushEN, manualPushDE) {
        let push = {
            'done': false,
            'EN': manualPushEN,
            'DE': manualPushDE
        }
        return this.db.list('push').push(push);
    }

    changeLanguage(userid, language) {
        return this.db.list('users').update(userid, {language: language});
    }

    trackLogin(userid) {
        let now = new Date().toISOString();
        return this.db.list('users').update(userid, {lastLogin: now});
    }

    saveDeviceToken(userid, token) {
        let tokenFound: boolean = false;
        this.db.list('/users/' + userid + '/devices')
            .snapshotChanges()
            .pipe(take(1),
            map(
                changes => { 
                    return changes.map( c => {
                        return { 
                            key: c.payload.key, token: c.payload.val()
                            }; 
                });}))
            .subscribe(devices => {
                for(let device of devices) {
                    if(device.token == token) {
                        tokenFound = true
                    }  
                }
                if(!tokenFound) {
                    return this.db.list('/users/' + userid + '/devices').push(token);
                }
            });
    }

    getDeviceTokenList(userid) {
        return this.db.list('/users/' + userid + '/devices');
    }

    getCaptureListFromUser(userid) {
        return this.db.list<Capture>('/users/' + userid + '/captures');
    }
 
    addCapture(capture: Capture, userid) {
        return this.db.list('/users/' + userid + '/captures').push(capture);
    }
	
	deleteCapture(capture: Capture, userid) {
        capture.active = false;
        return this.editCapture(capture, userid);
    }

    getCalendarEventListFromUser(userid) {
        return this.db.list<CalendarEvent>('/users/' + userid + '/calendarEvents');
    }

    addCalendarEvent(calendarEvent: CalendarEvent, userid) {
        return this.db.list('/users/' + userid + '/calendarEvents').push(calendarEvent);
    }
    
    deleteAction(action: Action, userid) {
        action.active = false;
        return this.editAction(action, userid).then( () =>
            {
                if(action.deadline) {
                    this.deleteCalendarEvent(action.deadlineid, userid);
                }
            });
    }

    deleteCalendarEvent(eventid, userid) {
        return this.db.object<CalendarEvent>('/users/' + userid + '/calendarEvents/' + eventid)
        .valueChanges()
        .pipe(take(1))
        .subscribe( event => {
            event.key = eventid;
            event.active = false;
            this.editCalendarEvent(event, userid); 
        });
    }

    deleteDelegation(delegation: Delegation, userid) {
        delegation.active = false;
        return this.editDelegation(delegation, userid).then( () =>
            {
                if(delegation.deadline) {
                    this.deleteCalendarEvent(delegation.deadlineid, userid);
                }
            });
    }
    
    deleteReference(reference: Reference, userid) {
        reference.active = false;
        return this.editReference(reference, userid);
	}
    
    getGoalList(userid) {
        return this.db.list<Goal>('/users/' + userid + '/goals');
    }

    addGoal(goal: Goal, userid) {
        return this.db.list('/users/' + userid + '/goals').push(goal);
    }

    getReferenceListFromGoal(goalid, userid) {
        return this.db.list<Reference>('/users/' + userid + '/references', ref => ref.orderByChild('goalid').equalTo(goalid));
    }

    getNextActionListFromGoal(goalid, userid) {
        return this.db.list<Action>('/users/' + userid + '/nextActions', ref => ref.orderByChild('goalid').equalTo(goalid));
    }

    getDelegationListFromGoal(goalid, userid) {
        return this.db.list<Delegation>('/users/' + userid + '/delegations', ref => ref.orderByChild('goalid').equalTo(goalid));
    }

    getNextActionListFromUser(userid) {
        return this.db.list<Action>('/users/' + userid + '/nextActions', ref => ref.orderByChild('priority'));
    }

    getTakenActionListFromUser(userid) {
        return this.db.list<Action>('/users/' + userid + '/nextActions', ref => ref.orderByChild('taken').equalTo(true));
    }

    getGoalFromGoalid(goalid, userid) {
        return this.db.object<Goal>('/users/' + userid + '/goals/' + goalid);
    }

    getCalendarEventFromCalendarEventId(calendarEventId, userid) {
        return this.db.object<CalendarEvent>('/users/' + userid + '/calendarEvents/' + calendarEventId);
    }

    addAction(action: Action, capture: Capture, userid) {
        if(capture.key) {
            this.deleteCapture(capture, userid);
        }
        return this.db.list('users/' + userid + '/nextActions').push(action);
    }

    getActionFromActionid(actionid: string, userid) {
        return this.db.object<Action>('/users/' + userid + '/nextActions/' + actionid);
    }

    getDelegationFromDelegationid(delegationid: string, userid) {
        return this.db.object<Delegation>('/users/' + userid + '/delegations/' + delegationid);
    }

    addDelegation(delegation: Delegation, capture: Capture, userid) {
        if(capture.key) {
            this.deleteCapture(capture, userid);
        }
        return this.db.list('users/' + userid + '/delegations').push(delegation)
    }

    addReference(reference: Reference, capture: Capture, userid){
        return this.db.list('/users/' + userid + '/references').push(reference)
        .then( () => {
            if(capture.key) {
                this.deleteCapture(capture, userid);
            }
        });
    }

    editCapture(capture: Capture, userid) {
        let capturekey = capture.key;
        delete capture.key;
        return this.db.database.ref('/users/' + userid + '/captures/' + capturekey).set(capture);
    }

    editAction(action: Action, userid) {
        let actionkey = action.key;
        delete action.key;
        return this.db.database.ref('/users/' + userid + '/nextActions/' + actionkey).set(action);
    }

    editDelegation(delegation: Delegation, userid) {
        let delegationkey = delegation.key;
        delete delegation.key;
        return this.db.database.ref('/users/' + userid + '/delegations/' + delegationkey).set(delegation);
    }

    editReference(reference: Reference, userid) {
        let referencekey = reference.key;
        delete reference.key;
        return this.db.database.ref('/users/' + userid + '/references/' + referencekey).set(reference);
    }

    editCalendarEvent(calendarEvent: CalendarEvent, userid) {
        let calendarEventkey = calendarEvent.key;
        delete calendarEvent.key;
        return this.db.database.ref('/users/' + userid + '/calendarEvents/' + calendarEventkey).set(calendarEvent);
    }

    editGoal(goal: Goal, userid) {
        let goalkey = goal.key;
        delete goal.key;
        return this.db.database.ref('/users/' + userid + '/goals/' + goalkey).set(goal);
    }



    deleteGoal(goal, userid) {
        let goalkey = goal.key;
        goal.active = false;
        return this.editGoal(goal, userid).then( () => {
            this.db.list<Action>('/users/' + userid + '/nextActions', ref => ref.orderByChild('goalid').equalTo(goalkey))
            .snapshotChanges()
            .pipe(
            map(
                changes => { 
                    return changes.map( c => {
                        let action: Action = { 
                            key: c.payload.key, ...c.payload.val()
                            };
                        return action;
                });}))
            .subscribe(actions => {
                for(let action of actions) {
                    this.deleteAction(action, userid);  
                }
            });
            this.db.list<Delegation>('/users/' + userid + '/delegations', ref => ref.orderByChild('goalid').equalTo(goalkey))
            .snapshotChanges()
            .pipe(
            map(
                changes => { 
                    return changes.map( c => {
                        let delegation: Delegation = { 
                            key: c.payload.key, ...c.payload.val()
                            };
                        return delegation;
                });}))
            .subscribe(delegations => {
                for(let delegation of delegations) {
                    this.deleteDelegation(delegation, userid);  
                }
            });
            this.db.list<Reference>('/users/' + userid + '/references', ref => ref.orderByChild('goalid').equalTo(goalkey))
            .snapshotChanges()
            .pipe(
            map(
                changes => { 
                    return changes.map( c => {
                        let reference: Reference = { 
                            key: c.payload.key, ...c.payload.val()
                            };
                        return reference;
                });}))
            .subscribe(references => {
                for(let reference of references) {
                    this.deleteReference(reference, userid);  
                }
            });
        });
    }
}
