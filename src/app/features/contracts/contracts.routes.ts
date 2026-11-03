import { Routes } from '@angular/router';

export const CONTRACTS_ROUTES: Routes = [
  {
    path: '',
    title: 'Contracts',
    loadComponent: () => import('./pages/contract-list.page').then((m) => m.ContractListPage),
  },
  {
    path: 'new',
    title: 'New contract',
    loadComponent: () => import('./pages/contract-form.page').then((m) => m.ContractFormPage),
  },
  {
    path: ':id',
    title: 'Edit contract',
    loadComponent: () => import('./pages/contract-form.page').then((m) => m.ContractFormPage),
  },
];
