# AgriRent Project Structure

## Top-level workspace

```text
C:\Projects\Angular\
  agrirent-frontend\
  backend\
```

## Frontend Repository

```text
src/
  app/
    core/
      config/
        firebase.config.ts
      guards/
        auth.guard.ts
        role.guard.ts
      models/
        booking.model.ts
        equipment.model.ts
        message.model.ts
        user.model.ts
      services/
        auth.service.ts
        booking.service.ts
        contact.service.ts
        equipment.service.ts
        message.service.ts
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
  assets/
    hero.jpg
```

## Local Backend App Used By Frontend

```text
backend/
  config/
    db.js
    firebaseAdmin.js
  controllers/
    bookingController.js
    contactController.js
    equipmentController.js
    messageController.js
    userController.js
  middleware/
    authMiddleware.js
    errorMiddleware.js
    uploadMiddleware.js
  models/
    Booking.js
    Equipment.js
    Message.js
    User.js
  routes/
    bookingRoutes.js
    contactRoutes.js
    equipmentRoutes.js
    messageRoutes.js
    userRoutes.js
  .env
  .env.example
  package.json
  server.js
```

## Why this structure

- `core/` is for app-wide logic used across multiple pages.
- `components/` is for reusable UI pieces like navbar and footer.
- `pages/` keeps route-level screens simple and easy to find.
- route-level lazy loading keeps the Angular app more practical for real navigation.
- `backend/` is separated from Angular so API code, MongoDB models, Firebase Admin, and Nodemailer logic stay independent.
- auth header generation is shared through `AuthService` so API services do not repeat the same token-building code.
