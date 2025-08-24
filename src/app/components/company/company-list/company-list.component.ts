import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ConfirmationDialogComponent } from '../../shared/confirmation-dialog/confirmation-dialog.component';
import { CompanyService } from '../../../services/company.service';
import { Company } from '../../../models/company.model';

@Component({
  selector: 'app-company-list',
  imports: [CommonModule, RouterModule, ConfirmationDialogComponent],
  templateUrl: './company-list.component.html',
  styleUrl: './company-list.component.css'
})
export class CompanyListComponent {
  companies: Company[] = [];
  showDeleteDialog = false;
  companyToDelete: string | null = null;

  constructor(private companyService: CompanyService) {}

  ngOnInit(): void {
    this.companyService.getCompanies().subscribe(companies => {
      this.companies = companies;
    });
  }

  confirmDelete(companyId: string): void {
    this.companyToDelete = companyId;
    this.showDeleteDialog = true;
  }

  onDeleteConfirm(): void {
    if (this.companyToDelete) {
      this.companyService.deleteCompany(this.companyToDelete);
      this.companyToDelete = null;
    }
    this.showDeleteDialog = false;
  }

  onDeleteCancel(): void {
    this.companyToDelete = null;
    this.showDeleteDialog = false;
  }

  formatDate(date: Date | undefined): string {
    if (!date) return '';
    return new Date(date).toLocaleDateString();
  }
}
