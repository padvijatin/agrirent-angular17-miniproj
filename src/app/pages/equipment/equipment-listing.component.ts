import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Equipment } from '../../core/models/equipment.model';
import { EquipmentService } from '../../core/services/equipment.service';

@Component({
  selector: 'app-equipment-listing',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    MatButtonModule,
    MatCardModule,
    MatChipsModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './equipment-listing.component.html',
  styleUrl: './equipment-listing.component.css'
})
export class EquipmentListingComponent implements OnInit {
  equipmentList: Equipment[] = [];
  filteredEquipment: Equipment[] = [];
  loading = true;
  searchText = '';

  constructor(private readonly equipmentService: EquipmentService) {}

  async ngOnInit() {
    this.loading = true;

    try {
      this.equipmentList = await this.equipmentService.getAllEquipment();
      this.applySearch();
    } catch (error) {
      console.error('Could not load equipment.', error);
    } finally {
      this.loading = false;
    }
  }

  applySearch() {
    const search = this.searchText.trim().toLowerCase();

    this.filteredEquipment = this.equipmentList.filter((item) => {
      if (!search) {
        return true;
      }

      return [item.name, item.description, item.category, item.location || '']
        .join(' ')
        .toLowerCase()
        .includes(search);
    });
  }
}
