# FashionHub

A full-stack e-commerce web application with a Spring Boot backend and React frontend.

## Tech Stack
- **Backend:** Java, Spring Boot, Spring Security, JPA/Hibernate, MySQL
- **Frontend:** React, Tailwind CSS, Axios

## Features
- User authentication (user/admin separation)
- Product catalog with categories and images
- Shopping cart and checkout flow
- **Stripe payment integration** (full payment processing)
- Order management (user and admin views)
- Admin dashboard (manage products, orders, users)
- Profile management (edit and persist user info)

## Project Structure
```
app/
  backend/   # Spring Boot backend
  frontend/       # React frontend
```

## Setup Instructions

### Backend (Spring Boot)
1. Navigate to `backend` directory:
   ```sh
   cd backend
   ```
2. Create a MySQL database named `userDB`.
3. Copy `.env.example` to `.env` and fill in your MySQL login, Stripe secret key and a `JWT_SECRET`.
   This file holds secrets and is ignored by git.
4. Build and run the backend:
   ```sh
   mvn spring-boot:run
   ```

### Frontend (React)
1. Navigate to `frontend` directory:
   ```sh
   cd ../frontend
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Start the development server:
   ```sh
   npm run dev
   ```

### Database Migration
The schema is managed by Flyway. Scripts in `backend/src/main/resources/db/migration` run
automatically at startup, in version order, and the app refuses to start if the tables do
not match the code.

To change the schema, add a new script with the next version number, for example
`V4__add_order_notes.sql`:
```sql
alter table orders add column notes varchar(500);
```
Never edit a script that has already run; add a new one instead.

## Usage
- Access the frontend at `http://localhost:5173`
- Backend runs at `http://localhost:8080`
- Default admin/user roles supported

## Payment Integration

This application uses **Stripe** for secure payment processing. 

### Quick Setup
1. Get your Stripe API keys from [Stripe Dashboard](https://dashboard.stripe.com)
2. Configure backend: set `STRIPE_SECRET_KEY` in `backend/.env`
3. Configure frontend: set `VITE_STRIPE_PUBLISHABLE_KEY` in `frontend/.env`

Both keys must come from the same Stripe account.

### Payment Flow
- Orders over Rs 3000: Stripe card payment required
- Orders Rs 3000 or less: Cash on Delivery option available
- Secure payment processing with Stripe Elements

## Notes
- Product images are stored in `backend/uploads/products/`
- Update CORS settings in backend if deploying to production

---

**Developed as a personal project.** 