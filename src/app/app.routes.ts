import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/auth/login/login.component';
import { RegisterComponent } from './pages/auth/register/register.component';
import { AdminComponent } from './pages/admin/admin.component';
import { BookingComponent } from './pages/booking/booking.component';
import { EquipmentListingComponent } from './pages/equipment/equipment-listing.component';
import { ContactUsComponent } from './pages/contact/contact-us.component';
import { AboutUsComponent } from './pages/about/about-us.component';
import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'about', component: AboutUsComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  {
    path: 'admin',
    component: AdminComponent,
    canActivate: [authGuard, roleGuard],
    data: { roles: ['owner', 'admin'] }
  },
  { path: 'booking', component: BookingComponent },
  { path: 'equipment', component: EquipmentListingComponent },
  { path: 'contact', component: ContactUsComponent },
  { path: '**', redirectTo: '' }
];
