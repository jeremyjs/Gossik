import { Component, OnInit } from '@angular/core';
import { NavParams, ModalController, AlertController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { Goal } from '../../model/goal/goal.model';
import { Action } from '../../model/action/action.model';
import { DatabaseService } from '../services/database.service';
import { AuthenticationService } from '../services/authentication.service';

@Component({
  selector: 'app-tutorial-projects-modal',
  templateUrl: './tutorial-projects-modal.page.html',
  styleUrls: ['./tutorial-projects-modal.page.scss'],
})
export class TutorialProjectsModalPage implements OnInit {
	goalArray: Goal[] = [];
	actionArray: Action[] = [];
	goalDict: Goal[] = [];
	viewpoint: string = 'todo';
	todo = {} as Action;
	newProject = {} as Goal;
	projectColors = [];
	done: boolean = false;

  	constructor(
	  	public navParams: NavParams,
	  	public translate: TranslateService,
	  	public modalCtrl: ModalController,
	  	public alertCtrl: AlertController,
	  	public db: DatabaseService,
	  	private auth: AuthenticationService
  	) {
  	}

  	ngOnInit() {
	  	this.goalArray = this.navParams.get('goalArray');
	  	this.goalDict = this.navParams.get('goalDict');
	  	this.actionArray = this.navParams.get('actionArray');
  		this.projectColors = this.navParams.get('projectColors');
  		let tutorialProject = this.goalArray.find(goal => goal.key == 'tutorial');
  		let index = this.goalArray.indexOf(tutorialProject);
  		if(index != -1) {
  			this.goalArray.splice(index,1);
  		}
  	}

  	cancel() {
  		this.modalCtrl.dismiss();
  	}

  	assignProject(todo) {
  		this.todo = todo;
  		this.viewpoint = 'project';
  	}

  	chooseGoal(goal) {
  		this.todo.goalid = goal.key;
  		this.viewpoint = 'todo';
  		this.checkIfDone()
  	}

  	checkIfDone() {
  		let numberAssigned: number = 0;
  		for(let todo of this.actionArray) {
  			if(todo.goalid != 'tutorial') {
  				numberAssigned += 1;
  			}
  		}
  		if(numberAssigned == this.actionArray.length) {
  			this.done = true;
  		}
  	}

  	assign() {
  		for(let todo of this.actionArray) {
  			this.db.editAction(todo, this.auth.userid);
  		}
  		this.modalCtrl.dismiss('assigned');
  	}

  	createProject() {
	  	for(let goal of this.goalArray) {
	  		if(goal.name == this.newProject.name) {
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
	    if(this.newProject.name !== '' && this.newProject.name !== null && this.newProject.name !== undefined) {
			this.newProject.userid = this.auth.userid;
			this.newProject.active = true;
			let numberGoals = this.goalArray.length;
			let colorFound = false;
			while(!colorFound) {
				for(let color of this.projectColors) {
					if(!this.goalArray.find(goal => goal.color == color)) {
						this.newProject.color = color;
						colorFound = true;
					}
				}
				if(!colorFound) {
					this.newProject.color = '#FFFFFF';
					colorFound = true;
				}
			}
			this.db.addGoal(this.newProject, this.auth.userid).then( goal => {
				this.newProject.key = goal.key;
				this.goalArray.push(this.newProject);
				this.goalDict[this.newProject.key] = this.newProject;
				this.newProject = {} as Goal;
				if(this.goalArray.length <= 2) {
					this.translate.get(["A new project has been created and is shown below. Click on it to assign the todo to this project.", "OK", "Delete"]).subscribe( translation => {
				  		this.alertCtrl.create({
							message: translation["A new project has been created and is shown below. Click on it to assign the todo to this project."],
							buttons: [
								    	{
									        text: translation["OK"]
								      	},
								    ]
						}).then( alert => {
							alert.present();
						});
					});
				}
			});
		}
  	}

}
