import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Message } from '../models/message.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  private readonly apiUrl = `${environment.apiUrl}/messages`;

  constructor(
    private readonly http: HttpClient,
    private readonly authService: AuthService
  ) {}

  async getAllMessages() {
    return firstValueFrom(
      this.http.get<Message[]>(this.apiUrl, {
        headers: await this.authService.getAuthHeaders()
      })
    );
  }

  async markAsRead(messageId: string) {
    return firstValueFrom(
      this.http.patch<Message>(
        `${this.apiUrl}/${messageId}/read`,
        {},
        {
          headers: await this.authService.getAuthHeaders()
        }
      )
    );
  }

  async deleteMessage(messageId: string) {
    return firstValueFrom(
      this.http.delete<{ message: string }>(`${this.apiUrl}/${messageId}`, {
        headers: await this.authService.getAuthHeaders()
      })
    );
  }
}
