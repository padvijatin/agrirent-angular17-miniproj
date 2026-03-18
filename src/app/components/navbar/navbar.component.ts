import { Component, HostListener } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { map } from 'rxjs/operators';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  isScrolled = false;
  isLoggedIn$ = this.authService.userState$;
  userName$ = this.authService.currentUser$.pipe(map((user) => user?.fullName || 'User'));
  canManageEquipment$ = this.authService.currentUser$.pipe(
    map((user) => user?.role === 'admin' || user?.role === 'owner')
  );

  constructor(private authService: AuthService, private router: Router) {}

  @HostListener('window:scroll')
  onWindowScroll() {
    this.isScrolled = window.scrollY > 20;
  }

  async logout() {
    await this.authService.logout();
    await this.router.navigate(['/login']);
  }
}
