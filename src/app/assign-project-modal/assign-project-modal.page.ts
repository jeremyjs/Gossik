import { Component, OnInit } from '@angular/core';
import { NavParams, ModalController, AlertController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { Goal } from '../../model/goal/goal.model';

@Component({
  selector: 'app-assign-project-modal',
  templateUrl: './assign-project-modal.page.html',
  styleUrls: ['./assign-project-modal.page.scss'],
})
export class AssignProjectModalPage implements OnInit {
	goalArray = [];
	chosenGoal = {} as Goal;

  constructor(
  	public navParams: NavParams,
  	public translate: TranslateService,
  	public modalCtrl: ModalController,
  	public alertCtrl: AlertController
  	) { }

  ngOnInit() {
  	this.goalArray = this.navParams.get('goalArray');
  }

  chooseGoal(goal) {
  	this.chosenGoal = goal;
  }

  assign() {
  	if(this.chosenGoal.key){
  		this.modalCtrl.dismiss(this.chosenGoal);
  	} else {
  		this.translate.get(["Please choose a project to assign.", "Ok"]).subscribe( alertMessage => {
		  this.alertCtrl.create({
		      message: alertMessage["Please choose a project to assign."],
		      buttons: [
		              {
		                  text: alertMessage["Ok"]
		                }
		            ]
		  }).then( alert => {
		    alert.present();
		  });
		});
  	}
  }

}
