# AgriRent Frontend

AgriRent is an Angular 17 frontend for an agricultural equipment rental project. It works with a separate Express + MongoDB backend and uses Firebase only for authentication.

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
- Angular 17
- Angular standalone components
- Angular Router
- Angular Reactive Forms
- Angular `HttpClient`
- Firebase Authentication

## Frontend Structure

```text
src/app
+-- components
+-- core
¦   +-- config
¦   +-- guards
¦   +-- models
¦   +-- services
+-- pages
```

## Pages
- `/`
- `/about`
- `/contact`
- `/equipment`
- `/booking`
- `/login`
- `/register`
- `/admin`

## Authentication
- Firebase handles login and registration
- Backend verifies Firebase ID tokens
- MongoDB stores user profiles and roles

## Requirements

### Frontend environment
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

Backend:
- `http://localhost:5000/api/health`

## Main Features
- Firebase login and registration
- MongoDB-backed user profile sync
- role-based admin route
- equipment listing
- owner/admin equipment management

## Important Note
This repo is the Angular frontend. The backend is kept as a separate app in `C:\Projects\Angular\backend`.

For a fuller technical write-up, see:
- [Live Doc.md](./Live%20Doc.md)
