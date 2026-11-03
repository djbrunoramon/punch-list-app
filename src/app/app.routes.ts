import { Routes } from '@angular/router';
import { Shell } from './core/layout/shell';

const underConstruction = () =>
  import('./shared/ui/under-construction.page').then((m) => m.UnderConstructionPage);

export const routes: Routes = [
  {
    path: '',
    component: Shell,
    children: [
      { path: '', pathMatch: 'full', title: 'Dashboard', loadComponent: underConstruction },
      {
        path: 'contracts',
        loadChildren: () =>
          import('./features/contracts/contracts.routes').then((m) => m.CONTRACTS_ROUTES),
      },
      {
        path: 'responsible-persons',
        title: 'Responsible persons',
        loadComponent: underConstruction,
      },
      { path: 'pendencies', title: 'Pendencies', loadComponent: underConstruction },

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
