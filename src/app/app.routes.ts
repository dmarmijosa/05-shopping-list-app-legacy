import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'shopping-list',
    loadComponent: () => import('./pages/shopping-list/shopping-list.page').then( m => m.ShoppingListPage)
  },
  {
    path: '',
    redirectTo: 'shopping-list',
    pathMatch: 'full',
  }
];
