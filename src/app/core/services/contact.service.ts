import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface ContactFormPayload {
  fullName: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class ContactService {
  private readonly apiUrl = `${environment.apiUrl}/contact`;

  constructor(private readonly http: HttpClient) {}

  submitContactForm(payload: ContactFormPayload) {
    return firstValueFrom(
      this.http.post<{ message: string }>(this.apiUrl, payload)
    );
  }
}
