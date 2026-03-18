import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { auth } from '../config/firebase.config';
import { environment } from '../../../environments/environment';
import { Booking } from '../models/booking.model';

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

  constructor(private readonly http: HttpClient) {}

  async createBooking(data: CreateBookingData) {
    return firstValueFrom(
      this.http.post<Booking>(this.apiUrl, data, {
        headers: await this.getAuthHeaders()
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
          headers: await this.getAuthHeaders()
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
          headers: await this.getAuthHeaders()
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
          headers: await this.getAuthHeaders()
        }
      )
    );
  }

  private async getAuthHeaders() {
    const currentUser = auth.currentUser;

    if (!currentUser) {
      throw new Error('Please login first.');
    }

    const token = await currentUser.getIdToken();

    return new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
  }
}
