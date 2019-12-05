import { Component, OnInit } from '@angular/core';
import { NavParams, ModalController } from '@ionic/angular';

import { Action } from '../../model/action/action.model';

import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { TranslateService } from '@ngx-translate/core';

import { DatabaseService } from '../services/database.service';
import { AuthenticationService } from '../services/authentication.service';

@Component({
  selector: 'app-action-details-modal',
  templateUrl: './action-details-modal.page.html',
  styleUrls: ['./action-details-modal.page.scss'],
})
export class ActionDetailsModalPage implements OnInit {

	action = {} as Action;
	deadline: boolean;
	defineActionForm: FormGroup;
	monthLabels = [];
	dayLabels = [];
	edit: boolean = false;
	deadlineString: string;
	formatOptions: any;

  constructor(
  		public modalCtrl: ModalController,
	  	private navParams: NavParams,
	  	private db: DatabaseService,
	  	public translate: TranslateService,
      	public fb: FormBuilder,
      	private auth: AuthenticationService
      ) {
      this.action = this.navParams.get('action');
    this.deadline = !(!this.action.deadline);
    this.defineActionForm = this.fb.group({
    content: ['', Validators.required],
    priority: ['', Validators.required],
    time: ['', Validators.required]
    });
    this.translate.get(['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']).subscribe( monthLabels => {
      this.monthLabels = [
      monthLabels['Jan'],
      monthLabels['Feb'],
      monthLabels['Mar'],
      monthLabels['Apr'],
      monthLabels['May'],
      monthLabels['Jun'],
      monthLabels['Jul'],
      monthLabels['Aug'],
      monthLabels['Sep'],
      monthLabels['Oct'],
      monthLabels['Nov'],
      monthLabels['Dec']
      ];
    });
    this.translate.get(['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']).subscribe( dayLabels => {
      this.dayLabels = [
      dayLabels['Sun'],
      dayLabels['Mon'],
      dayLabels['Tue'],
      dayLabels['Wed'],
      dayLabels['Thu'],
      dayLabels['Fri'],
      dayLabels['Sat']
      ];
    });
    this.formatOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    this.deadlineString = new Date (this.action.deadline).toLocaleDateString(this.translate.currentLang, this.formatOptions);
  }

  ngOnInit() {
  }

  cancel() {
    this.modalCtrl.dismiss();
  }

  deleteAction(action: Action) {
    this.db.deleteAction(action, this.auth.userid);
    this.modalCtrl.dismiss();
  }

  saveAction() {
    console.log('go');
    console.log(this.action);
    if(this.action.deadline) {
      this.action.deadline = new Date (this.action.deadline).toISOString();
    }
    this.action.content = this.defineActionForm.value.content;
    this.action.priority = this.defineActionForm.value.priority;
    this.action.time = this.defineActionForm.value.time;
    let actionkey = this.action.key;
    this.db.editAction(this.action, this.auth.userid);
    this.action.key = actionkey;
    this.modalCtrl.dismiss();
  }

  editDeadline() {
    this.edit = true;
  }

  deadlineSelected(event) {
    let deadlineFixed = new Date (event).setHours(2);
    this.action.deadline = new Date (deadlineFixed);
    this.deadlineString = new Date (this.action.deadline).toLocaleDateString(this.translate.currentLang, this.formatOptions);
    this.edit = false;
    console.log('deadline');
    console.log(this.action);
  }

}
