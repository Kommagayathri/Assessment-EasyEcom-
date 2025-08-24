import { CommonModule } from '@angular/common';
import { Component, forwardRef, Input } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-virtual-scroll-select',
  imports: [CommonModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => VirtualScrollSelectComponent),
      multi: true
    }
  ],
  templateUrl: './virtual-scroll-select.component.html',
  styleUrl: './virtual-scroll-select.component.css'
})
export class VirtualScrollSelectComponent {
  @Input() options: string[] = [];
  @Input() placeholder = 'Select an option';
  @Input() disabled = false;

  value = '';
  isOpen = false;
  filteredOptions: string[] = [];
  searchTerm = '';
  
  private onChange = (value: any) => {};
  private onTouched = () => {};

  ngOnInit(): void {
    this.filteredOptions = [...this.options];
  }

  writeValue(value: any): void {
    this.value = value || '';
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  toggle(): void {
    if (this.disabled) return;
    this.isOpen = !this.isOpen;
    if (this.isOpen) {
      this.filteredOptions = [...this.options];
    }
  }

  selectOption(option: string): void {
    this.value = option;
    this.isOpen = false;
    this.onChange(option);
    this.onTouched();
  }

  onSearch(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.searchTerm = target.value.toLowerCase();
    this.filteredOptions = this.options.filter(option =>
      option.toLowerCase().includes(this.searchTerm)
    );
  }

  onBlur(): void {
    // Delay to allow option selection
    setTimeout(() => {
      this.isOpen = false;
      this.onTouched();
    }, 200);
  }
  trackByOption(index: number, option: string): string {
    return option;
  }
}
