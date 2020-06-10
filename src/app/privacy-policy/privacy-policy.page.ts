import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-privacy-policy',
  templateUrl: './privacy-policy.page.html',
  styleUrls: ['./privacy-policy.page.scss'],
})
export class PrivacyPolicyPage implements OnInit {

  constructor(
  	public translate: TranslateService,
  	private router: Router
  	) { }

  ngOnInit() {
  }

  goBack() {
  	this.router.navigate(['home/settings'], { replaceUrl: true });
  }

}
