import { Routes } from '@angular/router';

export const PENDENCIES_ROUTES: Routes = [
  {
    path: '',
    title: 'Pendencies',
    loadComponent: () => import('./pages/pendency-list.page').then((m) => m.PendencyListPage),
  },
  {
    path: 'new',
    title: 'New pendency',
    loadComponent: () => import('./pages/pendency-form.page').then((m) => m.PendencyFormPage),
  },
  {
    path: ':id',
    title: 'Edit pendency',
    loadComponent: () => import('./pages/pendency-form.page').then((m) => m.PendencyFormPage),
  },
];
