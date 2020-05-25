import { Component, OnInit } from '@angular/core';
import { NavParams, ModalController, AlertController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { Goal } from '../../model/goal/goal.model';

@Component({
  selector: 'app-to-do-filter-modal',
  templateUrl: './to-do-filter-modal.page.html',
  styleUrls: ['./to-do-filter-modal.page.scss'],
})
export class ToDoFilterModalPage implements OnInit {
	goalArray = [];
	chosenGoalArray = [];

  constructor(
  	public navParams: NavParams,
  	public translate: TranslateService,
  	public modalCtrl: ModalController,
  	public alertCtrl: AlertController
  	) { }

  ngOnInit() {
  	this.goalArray = this.navParams.get('goalArray');
  	this.chosenGoalArray = this.navParams.get('goalKeyArray');
  }

  chooseGoal(goal) {
  	if(this.chosenGoalArray.indexOf(goal.key) == -1) {
  		this.chosenGoalArray.push(goal.key)
  	} else {
  		this.chosenGoalArray.splice(this.chosenGoalArray.indexOf(goal.key), 1);
  	}
  }

  assign() {
  	this.modalCtrl.dismiss(this.chosenGoalArray);
  }

}