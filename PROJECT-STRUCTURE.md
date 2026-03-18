# AgriRent Project Structure

## Top-level workspace

```text
C:\Projects\Angular\
  agrirent-frontend\
  backend\
```

## Frontend

```text
src/
  app/
    core/
      config/
        firebase.config.ts
      guards/
        auth.guard.ts
      models/
        equipment.model.ts
        user.model.ts
      services/
        auth.service.ts
        equipment.service.ts
    components/
      footer/
      navbar/
    pages/
      about/
        about-us.component.ts
      admin/
        admin.component.ts
      auth/
        login/
        register/
      booking/
        booking.component.ts
      contact/
        contact-us.component.ts
      equipment/
        equipment-listing.component.ts
      home/
        home.component.ts
    app.component.ts
    app.config.ts
    app.routes.ts
```

## Backend

```text
backend/
  config/
    db.js
    firebaseAdmin.js
  controllers/
    bookingController.js
    equipmentController.js
    userController.js
  middleware/
    authMiddleware.js
    errorMiddleware.js
    uploadMiddleware.js
  models/
    Booking.js
    Equipment.js
    User.js
  routes/
    bookingRoutes.js
    equipmentRoutes.js
    userRoutes.js
  .env
  .env.example
  package.json
  server.js
```

## Why this structure

- `core/` is for app-wide logic used everywhere.
- `components/` is for reusable UI pieces like navbar and footer.
- `pages/` keeps the route-level screens simple and easy to find.
- `backend/` is separated from Angular so API code, MongoDB models, and Firebase Admin stay clean and maintainable.
