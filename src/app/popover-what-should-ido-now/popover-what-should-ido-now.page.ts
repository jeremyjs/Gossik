import { Component, OnInit } from '@angular/core';
import { NavParams, PopoverController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { Action } from 'src/model/action/action.model';

@Component({
  selector: 'app-popover-what-should-ido-now',
  templateUrl: './popover-what-should-ido-now.page.html',
  styleUrls: ['./popover-what-should-ido-now.page.scss'],
})
export class PopoverWhatShouldIDoNowPage implements OnInit {

  doableActionArray: Action[] = [];
  goalDict: {} = {};
  priorities: any[] = [];
  userProfile: any;
  priorityInfluenceFactorDeadlineText: string;
  priorityInfluenceFactorProcrastinationText: string;
  priorityInfluenceFactorLearnedScheduleText: string;
  priorityInfluenceFactorFocusText: string;

  constructor(
    public translate: TranslateService,
    public popoverCtrl: PopoverController,
    public navParams: NavParams
  ) { }

  ngOnInit() {
    this.doableActionArray = this.navParams.get('doableActionArray').slice();
    this.goalDict = this.navParams.get('goalDict');
    this.priorities = this.navParams.get('priorities');
    this.userProfile = this.navParams.get('userProfile');
    this.doableActionArray.sort((a, b) => (this.computeDynamicPriority(a) < this.computeDynamicPriority(b)) ? 1 : -1);
    this.computeDynamicPriority(this.doableActionArray[0], true);
  }

  dateFormated(date) {
		return new Date(date).toLocaleDateString();
  }
  
  showNext() {
    if(this.doableActionArray.length > 1) {
      this.doableActionArray.shift();
      this.computeDynamicPriority(this.doableActionArray[0], true);
    }
  }

  startToDo(todo) {
    this.popoverCtrl.dismiss(todo);
  }

  computePriorityInfluenceFactorDeadline(action: Action, text: boolean): number {
    let priorityInfluenceFactorDeadline: number = 0;
		let daysUntilDeadline: number;
		if(action.deadline) {
			daysUntilDeadline = Math.round((new Date(action.deadline).getTime() - new Date().getTime())/(24*3600*1000));
			if(daysUntilDeadline < 5) {
        priorityInfluenceFactorDeadline = (5 - daysUntilDeadline)*10;
        if(text) {
          this.priorityInfluenceFactorDeadlineText = "The deadline is approaching soon";
        }
			}
		}
    return priorityInfluenceFactorDeadline;
  }

  computePriorityInfluenceFactorProcrastination(action: Action, text: boolean): number {
    let priorityInfluenceFactorProcrastination: number = 0;
		let daysSinceCreated: number;
		if(action.createDate) {
			daysSinceCreated = Math.round((new Date().getTime() - new Date(action.createDate).getTime())/(24*3600*1000));
      priorityInfluenceFactorProcrastination = daysSinceCreated / 6;
      if(text) {
        if(priorityInfluenceFactorProcrastination > 2) {
          this.priorityInfluenceFactorProcrastinationText = "It has been on your to-do list for a long time";
        } else if(priorityInfluenceFactorProcrastination > 5) {
          this.priorityInfluenceFactorProcrastinationText = "It has been on your to-do list for way too long";
        }
      }
    }
    return priorityInfluenceFactorProcrastination;
  }

  computePriorityInfluenceFactorLearnedSchedule(action: Action, text: boolean): number {
    let priorityInfluenceFactorLearnedSchedule: number = 0;
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
		let scoreDict:any = {};
		for(let projectid in learnedSchedule[learnedScheduleHour]) {
			if(learnedSchedule[learnedScheduleHour][projectid] > max) {
				max = learnedSchedule[learnedScheduleHour][projectid];
			}
			if(learnedSchedule[learnedScheduleHour][projectid] > 0) {
				scoreDict[projectid] = learnedSchedule[learnedScheduleHour][projectid];
			}
		}
		if(max > 0 && scoreDict[action.goalid]) {
      priorityInfluenceFactorLearnedSchedule = scoreDict[action.goalid] / max * 20;
      if(text) {
        this.priorityInfluenceFactorLearnedScheduleText = "At this time, you usually work on this project";
      }
    }
    return priorityInfluenceFactorLearnedSchedule;
  }

  computePriorityInfluenceFactorFocus(action: Action, text: boolean): number {
    let priorityInfluenceFactorFocus: number = 0;
		for(let key in this.userProfile.focusProjects) {
			if(this.userProfile.focusProjects[key] == action.goalid) {
        priorityInfluenceFactorFocus = 15;
        if(text) {
          this.priorityInfluenceFactorFocusText = "You set the focus to this project";
        }
			}
    }
    return priorityInfluenceFactorFocus;
  }

  computePriorityInfluenceFactorPriority(action: Action): number {
    let priorityInfluenceFactorPriority: number = 10 * action.priority;
    return priorityInfluenceFactorPriority
  }

  computeDynamicPriority(action: Action, text: boolean = undefined): number {
    this.priorityInfluenceFactorDeadlineText = undefined;
    this.priorityInfluenceFactorProcrastinationText = undefined;
    this.priorityInfluenceFactorLearnedScheduleText = undefined;
    this.priorityInfluenceFactorFocusText = undefined;
		let priorityInfluenceFactorDeadline = this.computePriorityInfluenceFactorDeadline(action, text);
		let priorityInfluenceFactorProcrastination = this.computePriorityInfluenceFactorProcrastination(action, text);
    let priorityInfluenceFactorLearnedSchedule = this.computePriorityInfluenceFactorLearnedSchedule(action, text);
    let priorityInfluenceFactorFocus = this.computePriorityInfluenceFactorFocus(action, text);
		let priorityInfluenceFactorPriority = this.computePriorityInfluenceFactorPriority(action);
		return priorityInfluenceFactorDeadline + priorityInfluenceFactorProcrastination + priorityInfluenceFactorLearnedSchedule + priorityInfluenceFactorFocus + priorityInfluenceFactorPriority;
	}

}
