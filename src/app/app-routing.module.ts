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
  { path: 'home/privacy-policy', loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)},
  { path: 'home/rerun-tutorial', loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)},
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
  {
    path: 'tutorial-projects-modal',
    loadChildren: () => import('./tutorial-projects-modal/tutorial-projects-modal.module').then( m => m.TutorialProjectsModalPageModule)
  },
  {
    path: 'popover-add',
    loadChildren: () => import('./popover-add/popover-add.module').then( m => m.PopoverAddPageModule)
  },
  {
    path: 'popover-add-project',
    loadChildren: () => import('./popover-add-project/popover-add-project.module').then( m => m.PopoverAddProjectPageModule)
  },
  {
    path: 'popover-add-thought',
    loadChildren: () => import('./popover-add-thought/popover-add-thought.module').then( m => m.PopoverAddThoughtPageModule)
  },
  {
    path: 'popover-add-to-do',
    loadChildren: () => import('./popover-add-to-do/popover-add-to-do.module').then( m => m.PopoverAddToDoPageModule)
  },
  {
    path: 'popover-add-calendar-event',
    loadChildren: () => import('./popover-add-calendar-event/popover-add-calendar-event.module').then( m => m.PopoverAddCalendarEventPageModule)
  },
  {
    path: 'popover-finish-to-do',
    loadChildren: () => import('./popover-finish-to-do/popover-finish-to-do.module').then( m => m.PopoverFinishToDoPageModule)
  },
  {
    path: 'popover-filter-to-dos',
    loadChildren: () => import('./popover-filter-to-dos/popover-filter-to-dos.module').then( m => m.PopoverFilterToDosPageModule)
  },
  {
    path: 'popover-interaction',
    loadChildren: () => import('./popover-interaction/popover-interaction.module').then( m => m.PopoverInteractionPageModule)
  },  {
    path: 'popover-add-attribute',
    loadChildren: () => import('./popover-add-attribute/popover-add-attribute.module').then( m => m.PopoverAddAttributePageModule)
  },



];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules, onSameUrlNavigation: 'reload' })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
