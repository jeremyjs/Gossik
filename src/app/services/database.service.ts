import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { Capture } from '../../model/capture/capture.model';
import { Goal } from '../../model/goal/goal.model';
import { User } from '../../model/user/user.model';
import { Action } from '../../model/action/action.model';
import { Reference } from '../../model/reference/reference.model';
import { Delegation } from '../../model/delegation/delegation.model';
import { CalendarEvent } from '../../model/calendarEvent/calendarEvent.model';
import { Attribute } from '../../model/attribute/attribute.model';

import { TranslateService } from '@ngx-translate/core';

import { map, take } from 'rxjs/operators';
import { Suggestion } from 'src/model/suggestion/suggestion.model';

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
    
    createUser(userid, email, referred?) {
        this.userData.profile = {
            email: email,
            referred: referred,
            assistant: 'Standard',
            smartAssistant: false,
            timezoneOffset: new Date().getTimezoneOffset(),
            signUpDate: new Date().toISOString()
        }
        return this.db.list('users').set(userid, this.userData);
    }

    logout() {
        this.db.database.goOffline();
    }

    login() {
        this.db.database.goOnline();
    }

    getUserProfile(userid) {
        return this.db.object('users/' + userid + '/profile');
    }

    finishTutorial(userid) {
        return this.db.list('users/' + userid).update('profile', {tutorial: false});
    }

    startTutorial(userid) {
        return this.db.list('users/' + userid).update('profile', {tutorial: true});
    }

    initiateAssistant(userid) {
        return this.db.list('users/'+ userid + '/profile').set('assistant', 'standard');
    }

    updateAssistant(userid, assistant) {
        return this.db.list('users/'+ userid + '/profile').set('assistant', assistant);
    }

    switchSmartAssistant(smartAssistant, userid) {
        return this.db.list('users/' + userid + '/profile').set('smartAssistant', smartAssistant);
    }

    setFocus(focus, userid) {
        return this.db.list('users/' + userid + '/profile/focusProjects').push(focus);
    }

    clearFocus(userid) {
        return this.db.list('users/' + userid + '/profile/focusProjects').remove();
    }

    initiateLearnedSchedule(userid) {
        this.db.list<Goal>('/users/' + userid + '/goals')
        .snapshotChanges()
        .pipe(take(1),
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

    learnLearnedSchedule(userid, projectids, dates, value) {
        this.getLearnedSchedule(userid).snapshotChanges().pipe(take(1)).subscribe( learnedSchedule => {
            if(learnedSchedule.payload.val()) {
                this.getTimezoneOffset(userid).snapshotChanges().pipe(take(1)).subscribe( timezoneOffset => {
                    this.getGoalList(userid).snapshotChanges().pipe(take(1)).subscribe( projectList => {
                        let learnedScheduleObject = JSON.parse(learnedSchedule.payload.val().toString());
                        for(let date of dates) {
                            let localeDate = new Date(date.getTime() - Number(timezoneOffset.payload.val())*60*1000);
                            let weekDay = localeDate.getDay() - 1;
                            if(weekDay == -1) {
                                weekDay = 6;
                            }
                            //getHours() gives locale hours already, so no need to use localeDate
                            let hour = date.getHours();
                            let row = weekDay * 24 + hour;
                            for(let projectid of projectids) {
                                if(learnedScheduleObject[row][projectid] != undefined) {
                                    learnedScheduleObject[row][projectid] += value;
                                } else {
                                    for(let hour = 0; hour <= 167; hour ++) {
                                        if(hour != row) {
                                            learnedScheduleObject[hour][projectid] = 0;
                                        } else {
                                            learnedScheduleObject[hour][projectid] = value;
                                        }
                                    }
                                }
                            }
                        }
                        this.updateProjectsInLearnedSchedule(userid);
                        this.db.list('users/'+ userid + '/profile').set('learnedSchedule', JSON.stringify(learnedScheduleObject));
                        })
                });
            } else {
                this.initiateLearnedSchedule(userid);
            }
        });
    }

    updateProjectsInLearnedSchedule(userid) {
        this.getLearnedSchedule(userid).snapshotChanges().pipe(take(1)).subscribe( learnedSchedule => {
            if(learnedSchedule.payload.val()) {
                this.getGoalList(userid).snapshotChanges().pipe(take(1)).subscribe( projectList => {
                    let learnedScheduleObject = JSON.parse(learnedSchedule.payload.val().toString());
                    for(let project of projectList) {
                        if(!project.payload.val().active && learnedScheduleObject[0][project.key] != undefined) {
                            for(let number in learnedScheduleObject) {
                                delete learnedScheduleObject[number][project.key];
                            }
                        } else if(project.payload.val().active && learnedScheduleObject[0][project.key] == undefined) {
                            for(let number in learnedScheduleObject) {
                                learnedScheduleObject[number][project.key] = 0;
                            }
                        }
                    }
                    this.db.list('users/'+ userid + '/profile').set('learnedSchedule', JSON.stringify(learnedScheduleObject));
                    })
            } else {
                this.initiateLearnedSchedule(userid);
            }
        });
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

    addSuggestion(suggestion: Suggestion, userid) {
        return this.db.list('/users/' + userid + '/suggestions').push(suggestion);
    }

    deleteAttribute(attribute: Attribute, userid) {
        attribute.active = false;
        attribute.deleteDate = new Date().toISOString();
        return this.editAttribute(attribute, userid);
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

    getReferenceListFromUser(userid) {
        return this.db.list<Reference>('/users/' + userid + '/references');
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

    addAttribute(attribute, userid) {
        return this.db.list('users/' + userid + '/attributes').push(attribute);
    }

    getAttributeListFromUser(userid) {
        return this.db.list<Attribute>('users/' + userid + '/attributes');
    }

    getSuggestionListFromUser(userid) {
        return this.db.list<Suggestion>('users/' + userid + '/suggestions');
    }

    deleteSuggestion(suggestion: Suggestion, userid) {
        suggestion.active = false;
        suggestion.deleteDate = new Date().toISOString();
        return this.editSuggestion(suggestion, userid);
    }

    editSuggestion(suggestion: Suggestion, userid) {
        let suggestionkey = suggestion.key;
        delete suggestion.key;
        return this.db.database.ref('/users/' + userid + '/suggestions/' + suggestionkey).set(suggestion);
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

    editAttribute(attribute: Attribute, userid) {
        let attributekey = attribute.key;
        delete attribute.key;
        return this.db.database.ref('/users/' + userid + '/attributes/' + attributekey).set(attribute);
    }

    editAction(action: Action, userid) {
        let actionkey = action.key;
        delete action.key;
        if(action.deadline) {
            this.db.object<CalendarEvent>('/users/' + userid + '/calendarEvents/' + action.deadlineid)
            .valueChanges()
            .pipe(take(1))
            .subscribe( event => {
                if(event) {
                    event.key = action.deadlineid;
                    event.startTime = new Date(action.deadline).toISOString(),
					event.endTime = new Date (new Date(action.deadline).getTime() + 3600*1000).toISOString(),
                    this.editCalendarEvent(event, userid);
                }
            });
        }
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
