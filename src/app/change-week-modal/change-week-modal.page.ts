import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-change-week-modal',
  templateUrl: './change-week-modal.page.html',
  styleUrls: ['./change-week-modal.page.scss'],
})
export class ChangeWeekModalPage implements OnInit {

	monthLabels = [];
	dayLabels = [];
	formatOptions: any;

  constructor(
  	private modalCtrl: ModalController,
  	public translate: TranslateService
  	) { 
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
  }

  ngOnInit() {
  }

  dateSelected(date) {
  	this.modalCtrl.dismiss(date);
  }

  cancel() {
    this.modalCtrl.dismiss();
  }

}
