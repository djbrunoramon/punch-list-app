import { Routes } from '@angular/router';

export const CONTRACTS_ROUTES: Routes = [
  {
    path: '',
    title: 'contracts.title',
    loadComponent: () => import('./pages/contract-list.page').then((m) => m.ContractListPage),
  },
  {
    path: 'new',
    title: 'contracts.form.title.create',
    loadComponent: () => import('./pages/contract-form.page').then((m) => m.ContractFormPage),
  },
  {
    path: ':id',
    title: 'contracts.form.title.edit',
    loadComponent: () => import('./pages/contract-form.page').then((m) => m.ContractFormPage),
  },
];
