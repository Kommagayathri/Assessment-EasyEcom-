import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Company } from '../models/company.model';

@Injectable({
  providedIn: 'root'
})
export class CompanyService {
  private companies: Company[] = [];
  private companiesSubject = new BehaviorSubject<Company[]>([]);
  public companies$ = this.companiesSubject.asObservable();

  constructor() {
    // Load from localStorage on initialization
    this.loadFromStorage();
  }

  private loadFromStorage(): void {
    const stored = localStorage.getItem('companies');
    if (stored) {
      this.companies = JSON.parse(stored);
      this.companiesSubject.next(this.companies);
    }
  }

  private saveToStorage(): void {
    localStorage.setItem('companies', JSON.stringify(this.companies));
  }

  getCompanies(): Observable<Company[]> {
    return this.companies$;
  }

  getCompanyById(id: string): Company | undefined {
    return this.companies.find(company => company.id === id);
  }

  addCompany(company: Company): void {
    company.id = this.generateId();
    company.createdAt = new Date();
    this.companies.push(company);
    this.companiesSubject.next([...this.companies]);
    this.saveToStorage();
  }

  updateCompany(id: string, updatedCompany: Company): void {
    const index = this.companies.findIndex(company => company.id === id);
    if (index !== -1) {
      updatedCompany.id = id;
      updatedCompany.createdAt = this.companies[index].createdAt;
      this.companies[index] = updatedCompany;
      this.companiesSubject.next([...this.companies]);
      this.saveToStorage();
    }
  }

  deleteCompany(id: string): void {
    this.companies = this.companies.filter(company => company.id !== id);
    this.companiesSubject.next([...this.companies]);
    this.saveToStorage();
  }

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }
}