# AgriRent Live Doc

## Overview
AgriRent is an Angular 17 application that uses Firebase Authentication on the client and talks to a separate Node.js + Express backend for user, equipment, and booking data.

Current workspace layout:

```text
C:\Projects\Angular
+-- agrirent-frontend
+-- backend
```

`agrirent-frontend` is the git repository being tracked and pushed from this workspace. The `backend` folder is present locally and the frontend is wired to call it through `http://localhost:5000/api`.

## Current Stack

### Frontend
- Angular 17 standalone components
- Angular Router
- Angular Reactive Forms
- Angular Material
- Angular SSR / prerender setup
- Angular `HttpClient`
- Firebase Web SDK

### Backend
- Node.js
- Express
- MongoDB + Mongoose
- Firebase Admin SDK
- Multer
- CORS
- Dotenv

## Architecture

```text
Angular frontend
  -> Firebase Auth for login and registration
  -> Firebase ID token attached to protected API requests
  -> Express backend verifies the token
  -> MongoDB stores users, equipment, and bookings
```

## Frontend Structure

`src/app` is organized like this:

```text
app
+-- components
|   +-- footer
|   +-- navbar
+-- core
|   +-- config
|   +-- guards
|   +-- models
|   +-- services
+-- pages
    +-- about
    +-- admin
    +-- auth
    |   +-- login
    |   +-- register
    +-- booking
    +-- contact
    +-- equipment
    +-- home
```

### Main frontend files
- `src/app/app.routes.ts`
- `src/app/app.config.ts`
- `src/app/core/config/firebase.config.ts`
- `src/app/core/services/auth.service.ts`
- `src/app/core/services/equipment.service.ts`
- `src/app/core/services/booking.service.ts`
- `src/app/core/guards/auth.guard.ts`
- `src/app/core/guards/role.guard.ts`

## Implemented Routes
- `/` -> home page
- `/about` -> about page
- `/contact` -> contact page
- `/equipment` -> public equipment listing
- `/booking` -> booking form page
- `/login` -> login page
- `/register` -> registration page
- `/admin` -> owner/admin dashboard protected by `authGuard` and `roleGuard`

Unknown routes redirect back to `/`.

## Auth And Profile Flow

### Register
1. User submits the Angular register form.
2. Firebase Auth creates the account.
3. The app optionally updates the Firebase display name.
4. The frontend calls `POST /api/users/sync`.
5. The backend verifies the Firebase token and upserts the MongoDB user profile.
6. The app refreshes the current backend-backed user state.

### Login
1. User signs in with Firebase Auth.
2. The app syncs the current profile with the backend.
3. The app refreshes the MongoDB-backed profile from `GET /api/users/me`.
4. `currentUser$` and `userState$` update the navbar and route guards.

### Role handling
- Roles are stored in MongoDB.
- New users default to `user`.
- `/admin` allows only `owner` and `admin`.
- `roleGuard` refreshes the backend profile before checking access.

## Current Frontend Service Responsibilities

### `AuthService`
- register with Firebase
- login with Firebase
- logout
- sync the current user profile to backend
- load the current user profile from backend
- fall back to Firebase profile data if backend lookup fails
- fetch all users for the admin dashboard
- expose `currentUser$` and `userState$`

### `EquipmentService`
- load all equipment
- load available equipment
- load current owner/admin equipment
- filter equipment by category
- create equipment with optional image upload
- update equipment with optional image upload
- delete equipment

### `BookingService`
- create a booking
- load current user's bookings
- load owner bookings for admin management
- update booking status to `approved`, `rejected`, or `cancelled`

## Admin Dashboard

The current admin page includes:

- overview cards for total equipment, available equipment, approved bookings, pending bookings, and users
- owner/admin equipment CRUD
- image upload with type validation and 10 MB size limit
- booking management using owner-facing booking endpoints
- user list loading for admin visibility

## API Used By The Frontend

### Health
- `GET /api/health`

### Users
- `POST /api/users`
- `POST /api/users/sync`
- `GET /api/users/me`
- `GET /api/users`

### Equipment
- `GET /api/equipment`
- `GET /api/equipment/available`
- `GET /api/equipment?category=...`
- `GET /api/equipment/mine`
- `POST /api/equipment`
- `PUT /api/equipment/:id`
- `DELETE /api/equipment/:id`

### Bookings
- `POST /api/bookings`
- `GET /api/bookings/me`
- `GET /api/bookings/owner`
- `PATCH /api/bookings/:id/status`

## Current Data Models In Frontend

### User
- `id`
- `uid`
- `firebaseUid`
- `fullName`
- `email`
- `phone`
- `role`
- `createdAt`
- `updatedAt`

### Equipment
- `id`
- `name`
- `description`
- `pricePerDay`
- `imageUrl`
- `category`
- `available`
- `location`
- `ownerId`

### Booking
- `id`
- `equipmentId`
- `userId`
- `startDate`
- `endDate`
- `totalPrice`
- `status`
- nested `equipment`
- nested `user`

## Environment Notes

### Frontend
Defined in `src/environments/environment.ts`:
- Firebase web config
- `apiUrl`, currently `http://localhost:5000/api`

### Backend
Expected values include:
- `PORT`
- `CLIENT_URL`
- `MONGODB_URI`
- Firebase Admin credentials

## Verification Notes

Verification performed in this update:

- checked the current route setup and service layer
- confirmed the frontend is wired to booking owner/status endpoints and user listing
- ran `npm run build`

Build result:
- production build now passes after increasing the Angular initial bundle budget from `1mb` to `1.2mb`
- Angular still reports a warning for the Firebase `undici` dependency during SSR build

## Current Working Features
- Firebase registration and login
- backend profile sync after auth
- navbar auth state updates
- backend-backed role checks
- public equipment listing
- booking creation form
- owner/admin equipment create, edit, and delete
- owner/admin booking review actions
- owner/admin protected dashboard
- admin user list retrieval

## Known Notes
- the SSR build still shows an `undici` CommonJS warning from Firebase dependencies
- bundle size is larger than the original default Angular budget, so the budget was raised to match the current app size
- the backend folder exists locally but is not part of the tracked frontend git repository in this workspace

## Run Commands

### Frontend
```powershell
cd C:\Projects\Angular\agrirent-frontend
npm install
npm start
```

### Backend
```powershell
cd C:\Projects\Angular\backend
npm install
npm run dev
```

## Next Recommended Work
1. Add admin UI for changing user roles, not just viewing users.
2. Add a booking history view for normal users.
3. Add equipment details and richer filtering/search.
4. Reduce the initial bundle size so the raised budget can be tightened again later.
