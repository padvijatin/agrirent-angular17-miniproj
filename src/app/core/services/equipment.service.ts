import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { Equipment } from '../models/equipment.model';
import { environment } from '../../../environments/environment';
import { auth } from '../config/firebase.config';

@Injectable({
  providedIn: 'root'
})
export class EquipmentService {
  private readonly apiUrl = `${environment.apiUrl}/equipment`;

  constructor(private readonly http: HttpClient) {}

  async getAllEquipment() {
    try {
      return await firstValueFrom(this.http.get<Equipment[]>(this.apiUrl));
    } catch (error) {
      console.warn('Could not load equipment.', error);
      return [];
    }
  }

  async getMyEquipment() {
    try {
      return await firstValueFrom(
        this.http.get<Equipment[]>(`${this.apiUrl}/mine`, {
          headers: await this.getAuthHeaders()
        })
      );
    } catch (error) {
      console.warn('Could not load your equipment.', error);
      return [];
    }
  }

  async getEquipmentByCategory(category: string) {
    try {
      return await firstValueFrom(
        this.http.get<Equipment[]>(this.apiUrl, {
          params: { category }
        })
      );
    } catch (error) {
      console.warn('Could not load equipment by category.', error);
      return [];
    }
  }

  async getAvailableEquipment() {
    try {
      return await firstValueFrom(this.http.get<Equipment[]>(`${this.apiUrl}/available`));
    } catch (error) {
      console.warn('Could not load available equipment.', error);
      return [];
    }
  }

  async addEquipment(equipment: Equipment, imageFile?: File) {
    const formData = this.buildFormData(equipment, imageFile);

    const createdEquipment = await firstValueFrom(
      this.http.post<Equipment>(this.apiUrl, formData, {
        headers: await this.getAuthHeaders()
      })
    );

    return createdEquipment.id ?? '';
  }

  async updateEquipment(id: string, equipment: Partial<Equipment>, imageFile?: File) {
    const formData = this.buildFormData(equipment, imageFile);

    await firstValueFrom(
      this.http.put(`${this.apiUrl}/${id}`, formData, {
        headers: await this.getAuthHeaders()
      })
    );
  }

  async deleteEquipment(id: string) {
    await firstValueFrom(
      this.http.delete(`${this.apiUrl}/${id}`, {
        headers: await this.getAuthHeaders()
      })
    );
  }

  private buildFormData(equipment: Partial<Equipment>, imageFile?: File) {
    const formData = new FormData();

    if (equipment.name !== undefined) formData.append('name', equipment.name);
    if (equipment.description !== undefined) formData.append('description', equipment.description);
    if (equipment.pricePerDay !== undefined) formData.append('pricePerDay', String(equipment.pricePerDay));
    if (equipment.imageUrl !== undefined) formData.append('imageUrl', equipment.imageUrl || '');
    if (equipment.category !== undefined) formData.append('category', equipment.category);
    if (equipment.available !== undefined) formData.append('available', String(equipment.available));
    if (equipment.location !== undefined) formData.append('location', equipment.location || '');

    if (imageFile) {
      formData.append('image', imageFile);
    }

    return formData;
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
