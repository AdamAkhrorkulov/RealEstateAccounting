# Учёт Недвижимости - Frontend

Modern React + TypeScript frontend for Real Estate Accounting system.

## 🚀 Tech Stack

- **React 18** with TypeScript
- **Vite** - Fast build tool
- **Tailwind CSS** - Modern styling
- **React Router** - Navigation
- **Axios** - API communication
- **Recharts** - Data visualization
- **Zustand** - State management
- **date-fns** - Date handling
- **Lucide React** - Modern icons

## 📋 Features

- ✅ Authentication (Login/Logout)
- ✅ Dashboard with charts and statistics
- ✅ Apartments management (CRUD)
- ✅ Customers management (CRUD)
- ✅ Agents management (CRUD)
- ✅ Contracts management
- ✅ Payments tracking
- ✅ Role-based access control
- ✅ Fully in Russian language
- ✅ Responsive design

## 🛠️ Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 🔧 Configuration

The application connects to the backend API at `http://localhost:5000/api` by default.

To change this, edit `vite.config.ts`:

```typescript
server: {
  port: 3000,
  proxy: {
    '/api': {
      target: 'http://localhost:5000', // Change this
      changeOrigin: true,
    },
  },
}
```

## 🔐 Default Login

```
Email: admin@realestate.com
Password: Admin@123
```

## 📁 Project Structure

```
client/
├── src/
│   ├── components/       # Reusable components
│   │   ├── common/      # Common components (Modal, LoadingSpinner, etc.)
│   │   └── layout/      # Layout components (Sidebar, Layout)
│   ├── contexts/        # React contexts (AuthContext)
│   ├── pages/           # Page components
│   │   ├── Login.tsx
│   │   ├── Dashboard.tsx
│   │   ├── Apartments.tsx
│   │   ├── Customers.tsx
│   │   ├── Agents.tsx
│   │   ├── Contracts.tsx
│   │   └── Payments.tsx
│   ├── services/        # API services
│   │   └── api.ts
│   ├── types/           # TypeScript types
│   │   └── index.ts
│   ├── utils/           # Utility functions
│   │   ├── format.ts
│   │   └── validation.ts
│   ├── App.tsx          # Main app component with routing
│   ├── main.tsx         # Entry point
│   └── index.css        # Global styles
├── public/              # Static assets
├── index.html           # HTML template
├── package.json         # Dependencies
├── tsconfig.json        # TypeScript config
├── vite.config.ts       # Vite config
├── tailwind.config.js   # Tailwind config
└── postcss.config.js    # PostCSS config
```

## 🎨 Customization

### Colors

Edit `tailwind.config.js` to change the primary color:

```javascript
theme: {
  extend: {
    colors: {
      primary: {
        // Change these values
        500: '#3b82f6',
        600: '#2563eb',
        700: '#1d4ed8',
      },
    },
  },
}
```

### Russian Language

All text strings are hardcoded in Russian in the component files. To change any labels, edit the respective page component in `src/pages/`.

## 🌐 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## 📝 License

Private project for Real Estate Accounting system.
