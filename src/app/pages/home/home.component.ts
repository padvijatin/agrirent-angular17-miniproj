import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { Equipment } from '../../core/models/equipment.model';
import { EquipmentService } from '../../core/services/equipment.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, MatButtonModule, MatCardModule, MatChipsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  featuredEquipment: Equipment[] = [];
  loadingFeatured = true;

  constructor(private readonly equipmentService: EquipmentService) {}

  async ngOnInit() {
    try {
      const equipment = await this.equipmentService.getAllEquipment();
      this.featuredEquipment = equipment.filter((item) => item.available).slice(0, 3);
    } catch (error) {
      console.error('Could not load featured equipment.', error);
      this.featuredEquipment = [];
    } finally {
      this.loadingFeatured = false;
    }
  }

  getBookingParams(item: Equipment) {
    return {
      equipmentId: item.id,
      name: item.name,
      pricePerDay: item.pricePerDay,
      location: item.location || '',
      imageUrl: item.imageUrl || ''
    };
  }

  trackByEquipment(_index: number, item: Equipment) {
    return item.id || item.name;
  }
}
