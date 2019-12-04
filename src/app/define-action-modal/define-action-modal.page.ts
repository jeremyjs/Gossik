import { Component, OnInit } from '@angular/core';
import { NavParams, ModalController } from '@ionic/angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { TranslateService } from '@ngx-translate/core';
import { Capture } from '../../model/capture/capture.model';

@Component({
  selector: 'app-define-action-modal',
  templateUrl: './define-action-modal.page.html',
  styleUrls: ['./define-action-modal.page.scss'],
})
export class DefineActionModalPage implements OnInit {

	deadline: boolean;
	defineActionForm: FormGroup;
	capture = {} as Capture;
	monthLabels = [];
	dayLabels = [];

  constructor(
  	public navParams: NavParams,
  	public modalCtrl: ModalController,
  	public translate: TranslateService,
  	public fb: FormBuilder
  	) {
  	if(this.navParams.get('capture')) {
      this.capture = this.navParams.get('capture');
    } else {
      this.capture = {} as Capture;
    }
  	this.defineActionForm = this.fb.group({
		content: ['', Validators.required],
		priority: ['', Validators.required],
		deadline: ['', Validators.required],
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
  }

  ngOnInit() {
  }


  cancel() {
    this.modalCtrl.dismiss('cancel');
  }

  addAction() {
  	this.modalCtrl.dismiss(this.defineActionForm.value)
  }

  deadlineSelected(event) {
    let deadlineFixed = new Date (event).setHours(2);
    this.defineActionForm.value.deadline = new Date (deadlineFixed).toISOString();
  }

}
