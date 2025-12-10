# BarberBook Backend API

## 🎯 Project Overview

**BarberBook Backend** is a RESTful API built with Node.js and Express.js for managing barber appointments. The system supports customer bookings, barber management, and appointment scheduling without requiring an external database—all data is stored in JSON files.

### Key Features

- ✅ User authentication with JWT
- ✅ Role-based access control (Customer/Barber)
- ✅ Barber listing and profile management
- ✅ Appointment booking with conflict detection
- ✅ Calendar view for barbers
- ✅ File-based storage (JSON files)
- ✅ Comprehensive unit tests
- ✅ Input validation and error handling

---

## 📁 Project Structure

```
BarberBook-Backend/
├── src/
│   ├── controllers/         # Request handlers
│   │   ├── authController.js
│   │   ├── barberController.js
│   │   └── appointmentController.js
│   ├── routes/              # API routes
│   │   ├── authRoutes.js
│   │   ├── barberRoutes.js
│   │   └── appointmentRoutes.js
│   ├── middleware/          # Custom middleware
│   │   ├── auth.js          # JWT authentication
│   │   ├── validate.js      # Validation middleware
│   │   └── errorHandler.js  # Error handling
│   ├── services/            # Business logic
│   │   └── dataStore.js     # File-based data management
│   ├── utils/               # Helper functions
│   │   ├── jwt.js           # JWT utilities
│   │   ├── password.js      # Password hashing
│   │   └── response.js      # Response formatters
│   ├── data/                # JSON data files
│   │   ├── users.json
│   │   ├── barbers.json
│   │   └── appointments.json
│   ├── app.js               # Express app setup
│   └── server.js            # Server entry point
├── tests/                   # Unit tests
│   ├── auth.test.js
│   ├── barber.test.js
│   └── appointment.test.js
├── package.json
├── .env.example
├── .gitignore
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js 16+ and npm
- A terminal/command line

### Installation

1. **Navigate to backend directory**

   ```bash
   cd BarberBook-Backend
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Create environment file**

   ```bash
   cp .env.example .env
   ```

4. **Start the server**

   ```bash
   # Development mode with auto-reload
   npm run dev

   # Production mode
   npm start
   ```

5. **Server will run on**
   ```
   http://localhost:5000
   ```

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch
```

---

## 📊 Data Models

### User Schema

```json
{
  "id": "user_1",
  "name": "John Doe",
  "email": "john@example.com",
  "passwordHash": "$2a$10$...",
  "phone": "+1234567890",
  "role": "customer", // or "barber"
  "barberId": "1", // Only for barber role
  "createdAt": "2025-12-01T10:00:00.000Z"
}
```

### Barber Schema

```json
{
  "id": "1",
  "name": "John Smith",
  "rating": 4.8,
  "totalReviews": 127,
  "photo": "https://...",
  "bio": "Professional barber...",
  "location": "123 Main Street",
  "workingHours": {
    "monday": "09:00-18:00",
    "tuesday": "09:00-18:00",
    ...
  },
  "services": [
    {
      "id": "s1",
      "name": "Haircut",
      "duration": 30,
      "price": 25
    }
  ],
  "gallery": ["image1.jpg", "image2.jpg"]
}
```

### Appointment Schema

```json
{
  "id": "appt_1",
  "barberId": "1",
  "customerId": "user_1",
  "serviceId": "s1",
  "date": "2025-12-15",
  "time": "10:00",
  "duration": 30,
  "price": 25,
  "status": "confirmed", // confirmed, cancelled, completed
  "notes": "",
  "createdAt": "2025-12-08T14:30:00.000Z"
}
```

---

## 🔐 Authentication

All private routes require a JWT token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

**Demo Credentials:**

- Customer: `demo@customer.com` / `password`
- Barber 1: `john@barberbook.com` / `password`
- Barber 2: `mike@barberbook.com` / `password`
- Barber 3: `carlos@barberbook.com` / `password`

---

## 📡 API Endpoints

### Base URL: `http://localhost:5000/api`

---

### **Authentication Endpoints**

#### 1. Register User

```http
POST /api/auth/register
```

**Request Body:**

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "phone": "+1234567890",
  "role": "customer" // optional, defaults to "customer"
}
```

**Success Response (201):**

```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "user_123",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "customer",
      "createdAt": "2025-12-09T10:00:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

**Error Response (400):**

```json
{
  "success": false,
  "message": "User with this email already exists"
}
```

---

#### 2. Login User

```http
POST /api/auth/login
```

**Request Body:**

```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Success Response (200):**

```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "user_123",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "customer"
    },
    "token": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

**Error Response (401):**

```json
{
  "success": false,
  "message": "Invalid email or password"
}
```

---

#### 3. Get Current User

```http
GET /api/auth/me
```

**Headers:**

```
Authorization: Bearer <token>
```

**Success Response (200):**

```json
{
  "success": true,
  "message": "User retrieved successfully",
  "data": {
    "id": "user_123",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "customer"
  }
}
```

---

### **Barber Endpoints** (Public)

#### 4. Get All Barbers

```http
GET /api/barbers
```

**Success Response (200):**

```json
{
  "success": true,
  "message": "Barbers retrieved successfully",
  "data": [
    {
      "id": "1",
      "name": "John Smith",
      "rating": 4.8,
      "totalReviews": 127,
      "photo": "https://...",
      "bio": "Professional barber...",
      "location": "123 Main Street",
      "workingHours": { ... },
      "services": [ ... ],
      "gallery": [ ... ]
    }
  ]
}
```

---

#### 5. Get Barber by ID

```http
GET /api/barbers/:id
```

**Success Response (200):**

```json
{
  "success": true,
  "message": "Barber retrieved successfully",
  "data": {
    "id": "1",
    "name": "John Smith",
    "services": [
      {
        "id": "s1",
        "name": "Haircut",
        "duration": 30,
        "price": 25
      }
    ]
  }
}
```

**Error Response (404):**

```json
{
  "success": false,
  "message": "Barber not found"
}
```

---

#### 6. Get Barber Availability

```http
GET /api/barbers/:id/availability?date=2025-12-15
```

**Query Parameters:**

- `date` (required): Date in YYYY-MM-DD format

**Success Response (200):**

```json
{
  "success": true,
  "message": "Availability retrieved successfully",
  "data": {
    "barberId": "1",
    "date": "2025-12-15",
    "workingHours": {
      "monday": "09:00-18:00"
    },
    "bookedSlots": [
      {
        "time": "10:00",
        "duration": 30
      }
    ]
  }
}
```

---

### **Appointment Endpoints** (Private)

#### 7. Create Appointment

```http
POST /api/appointments
```

**Headers:**

```
Authorization: Bearer <customer_token>
```

**Request Body:**

```json
{
  "barberId": "1",
  "serviceId": "s1",
  "date": "2025-12-15",
  "time": "10:00",
  "duration": 30,
  "price": 25,
  "notes": "Please use short scissors"
}
```

**Success Response (201):**

```json
{
  "success": true,
  "message": "Appointment created successfully",
  "data": {
    "id": "appt_123",
    "barberId": "1",
    "customerId": "user_123",
    "serviceId": "s1",
    "date": "2025-12-15",
    "time": "10:00",
    "duration": 30,
    "price": 25,
    "status": "confirmed",
    "createdAt": "2025-12-09T10:00:00.000Z"
  }
}
```

**Error Response (409):**

```json
{
  "success": false,
  "message": "Time slot is already booked"
}
```

---

#### 8. Get Appointments

```http
GET /api/appointments
```

**Headers:**

```
Authorization: Bearer <token>
```

**Success Response (200):**

```json
{
  "success": true,
  "message": "Appointments retrieved successfully",
  "data": [
    {
      "id": "appt_123",
      "barberId": "1",
      "barberName": "John Smith",
      "customerId": "user_123",
      "customerName": "John Doe",
      "customerEmail": "john@example.com",
      "date": "2025-12-15",
      "time": "10:00",
      "duration": 30,
      "price": 25,
      "status": "confirmed"
    }
  ]
}
```

---

#### 9. Get Single Appointment

```http
GET /api/appointments/:id
```

**Headers:**

```
Authorization: Bearer <token>
```

**Success Response (200):**

```json
{
  "success": true,
  "message": "Appointment retrieved successfully",
  "data": {
    "id": "appt_123",
    "barberName": "John Smith",
    "customerName": "John Doe",
    "date": "2025-12-15",
    "time": "10:00"
  }
}
```

---

#### 10. Update Appointment

```http
PUT /api/appointments/:id
```

**Headers:**

```
Authorization: Bearer <token>
```

**Request Body:**

```json
{
  "status": "completed",
  "notes": "Customer was satisfied"
}
```

**Success Response (200):**

```json
{
  "success": true,
  "message": "Appointment updated successfully",
  "data": {
    "id": "appt_123",
    "status": "completed",
    "notes": "Customer was satisfied"
  }
}
```

---

#### 11. Delete Appointment

```http
DELETE /api/appointments/:id
```

**Headers:**

```
Authorization: Bearer <customer_token>
```

**Success Response (200):**

```json
{
  "success": true,
  "message": "Appointment deleted successfully"
}
```

---

#### 12. Get Calendar View (Barber Only)

```http
GET /api/appointments/calendar?startDate=2025-12-01&endDate=2025-12-31
```

**Headers:**

```
Authorization: Bearer <barber_token>
```

**Query Parameters:**

- `startDate` (optional): Start date in YYYY-MM-DD format
- `endDate` (optional): End date in YYYY-MM-DD format

**Success Response (200):**

```json
{
  "success": true,
  "message": "Calendar retrieved successfully",
  "data": {
    "2025-12-15": [
      {
        "id": "appt_123",
        "time": "10:00",
        "duration": 30,
        "customerName": "John Doe",
        "customerPhone": "+1234567890",
        "serviceId": "s1",
        "status": "confirmed",
        "price": 25
      }
    ],
    "2025-12-16": []
  }
}
```

---

## 🧪 Testing

### Test Structure

The project includes comprehensive unit tests using **Jest** and **Supertest**:

1. **Authentication Tests** (`tests/auth.test.js`)

   - User registration
   - User login
   - Get current user
   - Token validation

2. **Barber Tests** (`tests/barber.test.js`)

   - List all barbers
   - Get barber details
   - Get availability

3. **Appointment Tests** (`tests/appointment.test.js`)
   - Create appointment
   - Get appointments (customer & barber)
   - Update appointment
   - Delete appointment
   - Calendar view
   - Double-booking prevention

### Running Tests

```bash
# Run all tests with coverage
npm test

# Watch mode (re-run on file changes)
npm run test:watch
```

### Test Coverage

The tests cover:

- ✅ Successful operations
- ✅ Validation errors
- ✅ Authentication failures
- ✅ Authorization checks
- ✅ Data conflicts (double booking)
- ✅ Edge cases

---

## 🔒 Security Features

1. **Password Hashing**: bcrypt with salt rounds
2. **JWT Authentication**: Secure token-based auth
3. **Role-Based Access**: Customer vs Barber permissions
4. **Input Validation**: express-validator for all inputs
5. **CORS Configuration**: Controlled cross-origin requests
6. **Error Handling**: No sensitive data in error messages

---

## 🛠 Technical Implementation

### Architecture

**Layered Architecture:**

1. **Routes**: Define endpoints and validation rules
2. **Controllers**: Handle requests and responses
3. **Services**: Business logic and data operations
4. **Middleware**: Authentication, validation, error handling
5. **Utils**: Reusable helper functions

### Data Storage

**File-Based Storage (dataStore.js):**

- All data stored in JSON files (`src/data/`)
- In-memory caching for performance
- Automatic file sync on changes
- Conflict detection for appointments
- No external database required

### Key Technologies

- **Express.js**: Web framework
- **bcryptjs**: Password hashing
- **jsonwebtoken**: JWT authentication
- **express-validator**: Input validation
- **cors**: Cross-origin resource sharing
- **morgan**: HTTP request logging
- **Jest**: Testing framework
- **Supertest**: API testing

---

## 📈 Future Enhancements

### Suggested Improvements for Production:

1. **Database Integration**

   - Migrate to MongoDB/PostgreSQL
   - Add database migrations
   - Implement connection pooling

2. **Advanced Features**

   - Email notifications (nodemailer)
   - SMS reminders (Twilio)
   - Payment integration (Stripe)
   - File upload for barber photos (multer)
   - Real-time updates (Socket.io)

3. **Security Enhancements**

   - Rate limiting (express-rate-limit)
   - Helmet.js for HTTP headers
   - Input sanitization
   - Refresh tokens
   - Two-factor authentication

4. **Performance**

   - Redis caching
   - Database indexing
   - Query optimization
   - CDN for static assets

5. **DevOps**

   - Docker containerization
   - CI/CD pipeline
   - Monitoring (PM2, New Relic)
   - Logging (Winston, ELK stack)
   - Load balancing

6. **API Enhancements**
   - Pagination for large datasets
   - Search and filtering
   - API versioning
   - GraphQL support
   - WebSocket for real-time

---

## 🐛 Error Codes

| Code | Description                               |
| ---- | ----------------------------------------- |
| 200  | Success                                   |
| 201  | Created                                   |
| 400  | Bad Request (validation error)            |
| 401  | Unauthorized (authentication required)    |
| 403  | Forbidden (insufficient permissions)      |
| 404  | Not Found                                 |
| 409  | Conflict (e.g., time slot already booked) |
| 500  | Internal Server Error                     |

---

## 📝 Environment Variables

```env
PORT=5000
NODE_ENV=development
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRE=7d
FRONTEND_URL=http://localhost:8000
```

---

## 🎓 Learning Outcomes

This project demonstrates:

1. **RESTful API Design**: Proper HTTP methods, status codes, resource naming
2. **Authentication & Authorization**: JWT, role-based access control
3. **Validation**: Input validation, error handling
4. **Testing**: Unit tests, integration tests, test coverage
5. **Code Organization**: Modular architecture, separation of concerns
6. **Security**: Password hashing, token validation, CORS
7. **Data Management**: File-based storage, conflict resolution
8. **Documentation**: API documentation, code comments

---

## 📞 Support

For questions or issues:

- Review inline code comments
- Check error messages in console
- Run tests to verify functionality
- Ensure all dependencies are installed

---

## 📄 License

This is an educational project for Software Engineering coursework.

---

**Built with ❤️ for Software Engineering Final Project**

_Last Updated: December 2025_
