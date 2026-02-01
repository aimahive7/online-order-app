# Bakery Management System - Setup Instructions

## Quick Start

### 1. Install Dependencies
```bash
# Install all dependencies (root, server, client)
npm run install-all
```

### 2. Environment Setup
```bash
# Copy environment files
cd server
cp .env.example .env

# Edit the .env file with your settings
# MONGODB_URI=mongodb://localhost:27017/bakery_management
# JWT_SECRET=your_super_secret_jwt_key_here
```

### 3. Start MongoDB
```bash
# If using local MongoDB
mongod

# Or use MongoDB Atlas (update .env with Atlas URL)
```

### 4. Run the Application
```bash
# Start both backend and frontend in development mode
npm run dev

# Or start separately:
# Backend: cd server && npm run dev
# Frontend: cd client && npm start
```

## Access Points

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000/api
- **Health Check**: http://localhost:5000/api/health

## Default Test Accounts

After starting the application, you can create these test accounts:

### Customer Account
- Email: customer@test.com
- Password: password123
- Role: Customer

### Baker Account  
- Email: baker@test.com
- Password: password123
- Role: Bakery Owner

### Delivery Account
- Email: delivery@test.com  
- Password: password123
- Role: Delivery Boy

### Admin Account
- Email: admin@test.com
- Password: password123
- Role: Admin

## First Time Setup

1. **Register an Admin Account**
   - Go to http://localhost:3000/register
   - Fill in details and select "Admin" as role
   - Note: Admin approval not required in development

2. **Register a Bakery Owner**
   - Register new account with "Bakery Owner" role
   - Login and go to bakery profile
   - Register the bakery (requires admin approval in production)

3. **Test the Flow**
   - Register as customer
   - Select your city from the popup
   - Browse products and add to cart
   - Place an order
   - Login as baker to manage orders
   - Login as delivery boy to see assigned orders

## Development Tips

- Use Chrome DevTools for debugging
- Check browser console for any errors
- API calls are logged in the browser network tab
- Server logs show in the terminal

## Common Issues

### Port Already in Use
```bash
# Kill process on port 5000
lsof -ti:5000 | xargs kill -9

# Or change port in server/.env
PORT=5001
```

### MongoDB Connection Error
- Ensure MongoDB is running
- Check connection string in .env
- For MongoDB Atlas, whitelist your IP address

### Frontend Not Loading
- Check if backend is running
- Verify REACT_APP_API_URL if using custom port
- Clear browser cache and refresh

## Production Deployment

### Build Frontend
```bash
cd client
npm run build
```

### Configure Production Variables
```bash
# server/.env
NODE_ENV=production
MONGODB_URI=mongodb+srv://...
JWT_SECRET=your_production_secret
```

### Start Production Server
```bash
cd server
npm start
```

The build files will be served from the `/build` directory.

## Need Help?

- Check the console for error messages
- Verify all environment variables are set
- Ensure MongoDB is accessible
- Review the API documentation in the README

Happy coding! 🧁