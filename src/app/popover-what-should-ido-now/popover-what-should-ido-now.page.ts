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
  }

  dateFormated(date) {
		return new Date(date).toLocaleDateString();
  }
  
  showNext() {
    if(this.doableActionArray.length > 1) {
      this.doableActionArray.shift();
    }
  }

  startToDo(todo) {
    this.popoverCtrl.dismiss(todo);
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

}
