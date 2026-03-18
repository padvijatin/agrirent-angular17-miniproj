# AgriRent Frontend

AgriRent is an Angular 17 application for an agricultural equipment rental platform. This repository contains the frontend app, which uses Firebase Authentication and connects to a separate Express + MongoDB backend for users, equipment, and bookings.

## Project Setup

Workspace layout:

```text
C:\Projects\Angular
+-- agrirent-frontend
+-- backend
```

Frontend repo:
- `C:\Projects\Angular\agrirent-frontend`

Backend app:
- `C:\Projects\Angular\backend`

## Tech Stack
- Angular 17 standalone components
- Angular Router
- Angular Reactive Forms
- Angular Material
- Angular SSR / prerender setup
- Angular `HttpClient`
- Firebase Authentication

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
- public equipment listing
- booking creation flow
- owner/admin equipment management
- owner/admin booking status management
- admin user list loading

## Authentication
- Firebase handles login and registration
- protected API requests send a Firebase ID token
- backend verifies the token
- MongoDB stores user profiles and roles
- `roleGuard` refreshes the backend profile before checking admin access

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
- Angular SSR build still shows the Firebase `undici` warning
- the Angular initial bundle budget was raised to fit the current app size

## Important Note
This repo is the Angular frontend. The backend is kept as a separate local app in `C:\Projects\Angular\backend` and is not part of this git repository.

For a fuller technical write-up, see:
- [Live Doc.md](./Live%20Doc.md)
- [PROJECT-STRUCTURE.md](./PROJECT-STRUCTURE.md)
