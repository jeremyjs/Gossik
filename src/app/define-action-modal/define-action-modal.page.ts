import { Component, OnInit } from '@angular/core';
import { NavParams, ModalController, AlertController } from '@ionic/angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { TranslateService } from '@ngx-translate/core';
import { Capture } from '../../model/capture/capture.model';

@Component({
  selector: 'app-define-action-modal',
  templateUrl: './define-action-modal.page.html',
  styleUrls: ['./define-action-modal.page.scss'],
})
export class DefineActionModalPage implements OnInit {

  hasDeadline: boolean;
	deadline: string = '';
	defineActionForm: FormGroup;
	capture = {} as Capture;
	monthLabels = [];
	dayLabels = [];
  pastCheck: boolean;
  goalname: string;

  constructor(
  	public navParams: NavParams,
  	public modalCtrl: ModalController,
  	public translate: TranslateService,
  	public fb: FormBuilder,
    public alertCtrl: AlertController
  	) {
  }

  ngOnInit() {
    if(this.navParams.get('capture')) {
      this.capture = this.navParams.get('capture');
    } else {
      this.capture = {} as Capture;
    }
    if(this.navParams.get('goal')) {
      this.goalname = this.navParams.get('goal');
    }
    this.defineActionForm = this.fb.group({
    content: [this.capture.content, Validators.required],
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
    this.pastCheck = false;
  }

  ionFocus(event){
    event.target.firstChild.placeholder = '';
  }


  cancel() {
    this.modalCtrl.dismiss('cancel');
  }

  check() {
    if(this.deadline) {
      if(new Date(this.deadline) < new Date() && !this.pastCheck) {
        this.translate.get(["The selected date lies in the past. Please check if that is wanted.", "Ok"]).subscribe( alertMessage => {
          this.alertCtrl.create({
              message: alertMessage["The selected date lies in the past. Please check if that is wanted."],
              buttons: [
                      {
                          text: alertMessage["Ok"]
                        }
                    ]
          }).then ( alert => {
            alert.present();
            this.pastCheck = true
          });
        });
      } else {
        this.save();
      }
    } else {
      this.save();
    }
  }

  save() {
  	this.modalCtrl.dismiss({content: this.defineActionForm.value.content, deadline: this.deadline})
  }

  deadlineSelected(event) {
    let deadlineFixed = new Date (event).setHours(2);
    this.deadline = new Date (deadlineFixed).toISOString();
  }

}
