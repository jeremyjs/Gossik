import { Component, OnInit } from '@angular/core';
import { ModalController, AlertController } from '@ionic/angular';

import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-fivetodos-modal',
  templateUrl: './fivetodos-modal.page.html',
  styleUrls: ['./fivetodos-modal.page.scss'],
})
export class FivetodosModalPage implements OnInit {

  constructor(
  		public translate: TranslateService,
  		public modalCtrl: ModalController,
  		public alertCtrl: AlertController
  	) { }

  ngOnInit() {
  }

  cancel() {
  	this.modalCtrl.dismiss();
  }

}
