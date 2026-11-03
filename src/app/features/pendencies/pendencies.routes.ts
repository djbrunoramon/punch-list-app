import { Routes } from '@angular/router';

export const PENDENCIES_ROUTES: Routes = [
  {
    path: '',
    title: 'pendencies.title',
    loadComponent: () => import('./pages/pendency-list.page').then((m) => m.PendencyListPage),
  },
  {
    path: 'new',
    title: 'pendencies.form.title.create',
    loadComponent: () => import('./pages/pendency-form.page').then((m) => m.PendencyFormPage),
  },
  {
    path: ':id',
    title: 'pendencies.form.title.edit',
    loadComponent: () => import('./pages/pendency-form.page').then((m) => m.PendencyFormPage),
  },
];
