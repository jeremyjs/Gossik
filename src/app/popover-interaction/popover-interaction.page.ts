import { Component, OnInit } from '@angular/core';
import { NavParams, PopoverController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-popover-interaction',
  templateUrl: './popover-interaction.page.html',
  styleUrls: ['./popover-interaction.page.scss'],
})
export class PopoverInteractionPage implements OnInit {
  buttons: any[];
  text: any;
  title: string;

  constructor(
    public translate: TranslateService,
    public popoverCtrl: PopoverController,
    public navParams: NavParams
  ) { }

  ngOnInit() {
    this.buttons = this.navParams.get('buttons');
    this.text = this.navParams.get('text');
    this.title = this.navParams.get('title');
  }

  clickButton(button) {
    this.popoverCtrl.dismiss(button);
  }

}
