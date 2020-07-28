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

  constructor(
  		public translate: TranslateService,
  		public modalCtrl: ModalController,
  		public alertCtrl: AlertController
  	) { 
  		this.todos.push({} as Action);
  }

  ngOnInit() {
  	this.translate.get(["fivetodosModalInit", "OK"]).subscribe( translation => {
		this.alertCtrl.create({
			message: translation["fivetodosModalInit"],
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
  	let checkTodos: boolean = false;
  	for(let todo of this.todos) {
  		if(todo.content) {
  			checkTodos = true;
  		}
  	}
  	if(checkTodos) {
   		this.modalCtrl.dismiss(this.todos);
   	} else {
   		this.translate.get(["Please define at least one to-do", "OK"]).subscribe( translation => {
			this.alertCtrl.create({
				message: translation["Please define at least one to-do"],
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
  }

}
