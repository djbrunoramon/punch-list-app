import { Routes } from '@angular/router';

export const RESPONSIBLE_PERSONS_ROUTES: Routes = [
  {
    path: '',
    title: 'Responsible persons',
    loadComponent: () =>
      import('./pages/responsible-person-list.page').then((m) => m.ResponsiblePersonListPage),
  },
  {
    path: 'new',
    title: 'New responsible person',
    loadComponent: () =>
      import('./pages/responsible-person-form.page').then((m) => m.ResponsiblePersonFormPage),
  },
  {
    path: ':id',
    title: 'Edit responsible person',
    loadComponent: () =>
      import('./pages/responsible-person-form.page').then((m) => m.ResponsiblePersonFormPage),
  },
];
