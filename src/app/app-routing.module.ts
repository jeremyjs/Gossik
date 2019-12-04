import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)},
  {
    path: 'action-details-modal',
    loadChildren: () => import('./action-details-modal/action-details-modal.module').then( m => m.ActionDetailsModalPageModule)
  },
  {
    path: 'calendar-event-modal',
    loadChildren: () => import('./calendar-event-modal/calendar-event-modal.module').then( m => m.CalendarEventModalPageModule)
  },
  {
    path: 'define-action-modal',
    loadChildren: () => import('./define-action-modal/define-action-modal.module').then( m => m.DefineActionModalPageModule)
  },
  {
    path: 'define-delegation-modal',
    loadChildren: () => import('./define-delegation-modal/define-delegation-modal.module').then( m => m.DefineDelegationModalPageModule)
  },
  {
    path: 'define-reference-modal',
    loadChildren: () => import('./define-reference-modal/define-reference-modal.module').then( m => m.DefineReferenceModalPageModule)
  },
  {
    path: 'delegation-details-modal',
    loadChildren: () => import('./delegation-details-modal/delegation-details-modal.module').then( m => m.DelegationDetailsModalPageModule)
  },
  {
    path: 'goal-details-modal',
    loadChildren: () => import('./goal-details-modal/goal-details-modal.module').then( m => m.GoalDetailsModalPageModule)
  },
  {
    path: 'reference-details-modal',
    loadChildren: () => import('./reference-details-modal/reference-details-modal.module').then( m => m.ReferenceDetailsModalPageModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
