import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

// ngx-translate stuff
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
export function setTranslateLoader(http: HttpClient) {
 return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

// Firebase stuff
import { environment } from '../environments/environment';
import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { AngularFireFunctionsModule, FUNCTIONS_REGION } from '@angular/fire/functions';


// Modal pages
import { ActionDetailsModalPageModule } from './action-details-modal/action-details-modal.module';
import { DelegationDetailsModalPageModule } from './delegation-details-modal/delegation-details-modal.module';
import { ReferenceDetailsModalPageModule } from './reference-details-modal/reference-details-modal.module';
import { DefineActionModalPageModule } from './define-action-modal/define-action-modal.module';
import { DefineDelegationModalPageModule } from './define-delegation-modal/define-delegation-modal.module';
import { DefineReferenceModalPageModule } from './define-reference-modal/define-reference-modal.module';
import { GoalDetailsModalPageModule } from './goal-details-modal/goal-details-modal.module';
import { CalendarEventModalPageModule } from './calendar-event-modal/calendar-event-modal.module';
import { ChangeWeekModalPageModule } from './change-week-modal/change-week-modal.module';
import { AssignProjectModalPageModule } from './assign-project-modal/assign-project-modal.module';
import { ToDoFilterModalPageModule } from './to-do-filter-modal/to-do-filter-modal.module';
import { FivetodosModalPageModule } from './fivetodos-modal/fivetodos-modal.module';
import { TutorialProjectsModalPageModule } from './tutorial-projects-modal/tutorial-projects-modal.module';

// Popover pages
import { PopoverAddPageModule } from './popover-add/popover-add.module';
import { PopoverAddProjectPageModule } from './popover-add-project/popover-add-project.module';
import { PopoverAddThoughtPageModule } from './popover-add-thought/popover-add-thought.module';
import { PopoverAddToDoPageModule } from './popover-add-to-do/popover-add-to-do.module';

import { DatePickerModule } from 'ionic4-date-picker';

import { NgCalendarModule  } from 'ionic2-calendar';

// Necessary for calendar translation
import { registerLocaleData } from '@angular/common';
import localeDe from '@angular/common/locales/de';
registerLocaleData(localeDe, 'de');


import { FirebaseX } from "@ionic-native/firebase-x/ngx";

import { Calendar } from '@ionic-native/calendar/ngx';


@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
  	BrowserModule,
  	IonicModule.forRoot(),
  	AppRoutingModule,
  	HttpClientModule,
  	TranslateModule.forRoot({
      loader: {
       provide: TranslateLoader,
       useFactory: (setTranslateLoader),
       deps: [HttpClient]
     }
    }),
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule,
    AngularFireDatabaseModule,
    ActionDetailsModalPageModule,
    DelegationDetailsModalPageModule,
    ReferenceDetailsModalPageModule,
    DefineActionModalPageModule,
    DefineDelegationModalPageModule,
    DefineReferenceModalPageModule,
    GoalDetailsModalPageModule,
    CalendarEventModalPageModule,
    ChangeWeekModalPageModule,
    AssignProjectModalPageModule,
    ToDoFilterModalPageModule,
    FivetodosModalPageModule,
    TutorialProjectsModalPageModule,
    DatePickerModule,
    NgCalendarModule,
    AngularFireFunctionsModule,
    PopoverAddPageModule,
    PopoverAddProjectPageModule,
    PopoverAddThoughtPageModule,
    PopoverAddToDoPageModule
  	],
  providers: [
    Calendar,
    FirebaseX,
    StatusBar,
    SplashScreen,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    { provide: FUNCTIONS_REGION, useValue: 'us-central1' }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
