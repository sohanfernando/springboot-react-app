# FashionHub - Fitness & Activewear E-commerce

A modern, responsive e-commerce website built with React and Tailwind CSS, specializing in fitness and activewear clothing for men and women.

![FashionHub Preview](https://img.shields.io/badge/React-18.0.0-blue?logo=react)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.0.0-38B2AC?logo=tailwind-css)
![Vite](https://img.shields.io/badge/Vite-4.0.0-646CFF?logo=vite)

## 🚀 Features

### 🛍️ E-commerce Functionality
- **Product Catalog**: Browse products by category (Men, Women, Accessories)
- **Advanced Filtering**: Filter by availability, price range, size, color, and category
- **Product Search**: Find products quickly with search functionality
- **Shopping Cart**: Add/remove items with real-time cart updates
- **Wishlist**: Save favorite products for later
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices

### 👥 User Management
- **User Authentication**: Secure login and signup system
- **Role-based Access**: Support for regular users and administrators
- **Profile Management**: User account management
- **Session Management**: Persistent login sessions

### 🎨 Modern UI/UX
- **Hero Section**: Dynamic carousel with call-to-action buttons
- **Product Cards**: Interactive cards with hover effects and quick actions
- **Navigation**: Sticky navbar with search, cart, and user actions
- **Footer**: Comprehensive footer with links, newsletter signup, and social media
- **Loading States**: Smooth loading animations and transitions
- **Mobile Responsive**: Fully responsive design across all devices

### 📱 Responsive Design
- **Mobile-First**: Optimized for mobile devices
- **Tablet Support**: Responsive layout for tablet screens
- **Desktop Experience**: Enhanced experience for larger screens
- **Touch-Friendly**: Optimized touch interactions for mobile

## 🛠️ Tech Stack

### Frontend
- **React 18**: Modern React with hooks and functional components
- **Vite**: Fast build tool and development server
- **Tailwind CSS**: Utility-first CSS framework
- **React Router**: Client-side routing
- **Axios**: HTTP client for API requests
- **React Icons**: Icon library for UI elements

### State Management
- **React Context**: Global state management for authentication and cart
- **Local State**: Component-level state management with useState

### Styling & UI
- **Tailwind CSS**: Utility-first styling
- **Custom CSS**: Additional custom styles
- **Responsive Design**: Mobile-first approach
- **Animations**: Smooth transitions and hover effects

## 📁 Project Structure

```
frontend/
├── public/
│   ├── icon.png
│   └── index.html
├── src/
│   ├── assets/
│   │   ├── Accessories/          # Accessory product images
│   │   ├── Crop tops/           # Women's crop top images
│   │   ├── Dresses/             # Women's dress images
│   │   ├── Joggers & Pants/     # Pants and joggers images
│   │   ├── Shirts/              # Shirt product images
│   │   ├── Shorts/              # Shorts product images
│   │   ├── Sports bra/          # Sports bra images
│   │   ├── T-shirts/            # T-shirt product images
│   │   └── Videos/              # Video assets
│   ├── components/
│   │   ├── AccessoriesSection.jsx
│   │   ├── BestSellersSection.jsx
│   │   ├── Footer.jsx
│   │   ├── HeroSection.jsx
│   │   ├── LatestSection.jsx
│   │   ├── MenFilter.jsx
│   │   ├── MenSection.jsx
│   │   ├── Navbar.jsx
│   │   ├── ProductAlertSection.jsx
│   │   ├── ProductCard.jsx
│   │   ├── WomenFilter.jsx
│   │   └── WomenSection.jsx
│   ├── context/
│   │   └── AuthContext.jsx      # Global authentication context
│   ├── pages/
│   │   ├── AboutUsPage.jsx
│   │   ├── AccessoriesPage.jsx
│   │   ├── AdminHomePage.jsx
│   │   ├── HomePage.jsx
│   │   ├── LatestPage.jsx
│   │   ├── LoginPage.jsx
│   │   ├── MenPage.jsx
│   │   ├── SignUpPage.jsx
│   │   └── WomenPage.jsx
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
├── package.json
├── tailwind.config.js
├── vite.config.js
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- Node.js (version 16 or higher)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173` to view the application

### Build for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## 📱 Pages & Features

### 🏠 Home Page
- **Hero Section**: Dynamic carousel with fashion images
- **Latest Products**: Showcase of newest arrivals
- **Men's Section**: Featured men's clothing
- **Women's Section**: Featured women's clothing
- **Accessories Section**: Featured accessories
- **Product Alert**: Newsletter signup with benefits
- **Video Section**: Brand video with interactive elements

### 👕 Men's Page
- **Product Grid**: Display of men's clothing items
- **Advanced Filters**: Category, availability, price, size, color filters
- **Sorting Options**: Price low to high, high to low
- **Responsive Layout**: Optimized for all screen sizes

### 👗 Women's Page
- **Product Grid**: Display of women's clothing items
- **Advanced Filters**: Category, availability, price, size, color filters
- **Sorting Options**: Price low to high, high to low
- **Responsive Layout**: Optimized for all screen sizes

### 🎒 Accessories Page
- **Product Grid**: Display of accessory items
- **Category Filtering**: Filter by accessory type
- **Responsive Design**: Mobile-friendly layout

### 🔐 Authentication Pages
- **Login Page**: Modern split-layout design with image
- **Signup Page**: User registration with role selection
- **Form Validation**: Client-side validation and error handling
- **Loading States**: Smooth loading animations

### ℹ️ About Us Page
- **Company Information**: Brand story and mission
- **Team Section**: Meet the team members
- **Contact Information**: Social media links and contact details
- **Modern Design**: Card-based layout with gradients

## 🎨 Design System

### Color Palette
- **Primary**: Red (#EF4444) - Brand color for CTAs and accents
- **Secondary**: Blue (#3B82F6) - Supporting color
- **Neutral**: Gray scale for text and backgrounds
- **Success**: Green for positive actions
- **Warning**: Yellow for alerts
- **Error**: Red for errors

### Typography
- **Headings**: Bold, modern sans-serif fonts
- **Body Text**: Clean, readable font for content
- **Buttons**: Semi-bold for call-to-action elements

### Components
- **Cards**: Rounded corners with subtle shadows
- **Buttons**: Gradient backgrounds with hover effects
- **Forms**: Clean inputs with focus states
- **Navigation**: Sticky navbar with smooth transitions

## 🔧 Configuration

### Tailwind CSS
The project uses Tailwind CSS for styling. Configuration can be found in `tailwind.config.js`.

### Vite Configuration
Build and development settings are configured in `vite.config.js`.

### Environment Variables
Create a `.env` file in the root directory for environment-specific variables:

```env
VITE_API_URL=http://localhost:8080
```

## 📦 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🌟 Key Features

### Shopping Experience
- **Product Browsing**: Easy navigation through product categories
- **Advanced Filtering**: Multiple filter options for precise product search
- **Wishlist Management**: Save and manage favorite products
- **Shopping Cart**: Add items and manage quantities
- **Responsive Design**: Seamless experience across all devices

### User Interface
- **Modern Design**: Clean, contemporary aesthetic
- **Smooth Animations**: Subtle transitions and hover effects
- **Accessibility**: Keyboard navigation and screen reader support
- **Performance**: Optimized loading and rendering

### Admin Features
- **Role-based Access**: Admin dashboard for administrators
- **User Management**: Manage user accounts and roles
- **Product Management**: Add, edit, and remove products

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation

## 🚀 Deployment

### Vercel
1. Connect your GitHub repository to Vercel
2. Configure build settings
3. Deploy automatically on push

### Netlify
1. Connect your repository to Netlify
2. Set build command: `npm run build`
3. Set publish directory: `dist`

### Other Platforms
The built files in the `dist` directory can be deployed to any static hosting service.

---

**FashionHub** - Where Style Meets Performance 🏃‍♀️💪
