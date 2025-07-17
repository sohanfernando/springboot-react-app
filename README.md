# ChallengeApp

A full-stack e-commerce web application with a Spring Boot backend and React frontend.

## Tech Stack
- **Backend:** Java, Spring Boot, Spring Security, JPA/Hibernate, MySQL
- **Frontend:** React, Tailwind CSS, Axios

## Features
- User authentication (user/admin separation)
- Product catalog with categories and images
- Shopping cart and checkout flow
- Payment simulation
- Order management (user and admin views)
- Admin dashboard (manage products, orders, users)
- Profile management (edit and persist user info)

## Project Structure
```
app/
  challengeApp/   # Spring Boot backend
  frontend/       # React frontend
```

## Setup Instructions

### Backend (Spring Boot)
1. Navigate to `challengeApp` directory:
   ```sh
   cd challengeApp
   ```
2. Configure your MySQL database in `src/main/resources/application.properties`.
3. Build and run the backend:
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
If you add new fields (e.g., phone, address), update your MySQL schema accordingly. Example:
```sql
ALTER TABLE users ADD COLUMN phone VARCHAR(255);
ALTER TABLE users ADD COLUMN address VARCHAR(255);
ALTER TABLE users ADD COLUMN city VARCHAR(255);
ALTER TABLE users ADD COLUMN postalCode VARCHAR(255);
```

## Usage
- Access the frontend at `http://localhost:5173`
- Backend runs at `http://localhost:8080`
- Default admin/user roles supported

## Notes
- Product images are stored in `challengeApp/uploads/products/`
- Update CORS settings in backend if deploying to production

---

**Developed as a coding challenge project.** 