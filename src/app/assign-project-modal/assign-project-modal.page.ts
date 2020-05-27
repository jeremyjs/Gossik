import { Component, OnInit } from '@angular/core';
import { NavParams, ModalController, AlertController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { Goal } from '../../model/goal/goal.model';
import { DatabaseService } from '../services/database.service';
import { AuthenticationService } from '../services/authentication.service';

@Component({
  selector: 'app-assign-project-modal',
  templateUrl: './assign-project-modal.page.html',
  styleUrls: ['./assign-project-modal.page.scss'],
})
export class AssignProjectModalPage implements OnInit {
	goalArray = [];
	newProject: string;
	newGoal = {} as Goal;
	projectColors = [];


  constructor(
	  	public navParams: NavParams,
	  	public translate: TranslateService,
	  	public modalCtrl: ModalController,
	  	public alertCtrl: AlertController,
		private auth: AuthenticationService,
		public db: DatabaseService
  	) { }

  ngOnInit() {
  	this.goalArray = this.navParams.get('goalArray');
  	this.projectColors = this.navParams.get('projectColors');
  }

  chooseGoal(goal) {
  	this.modalCtrl.dismiss(goal);
  }

  createProject(project) {
  	for(let goal of this.goalArray) {
  		if (goal.name == project) {
  			this.translate.get(["You already have a goal with that name.", "Ok"]).subscribe( alertMessage => {
		  		this.alertCtrl.create({
					message: alertMessage["You already have a goal with that name."],
					buttons: [
						    	{
							        text: alertMessage["Ok"]
						      	}
						    ]
				}).then( alert => {
					alert.present();
				});
			});
		return;
  		}
  	}
    if(project !== '' && project !== null && project !== undefined) {
		this.newGoal.userid = this.auth.userid;
		this.newGoal.name = project;
		this.newGoal.active = true;
		let numberGoals = this.goalArray.length;
		let colorFound = false;
		while(!colorFound) {
			for(let color of this.projectColors) {
				if(!this.goalArray.find(goal => goal.color == color)) {
					this.newGoal.color = color;
					colorFound = true;
				}
			}
			if(!colorFound) {
				this.newGoal.color = '#FFFFFF';
				colorFound = true;
			}
		}
		this.db.addGoal(this.newGoal, this.auth.userid).then( goal => {
			this.newGoal.key = goal.key
		});
		this.goalArray.push(this.newGoal);
	}
	this.newProject = '';
  }

  ionFocus(event){
		event.target.firstChild.placeholder = '';
		this.translate.get(["Define new Goal"]).subscribe( translation => {
	  		if(this.newProject == translation["Define new goal"]) {
	  			this.newProject = '';
	  		}
		});
	}

}
