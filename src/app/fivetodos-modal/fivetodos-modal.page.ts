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
  }

  ngOnInit() {
  	this.translate.get(["I am the first intelligent tool to help you get your things done. But for this, I need to know what needs to be done. As a start, tell me some things that you need to do in the coming days", "OK"]).subscribe( translation => {
		this.alertCtrl.create({
			message: translation["I am the first intelligent tool to help you get your things done. But for this, I need to know what needs to be done. As a start, tell me some things that you need to do in the coming days"],
			buttons: [
				    	{
					        text: translation["OK"]
				      	}
				    ]
		}).then( alert => {
			alert.present();
		});
	});
  }

  ionChange() {
  	if(this.todos.every(todo => todo.content && todo.content != '')) {
  		this.showDone = true;
  	} else {
  		this.showDone = false;
  	}
  }

  addTodo() {
  	this.todos.push({} as Action);
  }

  deleteTodo(todo) {
  	let index = this.todos.indexOf(todo);
	this.todos.splice(index,1);
  }

  cancel() {
  	this.modalCtrl.dismiss();
  }

  defineTodos() {
  	this.modalCtrl.dismiss(this.todos);
  }

}
