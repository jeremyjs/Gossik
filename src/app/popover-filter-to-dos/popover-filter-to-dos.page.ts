import { Component, OnInit } from '@angular/core';
import { NavParams, PopoverController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-popover-filter-to-dos',
  templateUrl: './popover-filter-to-dos.page.html',
  styleUrls: ['./popover-filter-to-dos.page.scss'],
})
export class PopoverFilterToDosPage implements OnInit {

  goalArray: any;
  chosenGoalArray: any;
  attributeArray: any;
  chosenAttributeArray: any;

  constructor(
    public popoverCtrl: PopoverController,
    public translate: TranslateService,
    public navParams: NavParams
  ) { }

  ngOnInit() {
    this.goalArray = this.navParams.get('goalArray');
    this.chosenGoalArray = this.navParams.get('chosenGoalArray');
    this.attributeArray = this.navParams.get('attributeArray');
    this.chosenAttributeArray = this.navParams.get('chosenAttributeArray');
  }

  close() {
    this.popoverCtrl.dismiss();
  }

  clearAll() {
    this.chosenGoalArray = [];
    this.chosenAttributeArray = [];
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

  filter() {
  	this.popoverCtrl.dismiss({'chosenGoalArray': this.chosenGoalArray, 'chosenAttributeArray': this.chosenAttributeArray});
  }

}
