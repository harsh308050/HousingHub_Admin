# Housing Hub Admin Panel

A modern, responsive admin panel built with React + Vite and Bootstrap for managing the Housing Hub platform.

## 🚀 Features

- **Dashboard**: Overview of key metrics and statistics
- **Properties Management**: Add, edit, and manage property listings
- **User Management**: Manage customers and agents
- **Bookings**: Track and manage property bookings
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Modern UI**: Built with Bootstrap and React Bootstrap components

## 📁 Project Structure

```
src/
├── components/
│   └── Layout/
│       ├── MainLayout.jsx    # Main layout wrapper
│       ├── Header.jsx         # Top navigation bar
│       ├── Sidebar.jsx        # Side navigation menu
│       └── *.css             # Component styles
├── pages/
│   ├── Dashboard.jsx          # Dashboard page
│   ├── Properties.jsx         # Properties management
│   ├── Users.jsx             # User management
│   ├── Bookings.jsx          # Bookings management
│   └── Login.jsx             # Login page
├── services/                  # API services (to be implemented)
├── utils/                     # Utility functions
├── App.jsx                    # Main app component with routes
├── main.jsx                   # Entry point
└── index.css                  # Global styles
```

## 🛠️ Technologies Used

- **React 18**: Modern React with hooks
- **Vite**: Next-generation frontend tooling
- **React Router DOM**: Client-side routing
- **Bootstrap 5**: CSS framework
- **React Bootstrap**: Bootstrap components for React

## 📦 Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser and navigate to `http://localhost:5173`

## 🏗️ Build for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## 📝 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🔐 Authentication

Currently, the authentication is set to `true` by default for development. You'll need to implement proper authentication logic in the `App.jsx` file.

## 🎨 Customization

### Colors

You can customize the color scheme by modifying the CSS variables in `src/App.css`:

```css
:root {
  --primary-color: #2c3e50;
  --secondary-color: #3498db;
  --success-color: #27ae60;
  --danger-color: #e74c3c;
  --warning-color: #f39c12;
}
```

### Sidebar Menu

Add or modify menu items in `src/components/Layout/Sidebar.jsx`:

```javascript
const menuItems = [
  { path: '/dashboard', icon: '📊', label: 'Dashboard' },
  // Add more items here
]
```

## 📱 Responsive Design

The admin panel is fully responsive and works on:
- Desktop (1200px+)
- Tablet (768px - 1199px)
- Mobile (< 768px)

## 🚧 Future Enhancements

- [ ] Implement real authentication
- [ ] Connect to backend API
- [ ] Add data visualization charts
- [ ] Implement real-time notifications
- [ ] Add file upload functionality
- [ ] Create detailed property/user/booking forms
- [ ] Add search and filter functionality
- [ ] Implement pagination
- [ ] Add dark mode support

## 📄 License

MIT

## 👥 Contributing

Feel free to contribute to this project by creating pull requests or reporting issues.

