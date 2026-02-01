# Bakery Management System

A complete bakery management system with customer ordering, baker management, delivery tracking, and admin controls.

## Features

### Customer Module
- Browse bakeries by city
- Product catalog with categories (Cakes, Pastries, Cookies, Custom)
- Shopping cart with custom messages and weight options
- Order placement with delivery scheduling
- Real-time order tracking
- Order history

### Baker Module
- Bakery registration and profile management
- Product management with images, pricing, and availability
- Order management and status updates
- Assign delivery boys to orders
- Revenue tracking

### Delivery Boy Module
- View assigned orders
- Order pickup confirmation
- Delivery status updates
- Delivery history
- Customer contact information

### Admin Module
- User management and approval
- Bakery approval system
- Order monitoring
- Revenue analytics
- System settings

## Technology Stack

### Backend
- Node.js with Express.js
- MongoDB with Mongoose
- JWT Authentication
- Multer for file uploads
- Express Validator
- Helmet for security
- Rate Limiting

### Frontend
- React 18 with React Router
- Tailwind CSS for styling
- Axios for API calls
- React Toastify for notifications
- Lucide React for icons
- React DatePicker

## Installation

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Backend Setup

1. Navigate to server directory:
```bash
cd server
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file:
```bash
cp .env.example .env
```

4. Update .env file with your configuration:
```
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/bakery_management
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRE=7d
```

5. Start the server:
```bash
npm run dev
```

### Frontend Setup

1. Navigate to client directory:
```bash
cd client
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file (optional):
```bash
echo "REACT_APP_API_URL=http://localhost:5000/api" > .env
```

4. Start the React app:
```bash
npm start
```

### Quick Start (Root Directory)

1. Install all dependencies:
```bash
npm run install-all
```

2. Start both backend and frontend:
```bash
npm run dev
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Bakeries
- `GET /api/bakeries` - Get all bakeries
- `GET /api/bakeries/my` - Get my bakery (Baker only)
- `POST /api/bakeries` - Create bakery (Baker only)
- `PUT /api/bakeries/my` - Update bakery (Baker only)

### Products
- `GET /api/products` - Get products
- `GET /api/products/my` - Get my products (Baker only)
- `POST /api/products` - Create product (Baker only)
- `PUT /api/products/:id` - Update product (Baker only)
- `DELETE /api/products/:id` - Delete product (Baker only)

### Orders
- `POST /api/orders` - Create order (Customer only)
- `GET /api/orders/my` - Get my orders
- `GET /api/orders/:id` - Get order details
- `PUT /api/orders/:id/status` - Update order status
- `PUT /api/orders/:id/assign` - Assign delivery boy

### Admin
- `GET /api/admin/dashboard` - Dashboard stats
- `GET /api/admin/users` - Get users
- `GET /api/admin/bakeries` - Get bakeries
- `PUT /api/admin/bakeries/:id/approve` - Approve bakery
- `PUT /api/admin/users/:id/block` - Block/unblock user
- `GET /api/admin/orders` - Get all orders

## Database Schema

### Users Collection
```javascript
{
  _id: ObjectId,
  name: String,
  email: String,
  password: String,
  role: String, // customer, baker, delivery, admin
  phone: String,
  isApproved: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### Bakeries Collection
```javascript
{
  _id: ObjectId,
  owner_id: ObjectId,
  bakery_name: String,
  city: String,
  address: String,
  rating: Number,
  is_approved: Boolean,
  image_url: String,
  description: String,
  createdAt: Date,
  updatedAt: Date
}
```

### Products Collection
```javascript
{
  _id: ObjectId,
  bakery_id: ObjectId,
  name: String,
  description: String,
  price: Number,
  weight_options: Array,
  egg_type: String, // egg, eggless, both
  category: String, // cake, pastry, cookie, custom
  image_url: String,
  is_available: Boolean,
  custom_message_available: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### Orders Collection
```javascript
{
  _id: ObjectId,
  customer_id: ObjectId,
  bakery_id: ObjectId,
  delivery_boy_id: ObjectId,
  total_amount: Number,
  status: String, // ordered, confirmed, baking, ready, out_for_delivery, delivered, cancelled
  delivery_date: Date,
  delivery_time: String,
  delivery_address: String,
  customer_phone: String,
  special_instructions: String,
  payment_method: String, // cod, online
  payment_status: String, // pending, paid, failed
  createdAt: Date,
  updatedAt: Date
}
```

### Order_Items Collection
```javascript
{
  _id: ObjectId,
  order_id: ObjectId,
  product_id: ObjectId,
  quantity: Number,
  price: Number,
  weight: String,
  egg_type: String,
  custom_message: String,
  createdAt: Date,
  updatedAt: Date
}
```

## Default Roles and Access

### Customer
- Browse products and bakeries
- Place orders
- Track orders
- View order history

### Baker
- Manage bakery profile
- Add/edit/delete products
- Accept/reject orders
- Update order status
- Assign delivery boys
- View earnings

### Delivery Boy
- View assigned orders
- Update delivery status
- View delivery history
- Contact customers

### Admin
- Manage all users
- Approve/block bakeries
- View all orders
- Monitor system activity
- Control platform settings

## Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Role-based access control
- Protected routes
- Input validation and sanitization
- Rate limiting
- CORS configuration
- Helmet security headers

## File Upload

Product and bakery images are uploaded to the `/uploads` directory. Supported formats:
- JPEG
- PNG
- GIF
- WebP

Maximum file size: 5MB per image

## Development

### Running Tests
```bash
# Backend tests
cd server && npm test

# Frontend tests
cd client && npm test
```

### Building for Production
```bash
# Build frontend
cd client && npm run build

# Start production server
cd server && npm start
```

### Environment Variables

#### Backend (.env)
- `NODE_ENV` - Environment (development/production)
- `PORT` - Server port
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - JWT secret key
- `JWT_EXPIRE` - JWT expiration time
- `UPLOAD_PATH` - File upload directory
- `MAX_FILE_SIZE` - Maximum file size

#### Frontend (.env)
- `REACT_APP_API_URL` - Backend API URL

## Deployment

### Using Docker
```bash
# Build images
docker-compose build

# Start containers
docker-compose up -d
```

### Manual Deployment
1. Build the React app: `cd client && npm run build`
2. Serve static files with Express or Nginx
3. Configure environment variables for production
4. Set up MongoDB database
5. Ensure HTTPS is enabled
6. Configure reverse proxy if needed

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the ISC License.

## Support

For issues and questions, please create an issue in the repository.