import { Component, OnInit } from '@angular/core';
import { NavParams, PopoverController } from '@ionic/angular';
import { Attribute } from 'src/model/attribute/attribute.model';

@Component({
  selector: 'app-popover-add-attribute',
  templateUrl: './popover-add-attribute.page.html',
  styleUrls: ['./popover-add-attribute.page.scss'],
})
export class PopoverAddAttributePage implements OnInit {

  attribute: Attribute;
  type: string;
  changed: boolean = false;

  constructor(
    public navParams: NavParams,
    public popoverCtrl: PopoverController
  ) { }

  ngOnInit() {
    if(this.navParams.get('attribute')) {
      this.type = 'show';
      this.attribute = this.navParams.get('attribute');
    }
  }

  cancel() {
    this.popoverCtrl.dismiss();
  }

  save() {
    this.popoverCtrl.dismiss(this.attribute);
  }

  delete() {
    this.popoverCtrl.dismiss('delete');
  }

  change() {
    this.changed = true;
  }

}
