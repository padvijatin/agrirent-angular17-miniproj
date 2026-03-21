import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/home/home.component').then((m) => m.HomeComponent)
  },
  {
    path: 'about',
    loadComponent: () => import('./pages/about/about-us.component').then((m) => m.AboutUsComponent)
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/auth/login/login.component').then((m) => m.LoginComponent)
  },
  {
    path: 'register',
    loadComponent: () => import('./pages/auth/register/register.component').then((m) => m.RegisterComponent)
  },
  {
    path: 'admin',
    loadComponent: () => import('./pages/admin/admin.component').then((m) => m.AdminComponent),
    canActivate: [authGuard, roleGuard],
    data: { roles: ['owner', 'admin'] }
  },
  {
    path: 'booking',
    loadComponent: () => import('./pages/booking/booking.component').then((m) => m.BookingComponent)
  },
  {
    path: 'equipment',
    loadComponent: () => import('./pages/equipment/equipment-listing.component').then((m) => m.EquipmentListingComponent)
  },
  {
    path: 'contact',
    loadComponent: () => import('./pages/contact/contact-us.component').then((m) => m.ContactUsComponent)
  },
  { path: '**', redirectTo: '' }
];
