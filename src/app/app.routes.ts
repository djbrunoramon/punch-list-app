import { Routes } from '@angular/router';
import { Shell } from './core/layout/shell';

export const routes: Routes = [
  {
    path: '',
    component: Shell,
    children: [
      {
        path: '',
        pathMatch: 'full',
        title: 'dashboard.title',
        loadComponent: () =>
          import('./features/dashboard/pages/dashboard.page').then((m) => m.DashboardPage),
      },
      {
        path: 'contracts',
        loadChildren: () =>
          import('./features/contracts/contracts.routes').then((m) => m.CONTRACTS_ROUTES),
      },
      {
        path: 'responsible-persons',
        loadChildren: () =>
          import('./features/responsible-persons/responsible-persons.routes').then(
            (m) => m.RESPONSIBLE_PERSONS_ROUTES,
          ),
      },
      {
        path: 'pendencies',
        loadChildren: () =>
          import('./features/pendencies/pendencies.routes').then((m) => m.PENDENCIES_ROUTES),
      },

      // Old (Angular 13) URLs
      { path: 'contract', redirectTo: 'contracts', pathMatch: 'full' },
      { path: 'contract/:id', redirectTo: 'contracts/:id' },
      { path: 'responsible-person', redirectTo: 'responsible-persons', pathMatch: 'full' },
      { path: 'responsible-person/:id', redirectTo: 'responsible-persons/:id' },
      { path: 'pendency', redirectTo: 'pendencies', pathMatch: 'full' },
      { path: 'pendency/:id', redirectTo: 'pendencies/:id' },

      { path: '**', redirectTo: '' },
    ],
  },
];
