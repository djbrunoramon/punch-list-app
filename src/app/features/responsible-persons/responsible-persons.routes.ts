import { Routes } from '@angular/router';

export const RESPONSIBLE_PERSONS_ROUTES: Routes = [
  {
    path: '',
    title: 'responsiblePersons.title',
    loadComponent: () =>
      import('./pages/responsible-person-list.page').then((m) => m.ResponsiblePersonListPage),
  },
  {
    path: 'new',
    title: 'responsiblePersons.form.title.create',
    loadComponent: () =>
      import('./pages/responsible-person-form.page').then((m) => m.ResponsiblePersonFormPage),
  },
  {
    path: ':id',
    title: 'responsiblePersons.form.title.edit',
    loadComponent: () =>
      import('./pages/responsible-person-form.page').then((m) => m.ResponsiblePersonFormPage),
  },
];
