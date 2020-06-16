import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)},
  { path: 'home/capture', loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)},
  { path: 'home/todo', loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)},
  { path: 'home/projects', loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)},
  { path: 'home/calendar', loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)},
  { path: 'home/settings', loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)},
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
  {
    path: 'change-week-modal',
    loadChildren: () => import('./change-week-modal/change-week-modal.module').then( m => m.ChangeWeekModalPageModule)
  },
  {
    path: 'privacy-policy',
    loadChildren: () => import('./privacy-policy/privacy-policy.module').then( m => m.PrivacyPolicyPageModule)
  },
  {
    path: 'assign-project-modal',
    loadChildren: () => import('./assign-project-modal/assign-project-modal.module').then( m => m.AssignProjectModalPageModule)
  },
  {
    path: 'to-do-filter-modal',
    loadChildren: () => import('./to-do-filter-modal/to-do-filter-modal.module').then( m => m.ToDoFilterModalPageModule)
  },
  {
    path: 'fivetodos-modal',
    loadChildren: () => import('./fivetodos-modal/fivetodos-modal.module').then( m => m.FivetodosModalPageModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules, onSameUrlNavigation: 'reload' })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
