import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { VirtualScrollSelectComponent } from '../../shared/virtual-scroll-select/virtual-scroll-select.component';
import { Company, DESIGNATIONS, SKILLS } from '../../../models/company.model';
import { CompanyService } from '../../../services/company.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-company-form',
  imports: [CommonModule, ReactiveFormsModule, VirtualScrollSelectComponent],
  templateUrl: './company-form.component.html',
  styleUrl: './company-form.component.css'
})
export class CompanyFormComponent {
companyForm!: FormGroup;
  designations = DESIGNATIONS;
  skills = SKILLS;
  isEditMode = false;
  companyId: string | null = null;
  successMessage = '';

  constructor(
    private fb: FormBuilder,
    private companyService: CompanyService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.initializeForm();
  }

  ngOnInit(): void {
    this.companyId = this.route.snapshot.paramMap.get('id');
    if (this.companyId) {
      this.isEditMode = true;
      this.loadCompanyData();
    }
  }

  private initializeForm(): void {
    this.companyForm = this.fb.group({
      companyName: ['', [Validators.required, Validators.maxLength(50)]],
      address: [''],
      email: ['', [Validators.required, Validators.email, Validators.maxLength(100)]],
      phoneNumber: ['', [Validators.required, Validators.maxLength(15)]],
      empInfo: this.fb.array([this.createEmployeeForm()])
    });
  }

  private createEmployeeForm(): FormGroup {
    return this.fb.group({
      empName: ['', [Validators.required, Validators.maxLength(25)]],
      designation: ['', Validators.required],
      joinDate: ['', [Validators.required, this.pastDateValidator]],
      email: ['', [Validators.required, Validators.email, Validators.maxLength(100)]],
      phoneNumber: ['', [Validators.required, Validators.maxLength(15)]],
      skillInfo: this.fb.array([this.createSkillForm()]),
      educationInfo: this.fb.array([this.createEducationForm()])
    });
  }

  private createSkillForm(): FormGroup {
    return this.fb.group({
      skillName: ['', Validators.required],
      skillRating: ['', [Validators.required, Validators.min(1), Validators.max(5)]]
    });
  }

  private createEducationForm(): FormGroup {
    return this.fb.group({
      instituteName: ['', [Validators.required, Validators.maxLength(50)]],
      courseName: ['', [Validators.required, Validators.maxLength(25)]],
      completedYear: ['', [Validators.required, this.monthYearValidator]]
    });
  }

  private pastDateValidator(control: any) {
    if (!control.value) return null;
    const selectedDate = new Date(control.value);
    const today = new Date();
    return selectedDate <= today ? null : { futureDate: true };
  }

  private monthYearValidator(control: any) {
    if (!control.value) return null;
    const regex = /^(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s\d{4}$/;
    return regex.test(control.value) ? null : { invalidFormat: true };
  }

  get empInfoArray(): FormArray {
    return this.companyForm.get('empInfo') as FormArray;
  }

  getSkillInfoArray(empIndex: number): FormArray {
    return this.empInfoArray.at(empIndex).get('skillInfo') as FormArray;
  }

  getEducationInfoArray(empIndex: number): FormArray {
    return this.empInfoArray.at(empIndex).get('educationInfo') as FormArray;
  }

  addEmployee(): void {
    this.empInfoArray.push(this.createEmployeeForm());
  }

  removeEmployee(index: number): void {
    this.empInfoArray.removeAt(index);
  }

  addSkill(empIndex: number): void {
    this.getSkillInfoArray(empIndex).push(this.createSkillForm());
  }

  removeSkill(empIndex: number, skillIndex: number): void {
    this.getSkillInfoArray(empIndex).removeAt(skillIndex);
  }

  addEducation(empIndex: number): void {
    this.getEducationInfoArray(empIndex).push(this.createEducationForm());
  }

  removeEducation(empIndex: number, eduIndex: number): void {
    this.getEducationInfoArray(empIndex).removeAt(eduIndex);
  }

  private loadCompanyData(): void {
    if (this.companyId) {
      const company = this.companyService.getCompanyById(this.companyId);
      if (company) {
        this.populateForm(company);
      }
    }
  }

  private populateForm(company: Company): void {
    // Clear existing employee forms
    while (this.empInfoArray.length !== 0) {
      this.empInfoArray.removeAt(0);
    }

    // Set basic company info
    this.companyForm.patchValue({
      companyName: company.companyName,
      address: company.address,
      email: company.email,
      phoneNumber: company.phoneNumber
    });

    // Add employee forms
    company.empInfo.forEach(emp => {
      const empForm = this.createEmployeeForm();
      empForm.patchValue({
        empName: emp.empName,
        designation: emp.designation,
        joinDate: emp.joinDate,
        email: emp.email,
        phoneNumber: emp.phoneNumber
      });

      // Clear and populate skills
      const skillArray = empForm.get('skillInfo') as FormArray;
      while (skillArray.length !== 0) {
        skillArray.removeAt(0);
      }
      emp.skillInfo.forEach(skill => {
        skillArray.push(this.fb.group({
          skillName: [skill.skillName, Validators.required],
          skillRating: [skill.skillRating, [Validators.required, Validators.min(1), Validators.max(5)]]
        }));
      });

      // Clear and populate education
      const eduArray = empForm.get('educationInfo') as FormArray;
      while (eduArray.length !== 0) {
        eduArray.removeAt(0);
      }
      emp.educationInfo.forEach(edu => {
        eduArray.push(this.fb.group({
          instituteName: [edu.instituteName, [Validators.required, Validators.maxLength(50)]],
          courseName: [edu.courseName, [Validators.required, Validators.maxLength(25)]],
          completedYear: [edu.completedYear, [Validators.required, this.monthYearValidator]]
        }));
      });

      this.empInfoArray.push(empForm);
    });
  }

  onSubmit(): void {
    if (this.companyForm.valid) {
      const formData = this.companyForm.value;
      
      if (this.isEditMode && this.companyId) {
        this.companyService.updateCompany(this.companyId, formData);
      } else {
        this.companyService.addCompany(formData);
      }
      
      this.successMessage = 'Company details saved successfully.';
      setTimeout(() => {
        this.router.navigate(['/companies']);
      }, 2000);
    } else {
      this.markFormGroupTouched(this.companyForm);
    }
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.markAsTouched();

      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      } else if (control instanceof FormArray) {
        control.controls.forEach(ctrl => {
          if (ctrl instanceof FormGroup) {
            this.markFormGroupTouched(ctrl);
          }
        });
      }
    });
  }

  hasError(fieldName: string, empIndex?: number, arrayType?: 'skill' | 'education', arrayIndex?: number): boolean {
    if (empIndex !== undefined && arrayType && arrayIndex !== undefined) {
      const arrayControl = arrayType === 'skill' 
        ? this.getSkillInfoArray(empIndex) 
        : this.getEducationInfoArray(empIndex);
      const control = arrayControl.at(arrayIndex).get(fieldName);
      return !!(control?.invalid && control?.touched);
    } else if (empIndex !== undefined) {
      const control = this.empInfoArray.at(empIndex).get(fieldName);
      return !!(control?.invalid && control?.touched);
    } else {
      const control = this.companyForm.get(fieldName);
      return !!(control?.invalid && control?.touched);
    }
  }

  getErrorMessage(fieldName: string, empIndex?: number, arrayType?: 'skill' | 'education', arrayIndex?: number): string {
    let control;
    
    if (empIndex !== undefined && arrayType && arrayIndex !== undefined) {
      const arrayControl = arrayType === 'skill' 
        ? this.getSkillInfoArray(empIndex) 
        : this.getEducationInfoArray(empIndex);
      control = arrayControl.at(arrayIndex).get(fieldName);
    } else if (empIndex !== undefined) {
      control = this.empInfoArray.at(empIndex).get(fieldName);
    } else {
      control = this.companyForm.get(fieldName);
    }

    if (control?.errors) {
      if (control.errors['required']) return `${fieldName} is required`;
      if (control.errors['email']) return 'Invalid email format';
      if (control.errors['maxlength']) return `Maximum ${control.errors['maxlength'].requiredLength} characters allowed`;
      if (control.errors['min']) return `Minimum value is ${control.errors['min'].min}`;
      if (control.errors['max']) return `Maximum value is ${control.errors['max'].max}`;
      if (control.errors['futureDate']) return 'Only past dates are allowed';
      if (control.errors['invalidFormat']) return 'Format should be "Mar 2021"';
    }
    return '';
  }
}
