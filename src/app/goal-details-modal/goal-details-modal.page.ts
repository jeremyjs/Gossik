import { Component, OnInit } from '@angular/core';
import { NavParams, ModalController } from '@ionic/angular';

import { Goal } from '../../model/goal/goal.model';

import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { TranslateService } from '@ngx-translate/core';

import { DatabaseService } from '../services/database.service';
import { AuthenticationService } from '../services/authentication.service';

@Component({
  selector: 'app-goal-details-modal',
  templateUrl: './goal-details-modal.page.html',
  styleUrls: ['./goal-details-modal.page.scss'],
})
export class GoalDetailsModalPage implements OnInit {

	goal = {} as Goal;
  	editGoalForm: FormGroup;

  constructor(
  		public modalCtrl: ModalController,
	  	private navParams: NavParams,
	  	private db: DatabaseService,
	  	public translate: TranslateService,
      	public fb: FormBuilder,
      	private auth: AuthenticationService
      	) {
  	this.goal = this.navParams.get('goal');
    this.editGoalForm = this.fb.group({
      name: ['', Validators.required]
      });
  }

  ngOnInit() {
  }

  cancel() {
    this.modalCtrl.dismiss();
  }

  saveGoal() {
    this.goal.name = this.editGoalForm.value.name;
    let goalkey = this.goal.key;
    this.db.editGoal(this.goal, this.auth.userid);
    this.goal.key = goalkey;
    this.modalCtrl.dismiss();
  }

}
