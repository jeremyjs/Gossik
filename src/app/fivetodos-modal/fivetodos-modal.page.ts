import { Component, OnInit } from '@angular/core';
import { ModalController, AlertController } from '@ionic/angular';

import { Action } from '../../model/action/action.model';

import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-fivetodos-modal',
  templateUrl: './fivetodos-modal.page.html',
  styleUrls: ['./fivetodos-modal.page.scss'],
})
export class FivetodosModalPage implements OnInit {
	todos: Action[] = [];
	showDone: boolean = false;

  constructor(
  		public translate: TranslateService,
  		public modalCtrl: ModalController,
  		public alertCtrl: AlertController
  	) { 
  		this.todos.push({} as Action);
  		this.todos.push({} as Action);
  		this.todos.push({} as Action);
  		this.todos.push({} as Action);
  		this.todos.push({} as Action);
  }

  ngOnInit() {
  }

  ionChange() {
  	if(this.todos[0].content && this.todos[1].content && this.todos[2].content && this.todos[3].content  && this.todos[4].content && this.todos[0].content != '' && this.todos[1].content != '' && this.todos[2].content != '' && this.todos[3].content != ''  && this.todos[4].content != '') {
  		this.showDone = true;
  	} else {
  		this.showDone = false;
  	}
  }

  cancel() {
  	this.modalCtrl.dismiss();
  }

  defineTodos() {
  	this.modalCtrl.dismiss(this.todos);
  }

}
