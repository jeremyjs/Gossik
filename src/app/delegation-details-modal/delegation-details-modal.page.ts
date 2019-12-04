import { Component, OnInit } from '@angular/core';
import { NavParams, ModalController } from '@ionic/angular';

import { Delegation } from '../../model/delegation/delegation.model';

import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { TranslateService } from '@ngx-translate/core';

import { DatabaseService } from '../services/database.service';
import { AuthenticationService } from '../services/authentication.service';

@Component({
  selector: 'app-delegation-details-modal',
  templateUrl: './delegation-details-modal.page.html',
  styleUrls: ['./delegation-details-modal.page.scss'],
})
export class DelegationDetailsModalPage implements OnInit {
	delegation = {} as Delegation;
	deadline: boolean;
	defineDelegationForm: FormGroup;
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
  	this.delegation = this.navParams.get('delegation');
    this.defineDelegationForm = this.fb.group({
      content: ['', Validators.required]
    });
    if(!this.delegation.deadline) {
      this.delegation.deadline = '';
    }
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
    this.deadlineString = new Date (this.delegation.deadline).toLocaleDateString(this.translate.currentLang, this.formatOptions);
  }

  ngOnInit() {
  }

  cancel() {
    this.modalCtrl.dismiss();
  }

  deleteDelegation() {
  	this.db.deleteDelegation(this.delegation, this.auth.userid);
  	this.modalCtrl.dismiss();
  }

  saveDelegation() {
    if(this.delegation.deadline) {
      this.delegation.deadline = new Date (this.delegation.deadline).toISOString();
    }
    this.delegation.content = this.defineDelegationForm.value.content;
    let delegationkey = this.delegation.key;
    this.db.editDelegation(this.delegation, this.auth.userid);
    this.delegation.key = delegationkey;
    this.modalCtrl.dismiss();
  }

  editDeadline() {
    this.edit = true;
  }

  deadlineSelected(event) {
    let deadlineFixed = new Date (event).setHours(2);
    this.delegation.deadline = new Date (deadlineFixed);
    this.deadlineString = new Date (this.delegation.deadline).toLocaleDateString(this.translate.currentLang, this.formatOptions);
    this.edit = false;
  }

}
