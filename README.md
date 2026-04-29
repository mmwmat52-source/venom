# Venom Store - Modern E-commerce Platform

## 🚀 Features

- **Modern UI**: Built with React, TypeScript, and Tailwind CSS
- **Product Management**: Browse, search, and filter products
- **Shopping Cart**: Add/remove items and manage quantities
- **User Authentication**: Secure login and registration
- **Admin Dashboard**: Manage products and orders
- **Responsive Design**: Works on all devices
- **State Management**: Zustand for efficient state handling
- **API Integration**: Axios for seamless backend communication

## 📋 Prerequisites

- Node.js 16+
- npm or yarn

## 🛠️ Installation

1. Clone the repository:
```bash
git clone https://github.com/mmwmat52-source/venom.git
cd venom
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env.local` file:
```
VITE_API_URL=http://localhost:5000/api
```

4. Start development server:
```bash
npm run dev
```

## 📁 Project Structure

```
venom/
├── src/
│   ├── components/      # Reusable React components
│   ├── pages/          # Page components
│   ├── services/       # API services
│   ├── store/          # Zustand stores
│   ├── types/          # TypeScript types
│   ├── App.tsx         # Main App component
│   ├── main.tsx        # Entry point
│   └── index.css       # Global styles
├── public/             # Static files
├── package.json        # Dependencies
├── tsconfig.json       # TypeScript config
├── vite.config.ts      # Vite config
└── tailwind.config.ts  # Tailwind config
```

## 🎨 Available Pages

- `/` - Home page
- `/products` - Products listing
- `/products/:id` - Product details
- `/cart` - Shopping cart
- `/checkout` - Checkout process
- `/login` - User login
- `/register` - User registration
- `/admin` - Admin dashboard
- `/admin/products` - Manage products
- `/admin/orders` - Manage orders

## 🔧 Technologies Used

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **HTTP Client**: Axios
- **Icons**: Lucide React
- **Routing**: React Router v6

## 📦 Build for Production

```bash
npm run build
```

## 📝 License

MIT License

## 👨‍💻 Author

Venom Store Team
