import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormField, form } from '@angular/forms/signals';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { TuiButton, TuiInput, TuiLoader } from '@taiga-ui/core';
import { TuiSelect } from '@taiga-ui/kit';
import { Contract } from '../../features/contracts/data-access/contracts.models';
import { ContractContext } from '../contract-context/contract-context';
import { ThemeToggle } from '../theme/theme-toggle';

interface NavLink {
  path: string;
  label: string;
  exact: boolean;
}

@Component({
  selector: 'app-shell',
  imports: [
    ThemeToggle,
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    FormField,
    TuiButton,
    TuiInput,
    TuiLoader,
    TuiSelect,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './shell.html',
  styleUrl: './shell.scss',
})
export class Shell {
  protected readonly context = inject(ContractContext);

  /** The selector edits `ContractContext.selected` directly. */
  protected readonly selection = form(this.context.selected);

  protected readonly links: readonly NavLink[] = [
    { path: '/', label: 'Dashboard', exact: true },
    { path: '/contracts', label: 'Contracts', exact: false },
    { path: '/responsible-persons', label: 'Responsible persons', exact: false },
    { path: '/pendencies', label: 'Pendencies', exact: false },
  ];

  protected readonly stringify = (contract: Contract | null): string =>
    contract ? `${contract.numberContract} — ${contract.description}` : '';

  protected readonly sameContract = (a: Contract | null, b: Contract | null): boolean =>
    a?.id === b?.id;
}
