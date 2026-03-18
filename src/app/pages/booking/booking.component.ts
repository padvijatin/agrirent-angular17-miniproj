import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';
import { BookingService } from '../../core/services/booking.service';

@Component({
  selector: 'app-booking',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatButtonModule,
    MatCardModule,
    MatDatepickerModule,
    MatDividerModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatNativeDateModule
  ],
  templateUrl: './booking.component.html',
  styleUrl: './booking.component.css'
})
export class BookingComponent implements OnInit {
  equipmentId = '';
  equipmentName = 'Selected Equipment';
  equipmentImage = '';
  pricePerDay = 0;
  location = '';
  isSubmitting = false;
  errorMessage = '';
  successMessage = '';
  today = this.getStartOfDay(new Date());

  bookingForm = this.fb.group({
    startDate: [null as Date | null, Validators.required],
    endDate: [null as Date | null, Validators.required]
  });

  constructor(
    private readonly fb: FormBuilder,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly bookingService: BookingService
  ) {}

  ngOnInit() {
    this.route.queryParamMap.subscribe((params) => {
      this.equipmentId = params.get('equipmentId') ?? '';
      this.equipmentName = params.get('name') ?? 'Selected Equipment';
      this.equipmentImage = params.get('imageUrl') ?? '';
      this.pricePerDay = Number(params.get('pricePerDay') ?? 0);
      this.location = params.get('location') ?? '';
    });
  }

  get totalDays() {
    const startDate = this.bookingForm.value.startDate;
    const endDate = this.bookingForm.value.endDate;

    if (!startDate || !endDate) {
      return 0;
    }

    const start = this.getStartOfDay(startDate);
    const end = this.getStartOfDay(endDate);
    const diff = end.getTime() - start.getTime();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24)) + 1;

    return days > 0 ? days : 0;
  }

  get totalPrice() {
    return this.totalDays * this.pricePerDay;
  }

  get showDateRangeError() {
    const startDate = this.bookingForm.value.startDate;
    const endDate = this.bookingForm.value.endDate;

    if (!startDate || !endDate) {
      return false;
    }

    return this.getStartOfDay(endDate) < this.getStartOfDay(startDate);
  }

  async submitBooking() {
    this.errorMessage = '';
    this.successMessage = '';

    if (!this.equipmentId) {
      this.errorMessage = 'Please select equipment from the equipment page first.';
      return;
    }

    if (this.bookingForm.invalid || this.showDateRangeError) {
      this.bookingForm.markAllAsTouched();

      if (this.showDateRangeError) {
        this.errorMessage = 'End date must be after or equal to start date.';
      }

      return;
    }

    this.isSubmitting = true;

    try {
      await this.bookingService.createBooking({
        equipmentId: this.equipmentId,
        startDate: this.formatDateForApi(this.bookingForm.value.startDate),
        endDate: this.formatDateForApi(this.bookingForm.value.endDate),
        totalPrice: this.totalPrice
      });

      this.successMessage = 'Booking created successfully.';
      this.bookingForm.reset();
    } catch (error: any) {
      this.errorMessage = error?.error?.message || error?.message || 'Could not create booking.';

      if (this.errorMessage === 'Please login first.') {
        await this.router.navigate(['/login']);
      }
    } finally {
      this.isSubmitting = false;
    }
  }

  private formatDateForApi(date: Date | null | undefined) {
    if (!date) {
      return '';
    }

    const year = date.getFullYear();
    const month = `${date.getMonth() + 1}`.padStart(2, '0');
    const day = `${date.getDate()}`.padStart(2, '0');

    return `${year}-${month}-${day}`;
  }

  private getStartOfDay(date: Date) {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
  }
}
