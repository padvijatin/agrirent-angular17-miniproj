import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { FormBuilder, FormGroupDirective, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ContactService } from '../../core/services/contact.service';

@Component({
  selector: 'app-contact-us',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule
  ],
  templateUrl: './contact-us.component.html',
  styleUrl: './contact-us.component.css'
})
export class ContactUsComponent {
  isSubmitting = false;
  successMessage = '';
  errorMessage = '';

  contactForm = this.fb.group({
    fullName: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    phone: [''],
    subject: ['', Validators.required],
    message: ['', [Validators.required, Validators.minLength(10)]]
  });

  constructor(
    private readonly fb: FormBuilder,
    private readonly contactService: ContactService
  ) {}

  async submitForm(formDirective?: FormGroupDirective) {
    this.successMessage = '';
    this.errorMessage = '';

    if (this.contactForm.invalid || this.isSubmitting) {
      this.contactForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;

    try {
      const formValue = this.contactForm.getRawValue();

      const response = await this.contactService.submitContactForm({
        fullName: (formValue.fullName || '').trim(),
        email: (formValue.email || '').trim(),
        phone: (formValue.phone || '').trim(),
        subject: (formValue.subject || '').trim(),
        message: (formValue.message || '').trim()
      });

      this.successMessage = response.message;
      formDirective?.resetForm({
        fullName: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      });
    } catch (error) {
      this.errorMessage = this.getErrorMessage(error);
    } finally {
      this.isSubmitting = false;
    }
  }

  private getErrorMessage(error: unknown) {
    if (error instanceof HttpErrorResponse) {
      return error.error?.message || 'Could not send your message right now.';
    }

    return 'Could not send your message right now.';
  }
}
