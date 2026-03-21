# AgriRent Live Doc

## Overview
AgriRent is an Angular 17 application that uses Firebase Authentication on the client and talks to a separate local Node.js + Express backend for users, equipment, bookings, contact email delivery, and admin message management.

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
- Angular Router with route-level lazy loading
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
- Nodemailer
- Multer
- CORS
- Dotenv

## Architecture

```text
Angular frontend
  -> Firebase Auth for login and registration
  -> Firebase ID token attached to protected API requests
  -> Express backend verifies the token
  -> MongoDB stores users, equipment, bookings, and messages
  -> Nodemailer handles contact emails
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
- `src/app/core/services/contact.service.ts`
- `src/app/core/services/message.service.ts`
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
- create shared Firebase auth headers for protected API requests
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

### `ContactService`
- submit the contact form to the backend

### `MessageService`
- load all contact messages for admin
- mark a message as read
- delete a message

## Admin Dashboard

The current admin page includes:

- overview cards for total equipment, pending bookings, users, and unread messages
- owner/admin equipment CRUD
- image upload with type validation and 10 MB size limit
- booking management using owner-facing booking endpoints
- user list loading for admin visibility
- contact message inbox management with read and delete actions

## Contact Flow
1. User fills the Angular contact form.
2. Frontend sends `POST /api/contact`.
3. Backend validates the payload.
4. Nodemailer sends the email.
5. The message can be saved in MongoDB.
6. Admin users can review the message from the dashboard.

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

### Contact And Messages
- `POST /api/contact`
- `GET /api/messages`
- `PATCH /api/messages/:id/read`
- `DELETE /api/messages/:id`

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

### Message
- `id`
- `fullName`
- `email`
- `phone`
- `subject`
- `message`
- `isRead`
- `readAt`
- `createdAt`

## UI Notes
- route-level lazy loading is used for the main pages
- Home uses a hero background image from `src/assets/hero.jpg`
- Home shows only a few featured equipment cards instead of the full equipment list
- About and Contact use simple rounded sections/cards
- Material is kept mainly where it helps forms, cards, chips, tables, and dashboard actions

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
- SMTP settings for contact email

## Verification Notes

Verification performed in this update:

- reviewed routes, guards, services, and page structure
- confirmed route-level lazy loading remains active
- removed obvious unused and repeated code in the frontend
- centralized repeated Firebase auth header generation in `AuthService`
- ran `npm run build`

Build result:
- production build passes
- Angular still reports a warning for the Firebase `undici` dependency during SSR build
- `home.component.css` still shows a non-blocking component CSS budget warning

## Current Working Features
- Firebase registration and login
- backend profile sync after auth
- navbar auth state updates
- backend-backed role checks
- public equipment listing
- booking creation form
- owner/admin equipment create, edit, and delete
- owner/admin booking review actions
- contact form submission to backend
- admin contact message inbox
- owner/admin protected dashboard
- admin user list retrieval
- home, about, and contact pages updated to the current project design

## Known Notes
- the SSR build still shows an `undici` CommonJS warning from Firebase dependencies
- `home.component.css` is above the default Angular component CSS warning budget
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
2. Add richer equipment filtering if the project needs it later.
3. Reduce the Home page CSS size if you want to remove the remaining Angular warning.
4. If needed later, move backend docs into a separate backend repository README for cleaner project separation.
