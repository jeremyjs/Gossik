import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { Capture } from '../../model/capture/capture.model';
import { Goal } from '../../model/goal/goal.model';
import { User } from '../../model/user/user.model';
import { Action } from '../../model/action/action.model';
import { Reference } from '../../model/reference/reference.model';
import { Delegation } from '../../model/delegation/delegation.model';
import { CalendarEvent } from '../../model/calendarEvent/calendarEvent.model';

import { TranslateService } from '@ngx-translate/core';

import { map, take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {

  	userData = {} as User;
    availableLanguages: string[] = ['de', 'en'];
 
    constructor(
    	private db: AngularFireDatabase,
        public translate: TranslateService
	) { }
    
    createUser(userid, email) {
        this.userData.profile = {
            email: email,
            assistant: 'standard',
            tutorial: {
                'fivetodos': true,
                'thoughts': false,
                'thoughtprocessing': false,
                'process': false,
                'processTodo': false,
                'processThoght': false,
                'assistant': true
            },
            timezoneOffset: new Date().getTimezoneOffset()
        }
        this.userData.profile["signUpDate"] = new Date().toISOString();
        return this.db.list('users').set(userid, this.userData); 
    }

    logout() {
        this.db.database.goOffline();

    }

    login() {
        this.db.database.goOnline();
    }

    getTutorialList(userid) {
        return this.db.object('users/' + userid + '/tutorial');
    }

    getUserProfile(userid) {
        return this.db.object('users/' + userid + '/profile');
    }

    finishTutorial(userid, tutorialPart, nextTutorialPart?, nextTutorialPart2?, nextTutorialPart3?) {
        let tutorial = {};
        tutorial[tutorialPart] = false;
        tutorial[tutorialPart + 'Enddate'] = new Date().toISOString();
        if(nextTutorialPart) {
            tutorial[nextTutorialPart] = true;
        }
        if(nextTutorialPart2) {
            tutorial[nextTutorialPart2] = true;
        }
        if(nextTutorialPart3) {
            tutorial[nextTutorialPart3] = true;
        }
        return this.db.list('users/' + userid + '/profile').update('tutorial', tutorial);
    }

    initiateAssistant(userid) {
        return this.db.list('users/'+ userid + '/profile').set('assistant', 'standard');
    }

    updateAssistant(userid, assistant) {
        return this.db.list('users/'+ userid + '/profile').set('assistant', assistant);
    }

    initiateLearnedSchedule(userid) {
        this.db.list<Goal>('/users/' + userid + '/goals')
        .snapshotChanges()
        .pipe(
        map(
            changes => { 
                return changes.map( c => {
                    let goal: Goal = { 
                        key: c.payload.key, ...c.payload.val()
                        };
                    return goal;
            });}))
        .subscribe(goals => {
            let learnedSchedule = {};
            let learnedScheduleRow = {};
            for(let goal of goals) {
                if(goal.active != false) {
                    learnedScheduleRow[goal.key] = 0;
                }
            }
            for(let hour = 0; hour <= 167; hour ++) {
                learnedSchedule[hour]= learnedScheduleRow;
            }
            return this.db.list('users/'+ userid + '/profile').set('learnedSchedule', JSON.stringify(learnedSchedule));
        });
    }

    getTimezoneOffset(userid) {
        return this.db.object('users/' + userid + '/profile/timezoneOffset');
    }

    getLearnedSchedule(userid) {
        return this.db.object('users/' + userid + '/profile/learnedSchedule');
    }

    updateLearnedSchedule(userid, projectids, dates, value) {
        this.getLearnedSchedule(userid).snapshotChanges().pipe(take(1)).subscribe( learnedSchedule => {
            if(learnedSchedule.payload.val()) {
                this.getTimezoneOffset(userid).snapshotChanges().pipe(take(1)).subscribe( timezoneOffset => {
                    let learnedScheduleObject = JSON.parse(learnedSchedule.payload.val().toString());
                    console.log(dates);
                    for(let date of dates) {
                        let localeDate = new Date(date.getTime() - Number(timezoneOffset.payload.val())*60*1000);
                        let weekDay = localeDate.getDay() - 1;
                        if(weekDay == -1) {
                            weekDay = 6;
                        }
                        //getHours() gives locale hours already, so no need to use localeDate
                        let hour = date.getHours();
                        let row = weekDay * 24 + hour;
                        console.log(row);
                        for(let projectid of projectids) {
                            console.log(projectid);
                            learnedScheduleObject[row][projectid] += value;
                        }
                    }
                    console.log(learnedScheduleObject);
                    this.db.list('users/'+ userid + '/profile').set('learnedSchedule', JSON.stringify(learnedScheduleObject));
                })
            } else {
                this.initiateLearnedSchedule(userid);
            }
        })
    }

    setTutorialStartdate(userid, tutorialPart) {
        let tutorial = {};
        tutorial[tutorialPart + 'Startdate'] = new Date().toISOString();
        return this.db.list('users/' + userid + '/profile').update('tutorial', tutorial);
    }

    updateTimezoneOffset(userid, timezoneOffset) {
        return this.db.list('users/' + userid).update('profile', {timezoneOffset: timezoneOffset});
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
        if(this.availableLanguages.indexOf(language) == -1) {
            language = 'en';
        }
        return this.db.list('users/' + userid).update('profile', {language: language});
    }

    trackLogin(userid) {
        let now = new Date().toISOString();
        return this.db.list('users/' + userid).update('profile', {lastLogin: now});
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
        capture.createDate = new Date().toISOString();
        return this.db.list('/users/' + userid + '/captures').push(capture);
    }
	
	deleteCapture(capture: Capture, userid) {
        capture.active = false;
        capture.deleteDate = new Date().toISOString();
        return this.editCapture(capture, userid);
    }

    getCalendarEventListFromUser(userid) {
        return this.db.list<CalendarEvent>('/users/' + userid + '/calendarEvents');
    }

    addCalendarEvent(calendarEvent: CalendarEvent, userid) {
        calendarEvent.createDate = new Date().toISOString();
        return this.db.list('/users/' + userid + '/calendarEvents').push(calendarEvent);
    }
    
    deleteAction(action: Action, userid) {
        action.active = false;
        action.deleteDate = new Date().toISOString();
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
            if(event) {
                event.key = eventid;
                event.active = false;
                event.deleteDate = new Date().toISOString();
                this.editCalendarEvent(event, userid);
            }
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
        reference.deleteDate = new Date().toISOString();
        return this.editReference(reference, userid);
	}
    
    getGoalList(userid) {
        return this.db.list<Goal>('/users/' + userid + '/goals');
    }

    addGoal(goal: Goal, userid) {
        goal.createDate = new Date().toISOString();
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
        action.createDate = new Date().toISOString();
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
        reference.createDate = new Date().toISOString();
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
        goal.deleteDate = new Date().toISOString();
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
