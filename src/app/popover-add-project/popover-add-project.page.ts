import { Component, OnInit } from '@angular/core';
import { NavParams, PopoverController } from '@ionic/angular';

import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-popover-add-project',
  templateUrl: './popover-add-project.page.html',
  styleUrls: ['./popover-add-project.page.scss'],
})
export class PopoverAddProjectPage implements OnInit {

  projectName: string;
  project: any = {name: ''};
  type: string = 'add';
  changed: boolean = false;
  projectColors: string[];

  constructor(
    public popoverCtrl: PopoverController,
    public translate: TranslateService,
    public navParams: NavParams
  ) { }

  ngOnInit() {
    if(this.navParams.get('project')) {
      this.project = this.navParams.get('project');
      this.type = 'show';
    }
    this.projectColors = this.navParams.get('projectColors');
  }

  cancel() {
    this.popoverCtrl.dismiss();
  }

  save() {
    this.popoverCtrl.dismiss(this.project);
  }

  change() {
    this.changed = true;
  }

  delete() {
    this.popoverCtrl.dismiss('delete');
  }

  assignColor(color: string) {
    this.project.color = color;
    this.changed = true;
  }

}
