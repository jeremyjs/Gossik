import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { TranslateService } from '@ngx-translate/core';
import { AuthenticationService } from './services/authentication.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {

  loggedin: boolean = false;

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private translate: TranslateService,
    private router: Router,
    private auth: AuthenticationService
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      let language = this.translate.getBrowserLang();
      let availableLanguages: string[] = ['de', 'en'];
      if(availableLanguages.indexOf(language) == -1) {
          language = 'en';
      }
      this.translate.use(language);
      //this.translate.use('en');
      this.auth.afAuth.authState
      .subscribe(
        user => {
          if (user) {
            this.loggedin = true;
          }
      });
    });
  }

  goToPage(path: string) {
    this.router.navigate([path], { replaceUrl: true });
  }
}
