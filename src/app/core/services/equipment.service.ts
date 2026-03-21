import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { Equipment } from '../models/equipment.model';
import { environment } from '../../../environments/environment';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class EquipmentService {
  private readonly apiUrl = `${environment.apiUrl}/equipment`;

  constructor(
    private readonly http: HttpClient,
    private readonly authService: AuthService
  ) {}

  async getAllEquipment() {
    const response = await firstValueFrom(this.http.get<Equipment[] | { items?: Equipment[]; data?: Equipment[] }>(this.apiUrl));
    return this.normalizeEquipmentList(response);
  }

  async getMyEquipment() {
    const response = await firstValueFrom(
      this.http.get<Equipment[] | { items?: Equipment[]; data?: Equipment[] }>(`${this.apiUrl}/mine`, {
        headers: await this.authService.getAuthHeaders()
      })
    );

    return this.normalizeEquipmentList(response);
  }

  async getEquipmentByCategory(category: string) {
    const response = await firstValueFrom(
      this.http.get<Equipment[] | { items?: Equipment[]; data?: Equipment[] }>(this.apiUrl, {
        params: { category }
      })
    );

    return this.normalizeEquipmentList(response);
  }

  async getAvailableEquipment() {
    const response = await firstValueFrom(
      this.http.get<Equipment[] | { items?: Equipment[]; data?: Equipment[] }>(`${this.apiUrl}/available`)
    );

    return this.normalizeEquipmentList(response);
  }

  async addEquipment(equipment: Equipment, imageFile?: File) {
    const formData = this.buildFormData(equipment, imageFile);

    const createdEquipment = await firstValueFrom(
      this.http.post<Equipment>(this.apiUrl, formData, {
        headers: await this.authService.getAuthHeaders()
      })
    );

    return createdEquipment.id ?? (createdEquipment as Equipment & { _id?: string })._id ?? '';
  }

  async updateEquipment(id: string, equipment: Partial<Equipment>, imageFile?: File) {
    const formData = this.buildFormData(equipment, imageFile);

    await firstValueFrom(
      this.http.put(`${this.apiUrl}/${id}`, formData, {
        headers: await this.authService.getAuthHeaders()
      })
    );
  }

  async deleteEquipment(id: string) {
    await firstValueFrom(
      this.http.delete(`${this.apiUrl}/${id}`, {
        headers: await this.authService.getAuthHeaders()
      })
    );
  }

  private normalizeEquipmentList(response: Equipment[] | { items?: Equipment[]; data?: Equipment[] } | null | undefined) {
    const list = Array.isArray(response) ? response : response?.items || response?.data || [];

    return list.map((item) => ({
      ...item,
      id: item.id ?? (item as Equipment & { _id?: string })._id ?? ''
    }));
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
}
