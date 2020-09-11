import { Component, OnInit } from '@angular/core';
import { NavParams, ModalController, AlertController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { Goal } from '../../model/goal/goal.model';

@Component({
  selector: 'app-to-do-filter-modal',
  templateUrl: './to-do-filter-modal.page.html',
  styleUrls: ['./to-do-filter-modal.page.scss'],
})
export class ToDoFilterModalPage implements OnInit {
	goalArray = [];
  chosenGoalArray = [];
  attributeArray = [];
  chosenAttributeArray = [];
  view: string = 'projects';

  constructor(
  	public navParams: NavParams,
  	public translate: TranslateService,
  	public modalCtrl: ModalController,
  	public alertCtrl: AlertController
  	) { }

  ngOnInit() {
  	this.goalArray = this.navParams.get('goalArray');
    this.chosenGoalArray = this.navParams.get('goalKeyArray');
    this.attributeArray = this.navParams.get('attributeArray');
    this.chosenAttributeArray = this.navParams.get('chosenAttributeArray');
  }

  changeView(view) {
    this.view = view;
  }

  selectAll(view) {
    if(view == 'projects') {
      this.chosenGoalArray = this.goalArray.map(goal => goal.key);
      this.chosenGoalArray.push('unassigned');
    } else if(view == 'attributes') {
      this.chosenAttributeArray = this.attributeArray.map(attribute => attribute.content);
    }
  }

  clearAll(view) {
    if(view == 'projects') {
      this.chosenGoalArray = [];
    } else if(view == 'attributes') {
      this.chosenAttributeArray = [];
    }
  }

  chooseGoal(goalkey) {
  	if(this.chosenGoalArray.indexOf(goalkey) == -1) {
  		this.chosenGoalArray.push(goalkey)
  	} else {
  		this.chosenGoalArray.splice(this.chosenGoalArray.indexOf(goalkey), 1);
  	}
  }

  chooseAttribute(attribute) {
  	if(this.chosenAttributeArray.indexOf(attribute) == -1) {
  		this.chosenAttributeArray.push(attribute)
  	} else {
  		this.chosenAttributeArray.splice(this.chosenAttributeArray.indexOf(attribute), 1);
    }
  }

  cancel() {
    this.modalCtrl.dismiss();
  }

  filter() {
  	this.modalCtrl.dismiss({chosenGoalArray: this.chosenGoalArray, chosenAttributeArray: this.chosenAttributeArray});
  }

}