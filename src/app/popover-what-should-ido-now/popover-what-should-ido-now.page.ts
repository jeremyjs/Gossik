import { Component, OnInit } from '@angular/core';
import { NavParams, PopoverController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { Action } from 'src/model/action/action.model';

@Component({
  selector: 'app-popover-what-should-ido-now',
  templateUrl: './popover-what-should-ido-now.page.html',
  styleUrls: ['./popover-what-should-ido-now.page.scss'],
})
export class PopoverWhatShouldIDoNowPage implements OnInit {

  doableActionArray: Action[] = [];
  goalDict: {} = {};
  priorities: any[] = [];

  constructor(
    public translate: TranslateService,
    public popoverCtrl: PopoverController,
    public navParams: NavParams
  ) { }

  ngOnInit() {
    this.doableActionArray = this.navParams.get('doableActionArray');
    this.goalDict = this.navParams.get('goalDict');
    this.priorities = this.navParams.get('priorities');
  }

  dateFormated(date) {
		return new Date(date).toLocaleDateString();
  }
  
  showNext() {
    if(this.doableActionArray.length > 1) {
      this.doableActionArray.shift();
    }
  }

}
