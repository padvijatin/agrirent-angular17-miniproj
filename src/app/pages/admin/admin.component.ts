import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { map } from 'rxjs/operators';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Equipment } from '../../core/models/equipment.model';
import { Booking } from '../../core/models/booking.model';
import { User } from '../../core/models/user.model';
import { Message } from '../../core/models/message.model';
import { EquipmentService } from '../../core/services/equipment.service';
import { BookingService } from '../../core/services/booking.service';
import { AuthService } from '../../core/services/auth.service';
import { MessageService } from '../../core/services/message.service';

type AdminSection = 'overview' | 'equipment' | 'bookings' | 'users' | 'messages';
type BookingAction = 'approved' | 'rejected' | 'cancelled';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatCardModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule
  ],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})
export class AdminComponent implements OnInit {
  @ViewChild('imageInputRef') imageInputRef?: ElementRef<HTMLInputElement>;

  currentUser$ = this.authService.currentUser$;
  userName$ = this.currentUser$.pipe(map((user) => user?.fullName || 'Admin'));
  userEmail$ = this.currentUser$.pipe(map((user) => user?.email || ''));

  activeSection: AdminSection = 'overview';
  showForm = false;
  loading = false;
  listLoading = true;
  bookingsLoading = true;
  usersLoading = true;
  messagesLoading = true;
  successMessage = '';
  errorMessage = '';
  isEditing = false;
  editingId = '';
  actionBookingId = '';
  actionMessageId = '';
  equipmentList: Equipment[] = [];
  bookingList: Booking[] = [];
  userList: User[] = [];
  messageList: Message[] = [];
  formSubmitted = false;

  equipment: Equipment = this.getEmptyEquipment();
  selectedFile: File | null = null;
  imagePreview: string | null = null;
  categories = ['tractors', 'harvesters', 'plows', 'seeders', 'sprayers', 'trailers', 'other'];
  private readonly allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];

  constructor(
    private readonly equipmentService: EquipmentService,
    private readonly bookingService: BookingService,
    private readonly authService: AuthService,
    private readonly messageService: MessageService
  ) {}

  async ngOnInit() {
    await Promise.all([
      this.loadEquipment(),
      this.loadBookings(),
      this.loadUsers(),
      this.loadMessages()
    ]);
  }

  get totalEquipment() {
    return this.equipmentList.length;
  }

  get availableEquipment() {
    return this.equipmentList.filter((item) => item.available).length;
  }

  get bookedEquipment() {
    return this.bookingList.filter((booking) => booking.status === 'approved').length;
  }

  get pendingBookings() {
    return this.bookingList.filter((booking) => booking.status === 'pending').length;
  }

  get totalUsers() {
    return this.userList.length;
  }

  get ownerUsers() {
    return this.userList.filter((user) => user.role === 'owner').length;
  }

  get adminUsers() {
    return this.userList.filter((user) => user.role === 'admin').length;
  }

  get totalMessages() {
    return this.messageList.length;
  }

  get unreadMessages() {
    return this.messageList.filter((message) => !message.isRead).length;
  }

  setSection(section: AdminSection) {
    this.activeSection = section;
  }

  openEquipmentForm() {
    this.activeSection = 'equipment';
    this.showForm = true;
    this.errorMessage = '';
    this.successMessage = '';

    if (!this.isEditing) {
      this.resetForm();
      this.showForm = true;
    }
  }

  async loadEquipment() {
    this.listLoading = true;

    try {
      this.equipmentList = await this.equipmentService.getMyEquipment();
    } catch (error) {
      console.error('Could not load your equipment.', error);
    } finally {
      this.listLoading = false;
    }
  }

  async loadBookings() {
    this.bookingsLoading = true;

    try {
      this.bookingList = await this.bookingService.getOwnerBookings();
    } catch (error) {
      console.error('Could not load bookings.', error);
    } finally {
      this.bookingsLoading = false;
    }
  }

  async loadUsers() {
    this.usersLoading = true;

    try {
      this.userList = await this.authService.getAllUsers();
    } catch (error: any) {
      console.error('Could not load users.', error);
      this.userList = [];

      if (error?.error?.message) {
        this.errorMessage = error.error.message;
      }
    } finally {
      this.usersLoading = false;
    }
  }

  async loadMessages() {
    this.messagesLoading = true;

    try {
      this.messageList = await this.messageService.getAllMessages();
    } catch (error: any) {
      console.error('Could not load messages.', error);
      this.messageList = [];

      if (error?.error?.message) {
        this.errorMessage = error.error.message;
      }
    } finally {
      this.messagesLoading = false;
    }
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (!file) {
      return;
    }

    if (!this.allowedTypes.includes(file.type)) {
      this.selectedFile = null;
      this.imagePreview = null;
      this.errorMessage = 'Only JPG, PNG, or WEBP images are allowed';
      input.value = '';
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      this.selectedFile = null;
      this.imagePreview = null;
      this.errorMessage = 'Image must be smaller than 10 MB';
      input.value = '';
      return;
    }

    this.errorMessage = '';
    this.selectedFile = file;

    if (this.imagePreview) {
      URL.revokeObjectURL(this.imagePreview);
    }

    this.imagePreview = URL.createObjectURL(file);
  }

  removeImage() {
    if (this.imagePreview) {
      URL.revokeObjectURL(this.imagePreview);
    }

    this.selectedFile = null;
    this.imagePreview = null;
    this.equipment.imageUrl = '';

    if (this.imageInputRef?.nativeElement) {
      this.imageInputRef.nativeElement.value = '';
    }
  }

  editEquipment(item: Equipment) {
    this.activeSection = 'equipment';
    this.showForm = true;
    this.isEditing = true;
    this.editingId = item.id || '';
    this.errorMessage = '';
    this.successMessage = '';
    this.formSubmitted = false;
    this.selectedFile = null;
    this.imagePreview = item.imageUrl || null;
    this.equipment = {
      id: item.id,
      name: item.name,
      description: item.description,
      pricePerDay: item.pricePerDay,
      imageUrl: item.imageUrl,
      category: item.category,
      available: item.available,
      location: item.location || ''
    };

    if (this.imageInputRef?.nativeElement) {
      this.imageInputRef.nativeElement.value = '';
    }
  }

  async deleteEquipment(item: Equipment) {
    if (!item.id) {
      return;
    }

    const confirmed = confirm(`Delete ${item.name}?`);

    if (!confirmed) {
      return;
    }

    try {
      await this.equipmentService.deleteEquipment(item.id);
      this.successMessage = 'Equipment deleted successfully!';
      await this.loadEquipment();
    } catch (error: any) {
      console.error('Could not delete equipment.', error);
      this.errorMessage = error?.error?.message || 'Failed to delete equipment. Please try again.';
    }
  }

  async onSubmit() {
    this.formSubmitted = true;

    const name = this.equipment.name?.trim() || '';
    const description = this.equipment.description?.trim() || '';
    const category = this.equipment.category?.trim() || '';
    const location = this.equipment.location?.trim() || '';
    const pricePerDay = Number(this.equipment.pricePerDay);

    if (!name || !description || !category) {
      this.errorMessage = 'Please fill in all required fields';
      return;
    }

    if (Number.isNaN(pricePerDay) || pricePerDay <= 0) {
      this.errorMessage = 'Price per day must be greater than 0';
      return;
    }

    this.loading = true;
    this.errorMessage = '';
    this.successMessage = '';

    try {
      const data = {
        ...this.equipment,
        name,
        description,
        category,
        location,
        pricePerDay
      };

      if (this.isEditing && this.editingId) {
        await this.equipmentService.updateEquipment(this.editingId, data, this.selectedFile || undefined);
        this.successMessage = 'Equipment updated successfully!';
      } else {
        await this.equipmentService.addEquipment(data, this.selectedFile || undefined);
        this.successMessage = 'Equipment added successfully!';
      }

      this.resetForm();
      this.showForm = false;
      await this.loadEquipment();
    } catch (error: any) {
      console.error('Could not save equipment.', error);
      this.errorMessage = error?.error?.message || error?.message || 'Failed to save equipment. Please try again.';
    } finally {
      this.loading = false;
    }
  }

  async updateBookingStatus(booking: Booking, status: BookingAction) {
    if (!booking.id) {
      return;
    }

    this.actionBookingId = booking.id;
    this.errorMessage = '';
    this.successMessage = '';

    try {
      await this.bookingService.updateBookingStatus(booking.id, status);
      this.successMessage = `Booking ${status} successfully!`;
      await Promise.all([this.loadBookings(), this.loadEquipment()]);
    } catch (error: any) {
      console.error('Could not update booking status.', error);
      this.errorMessage = error?.error?.message || 'Failed to update booking status. Please try again.';
    } finally {
      this.actionBookingId = '';
    }
  }

  async markMessageAsRead(message: Message) {
    if (!message.id || message.isRead) {
      return;
    }

    this.actionMessageId = message.id;
    this.errorMessage = '';
    this.successMessage = '';

    try {
      const updatedMessage = await this.messageService.markAsRead(message.id);
      this.messageList = this.messageList.map((item) => item.id === updatedMessage.id ? updatedMessage : item);
      this.successMessage = 'Message marked as read.';
    } catch (error: any) {
      console.error('Could not mark message as read.', error);
      this.errorMessage = error?.error?.message || 'Failed to update the message.';
    } finally {
      this.actionMessageId = '';
    }
  }

  async deleteMessage(message: Message) {
    if (!message.id) {
      return;
    }

    const confirmed = confirm(`Delete message from ${message.fullName}?`);

    if (!confirmed) {
      return;
    }

    this.actionMessageId = message.id;
    this.errorMessage = '';
    this.successMessage = '';

    try {
      const response = await this.messageService.deleteMessage(message.id);
      this.messageList = this.messageList.filter((item) => item.id !== message.id);
      this.successMessage = response.message;
    } catch (error: any) {
      console.error('Could not delete message.', error);
      this.errorMessage = error?.error?.message || 'Failed to delete the message.';
    } finally {
      this.actionMessageId = '';
    }
  }

  canApprove(booking: Booking) {
    return booking.status === 'pending';
  }

  canReject(booking: Booking) {
    return booking.status === 'pending';
  }

  canCancel(booking: Booking) {
    return booking.status === 'pending' || booking.status === 'approved';
  }

  trackByBooking(_index: number, booking: Booking) {
    return booking.id;
  }

  trackByUser(_index: number, user: User) {
    return user.id || user.firebaseUid || user.email;
  }

  trackByMessage(_index: number, message: Message) {
    return message.id;
  }

  resetForm() {
    if (this.imagePreview) {
      URL.revokeObjectURL(this.imagePreview);
    }

    this.equipment = this.getEmptyEquipment();
    this.selectedFile = null;
    this.imagePreview = null;
    this.editingId = '';
    this.isEditing = false;
    this.formSubmitted = false;

    if (this.imageInputRef?.nativeElement) {
      this.imageInputRef.nativeElement.value = '';
    }
  }

  toggleForm() {
    this.showForm = !this.showForm;
    this.errorMessage = '';
    this.successMessage = '';

    if (!this.showForm) {
      this.resetForm();
    }
  }

  private getEmptyEquipment(): Equipment {
    return {
      name: '',
      description: '',
      pricePerDay: 0,
      imageUrl: '',
      category: '',
      available: true,
      location: ''
    };
  }
}
