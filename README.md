# AgriRent Frontend

AgriRent is an Angular 17 frontend for an agricultural equipment rental platform. The app uses Firebase Authentication on the client and connects to a separate local Node.js + Express backend for users, equipment, bookings, and contact messages.

## Project Setup

Workspace layout:

```text
C:\Projects\Angular
+-- agrirent-frontend
+-- backend
```

Frontend git repository:
- `C:\Projects\Angular\agrirent-frontend`

Local backend app used by the frontend:
- `C:\Projects\Angular\backend`

## Tech Stack
- Angular 17 standalone components
- Angular Router with route-level lazy loading
- Angular Reactive Forms
- Angular Material
- Angular `HttpClient`
- Firebase Authentication
- Angular SSR / prerender setup

## Frontend Structure

```text
src/app
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

## Routes
- `/`
- `/about`
- `/contact`
- `/equipment`
- `/booking`
- `/login`
- `/register`
- `/admin` for `owner` and `admin`

Unknown routes redirect to `/`.

## Main Features
- Firebase registration and login
- backend-backed user profile sync
- role-based route protection
- lazy-loaded route pages
- public equipment listing with search
- booking creation flow
- owner/admin equipment management
- owner/admin booking status management
- contact form connected to backend email flow
- admin message inbox with read and delete actions
- admin user list loading

## Authentication
- Firebase handles login and registration
- protected API requests send a Firebase ID token
- backend verifies the token
- MongoDB stores user profiles and roles
- `roleGuard` refreshes the backend profile before checking admin access
- shared auth headers are now generated through `AuthService` and reused across API services

## Contact And Admin Message Flow
- the Contact page sends a real POST request through `ContactService`
- the backend sends the email with Nodemailer
- contact messages can also be stored in MongoDB on the backend
- the Admin page includes a Messages section to:
  - view all messages
  - mark a message as read
  - delete a message

## Home, About, And Contact Pages
- Home uses a custom hero with `src/assets/hero.jpg`
- Home shows only a few featured equipment cards instead of the full listing
- About and Contact use simple rounded sections/cards instead of heavy landing-page styling
- featured equipment on Home reuses the same general card style as the equipment page

## Environment Requirements

### Frontend
Set Firebase config and API URL in:

`src/environments/environment.ts`

Example shape:

```ts
export const environment = {
  production: false,
  apiUrl: 'http://localhost:5000/api',
  firebase: {
    apiKey: '',
    authDomain: '',
    projectId: '',
    storageBucket: '',
    messagingSenderId: '',
    appId: ''
  }
};
```

### Backend
Make sure the backend is running from:

`C:\Projects\Angular\backend`

Expected backend setup includes:
- `PORT`
- `CLIENT_URL`
- `MONGODB_URI`
- Firebase Admin credentials
- SMTP / contact email settings in `backend/.env`

## Run Locally

### 1. Start backend
```powershell
cd C:\Projects\Angular\backend
npm install
npm run dev
```

### 2. Start frontend
```powershell
cd C:\Projects\Angular\agrirent-frontend
npm install
npm start
```

Frontend:
- `http://localhost:4200`

Backend health check:
- `http://localhost:5000/api/health`

## Verification
- `npm run build` completes successfully
- route-level lazy loading is active for the main pages
- contact form and admin message UI are wired in the frontend
- Angular SSR build still shows the Firebase `undici` warning
- `home.component.css` still has a non-blocking Angular CSS budget warning

## Important Note
This repository is the Angular frontend. The backend is kept as a separate local app in `C:\Projects\Angular\backend` and is not part of this git repository.

For a fuller technical write-up, see:
- [Live Doc.md](./Live%20Doc.md)
- [PROJECT-STRUCTURE.md](./PROJECT-STRUCTURE.md)
