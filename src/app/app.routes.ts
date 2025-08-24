import { Routes } from '@angular/router';
import { CompanyListComponent } from './components/company/company-list/company-list.component';
import { CompanyFormComponent } from './components/company/company-form/company-form.component';

export const routes: Routes = [
  { path: '', redirectTo: '/companies', pathMatch: 'full' },
  { path: 'companies', component: CompanyListComponent },
  { path: 'companies/new', component: CompanyFormComponent },
  { path: 'companies/edit/:id', component: CompanyFormComponent },
  { path: '**', redirectTo: '/companies' }
];