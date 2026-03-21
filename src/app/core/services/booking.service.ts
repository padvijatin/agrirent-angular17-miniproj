import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { auth } from '../config/firebase.config';
import { environment } from '../../../environments/environment';
import { Booking } from '../models/booking.model';
import { AuthService } from './auth.service';

interface CreateBookingData {
  equipmentId: string;
  startDate: string;
  endDate: string;
  totalPrice: number;
}

@Injectable({
  providedIn: 'root'
})
export class BookingService {
  private readonly apiUrl = `${environment.apiUrl}/bookings`;

  constructor(
    private readonly http: HttpClient,
    private readonly authService: AuthService
  ) {}

  async createBooking(data: CreateBookingData) {
    return firstValueFrom(
      this.http.post<Booking>(this.apiUrl, data, {
        headers: await this.authService.getAuthHeaders()
      })
    );
  }

  async getMyBookings() {
    if (!auth.currentUser) {
      return [];
    }

    try {
      return await firstValueFrom(
        this.http.get<Booking[]>(`${this.apiUrl}/me`, {
          headers: await this.authService.getAuthHeaders()
        })
      );
    } catch (error) {
      console.warn('Could not load your bookings.', error);
      return [];
    }
  }

  async getOwnerBookings() {
    if (!auth.currentUser) {
      return [];
    }

    try {
      return await firstValueFrom(
        this.http.get<Booking[]>(`${this.apiUrl}/owner`, {
          headers: await this.authService.getAuthHeaders()
        })
      );
    } catch (error) {
      console.warn('Could not load owner bookings.', error);
      return [];
    }
  }

  async updateBookingStatus(bookingId: string, status: 'approved' | 'rejected' | 'cancelled') {
    return firstValueFrom(
      this.http.patch<Booking>(
        `${this.apiUrl}/${bookingId}/status`,
        { status },
        {
          headers: await this.authService.getAuthHeaders()
        }
      )
    );
  }
}
