# 💈 BarberBook - Online Barber Appointment System

> **Software Engineering Final Project**  
> A full-stack web application for seamless barber appointment booking and management

[![Node.js](https://img.shields.io/badge/Node.js-20.x-green.svg)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-4.18-blue.svg)](https://expressjs.com/)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Deployment](https://img.shields.io/badge/deploy-Render-purple.svg)](https://render.com)

---

## 📑 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Deployment](#deployment)
- [API Documentation](#api-documentation)
- [Software Engineering Principles](#software-engineering-principles)
- [Testing](#testing)
- [Contributing](#contributing)
- [License](#license)

---

## 🎯 Overview

**BarberBook** is a modern web-based appointment management system designed to streamline the booking process between customers and barbers. The application provides an intuitive interface for customers to browse barbers, view available time slots, and book appointments, while enabling barbers to manage their schedules and view upcoming appointments.

### 🎓 Academic Context

This project was developed as part of the **Software Engineering** course final project, demonstrating practical application of:

- Software development lifecycle (SDLC)
- RESTful API design principles
- Authentication & authorization patterns
- Database design and data management
- Testing methodologies
- Deployment and DevOps practices
- Version control with Git/GitHub
- Documentation and code quality standards

---

## ✨ Features

### 👤 Customer Features

- **User Registration & Authentication** - Secure account creation with JWT-based authentication
- **Browse Barbers** - View detailed profiles of available barbers with ratings and reviews
- **Service Selection** - Choose from various services (haircut, beard trim, styling, etc.)
- **Real-time Availability** - Check barber availability and book time slots
- **Appointment Management** - View, modify, and cancel appointments
- **Personal Dashboard** - Track appointment history and upcoming bookings

### ✂️ Barber Features

- **Professional Profile** - Showcase services, pricing, and gallery
- **Appointment Calendar** - Visual calendar view of daily/weekly appointments
- **Customer Management** - Access customer information and appointment notes
- **Schedule Control** - Set working hours and availability
- **Appointment Status** - Mark appointments as completed or cancelled

### 🔐 Security Features

- Password hashing with bcrypt
- JWT token-based authentication
- Role-based access control (Customer/Barber)
- Input validation and sanitization
- CORS protection
- Secure environment variable management

---

## 🛠 Technology Stack

### Frontend

- **HTML5** - Semantic markup and structure
- **CSS3** - Modern styling with responsive design
- **JavaScript (ES6+)** - Interactive UI and API communication
- **Fetch API** - Asynchronous HTTP requests

### Backend

- **Node.js** - JavaScript runtime environment
- **Express.js** - Web application framework
- **bcryptjs** - Password hashing
- **jsonwebtoken** - JWT authentication
- **express-validator** - Input validation middleware

### Storage

- **JSON Files** - File-based data storage (users, barbers, appointments)
- _(Easily migratable to MongoDB/PostgreSQL for production)_

### DevOps & Deployment

- **Docker** - Containerization for consistent deployment
- **Render** - Cloud platform for hosting
- **Git/GitHub** - Version control and collaboration
- **Jest & Supertest** - Unit and integration testing

### Development Tools

- **Nodemon** - Auto-restart during development
- **Morgan** - HTTP request logging
- **dotenv** - Environment variable management
- **ESLint** - Code quality and consistency _(optional)_

---

## 📁 Project Structure

```
BarberBook-Project/
│
├── BarberBook/                          # Frontend Application
│   ├── index.html                       # Landing page
│   ├── login.html                       # User login page
│   ├── register.html                    # User registration page
│   ├── barber.html                      # Barber listing page
│   ├── booking.html                     # Appointment booking page
│   ├── customer-dashboard.html          # Customer dashboard
│   ├── barber-dashboard.html            # Barber dashboard
│   ├── app.js                           # Main JavaScript logic
│   ├── styles.css                       # Global styles
│   └── 404.html                         # Error page
│
├── BarberBook-Backend/                  # Backend API
│   ├── src/
│   │   ├── app.js                       # Express app configuration
│   │   ├── server.js                    # Server entry point
│   │   │
│   │   ├── controllers/                 # Request handlers
│   │   │   ├── authController.js        # Authentication logic
│   │   │   ├── barberController.js      # Barber operations
│   │   │   └── appointmentController.js # Appointment management
│   │   │
│   │   ├── routes/                      # API route definitions
│   │   │   ├── authRoutes.js            # /api/auth routes
│   │   │   ├── barberRoutes.js          # /api/barbers routes
│   │   │   └── appointmentRoutes.js     # /api/appointments routes
│   │   │
│   │   ├── middleware/                  # Custom middleware
│   │   │   ├── auth.js                  # JWT verification
│   │   │   ├── validate.js              # Input validation
│   │   │   └── errorHandler.js          # Error handling
│   │   │
│   │   ├── services/                    # Business logic
│   │   │   └── dataStore.js             # File-based data operations
│   │   │
│   │   ├── utils/                       # Helper functions
│   │   │   ├── jwt.js                   # JWT utilities
│   │   │   ├── password.js              # Password hashing
│   │   │   └── response.js              # Response formatters
│   │   │
│   │   └── data/                        # JSON data storage
│   │       ├── users.json               # User accounts
│   │       ├── barbers.json             # Barber profiles
│   │       └── appointments.json        # Appointment records
│   │
│   ├── tests/                           # Test suites
│   │   ├── auth.test.js                 # Authentication tests
│   │   ├── barber.test.js               # Barber endpoint tests
│   │   └── appointment.test.js          # Appointment tests
│   │
│   ├── package.json                     # Dependencies & scripts
│   ├── Dockerfile                       # Docker configuration
│   ├── docker-compose.yml               # Docker Compose setup
│   ├── .env.example                     # Environment template
│   └── README.md                        # Backend documentation
│
├── render.yaml                          # Render Blueprint (CI/CD config)
├── DEPLOYMENT.md                        # Complete deployment guide
├── .gitignore                           # Git ignore rules
└── README.md                            # This file
```

---

## 🚀 Getting Started

### Prerequisites

Before running the application, ensure you have:

- **Node.js** (v16 or higher) - [Download](https://nodejs.org/)
- **npm** (comes with Node.js)
- **Git** - [Download](https://git-scm.com/)
- **Docker** (optional, for containerized deployment) - [Download](https://docker.com/)

### Installation & Local Development

#### 1. Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/BarberBook-Project.git
cd BarberBook-Project
```

#### 2. Backend Setup

```bash
# Navigate to backend directory
cd BarberBook-Backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Edit .env and add your JWT secret
nano .env  # or use any text editor
```

**`.env` configuration:**

```env
PORT=5001
NODE_ENV=development
JWT_SECRET=your_super_secret_jwt_key_change_this
JWT_EXPIRE=7d
FRONTEND_URL=http://localhost:8000
```

#### 3. Start Backend Server

```bash
# Development mode (auto-reload on changes)
npm run dev

# Production mode
npm start
```

Backend will run on: **http://localhost:5001**

#### 4. Frontend Setup

Open a **new terminal window**:

```bash
# Navigate to frontend directory
cd BarberBook

# Serve with any static file server
# Option 1: Python
python3 -m http.server 8000

# Option 2: Node.js http-server
npx http-server -p 8000

# Option 3: VS Code Live Server extension
# Right-click index.html → Open with Live Server
```

Frontend will run on: **http://localhost:8000**

#### 5. Access the Application

Open your browser and visit:

- **Frontend:** http://localhost:8000
- **Backend API:** http://localhost:5001/api
- **Health Check:** http://localhost:5001/health

### Demo Accounts

Use these pre-configured accounts for testing:

**Customer Account:**

- Email: `demo@customer.com`
- Password: `password`

**Barber Accounts:**

- Email: `john@barberbook.com` / Password: `password`
- Email: `mike@barberbook.com` / Password: `password`
- Email: `carlos@barberbook.com` / Password: `password`

---

## 🌐 Deployment

### Render Blueprint Deployment (Recommended - CI/CD Enabled)

Deploy both frontend and backend with **automatic CI/CD** using Render Blueprint.

#### Quick Start - Automatic Deployment

1. **Push to GitHub**

   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Deploy with Blueprint**

   - Go to [Render Dashboard](https://dashboard.render.com/)
   - Click **"New +" → "Blueprint"**
   - Connect your GitHub repository
   - Render automatically detects `render.yaml`
   - Click **"Apply"** to deploy both services

3. **Services Created**

   - ✅ **Backend API** - Node.js web service
   - ✅ **Frontend** - Static site
   - ✅ **Auto-deploy** - Enabled on git push

4. **Your URLs**
   - **Backend:** `https://barberbook-backend.onrender.com`
   - **Frontend:** `https://barberbook-frontend.onrender.com`

#### Automatic CI/CD Features

Once deployed, every `git push` to `main` will:

- 🔄 Automatically rebuild and deploy both services
- ✅ Run health checks
- 📧 Send deployment notifications
- ⏪ Rollback on failure

#### Configuration Files

- **`render.yaml`** - Infrastructure as code for both services
- **`BarberBook/config.js`** - Auto-detects environment (local/production)
- **`.env`** - Environment variables (backend)

**📚 Complete Guide:** See [`DEPLOYMENT.md`](DEPLOYMENT.md) for detailed instructions

### Docker Deployment (Alternative)

Deploy backend using Docker for better consistency and isolation:

**Deployment Options:**

1. **Render with Docker** - Automatic CI/CD using your Dockerfile
2. **Local Docker** - Test and run containers locally
3. **Any Docker Platform** - Deploy to AWS, Azure, GCP, etc.

**Key Features:**

- ✅ Consistent environment across all platforms
- ✅ Isolated dependencies and runtime
- ✅ Production-optimized Alpine Linux image (~150MB)
- ✅ Built-in health checks
- ✅ Automatic CI/CD with Render Blueprint

**Quick Deploy with Docker:**

```bash
cd BarberBook-Backend

# Build image
docker build -t barberbook-backend .

# Run container
docker run -d -p 5000:10000 \
  -e NODE_ENV=production \
  -e PORT=10000 \
  -e JWT_SECRET="your_secret" \
  -e JWT_EXPIRES_IN=7d \
  --name barberbook-backend \
  barberbook-backend

# Test health
curl http://localhost:5000/health
```

**🐳 Complete Docker Guide:** See [`DOCKER-DEPLOYMENT.md`](DOCKER-DEPLOYMENT.md)

**Note:** The `render.yaml` is already configured for Docker deployment!

---

## 📡 API Documentation

### Base URL

- **Local:** `http://localhost:5001/api`
- **Production:** `https://your-app.onrender.com/api`

### Authentication

All protected endpoints require a JWT token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

### Endpoints Overview

#### Authentication (`/api/auth`)

| Method | Endpoint    | Description       | Auth Required |
| ------ | ----------- | ----------------- | ------------- |
| POST   | `/register` | Register new user | No            |
| POST   | `/login`    | Login user        | No            |
| GET    | `/me`       | Get current user  | Yes           |

#### Barbers (`/api/barbers`)

| Method | Endpoint            | Description             | Auth Required |
| ------ | ------------------- | ----------------------- | ------------- |
| GET    | `/`                 | Get all barbers         | No            |
| GET    | `/:id`              | Get barber by ID        | No            |
| GET    | `/:id/availability` | Get barber availability | No            |

#### Appointments (`/api/appointments`)

| Method | Endpoint    | Description           | Auth Required  |
| ------ | ----------- | --------------------- | -------------- |
| POST   | `/`         | Create appointment    | Yes (Customer) |
| GET    | `/`         | Get user appointments | Yes            |
| GET    | `/calendar` | Get calendar view     | Yes (Barber)   |
| GET    | `/:id`      | Get appointment by ID | Yes            |
| PUT    | `/:id`      | Update appointment    | Yes            |
| DELETE | `/:id`      | Cancel appointment    | Yes (Customer) |

### Example Requests

**Register User:**

```bash
curl -X POST http://localhost:5001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "phone": "+1234567890"
  }'
```

**Create Appointment:**

```bash
curl -X POST http://localhost:5001/api/appointments \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "barberId": "1",
    "serviceId": "s1",
    "date": "2025-12-15",
    "time": "10:00",
    "duration": 30,
    "price": 25
  }'
```

**Complete API Documentation:** See [`BarberBook-Backend/README.md`](BarberBook-Backend/README.md)

---

## 🎓 Software Engineering Principles

This project demonstrates key software engineering concepts taught in the course:

### 1. **Software Architecture**

- **Layered Architecture:** Clear separation of concerns

  - Presentation Layer (Frontend HTML/CSS/JS)
  - Application Layer (Controllers)
  - Business Logic Layer (Services)
  - Data Access Layer (DataStore)

- **MVC Pattern:** Model-View-Controller structure
  - Models: Data schemas (users, barbers, appointments)
  - Views: Frontend HTML pages
  - Controllers: Request handlers

### 2. **RESTful API Design**

- Proper HTTP methods (GET, POST, PUT, DELETE)
- Resource-based URLs (`/api/barbers`, `/api/appointments`)
- Stateless communication
- Meaningful status codes (200, 201, 400, 401, 404, 500)
- JSON response format

### 3. **Authentication & Security**

- JWT (JSON Web Tokens) for stateless authentication
- Password hashing with bcrypt (salted hashing)
- Role-based access control (RBAC)
- Input validation using express-validator
- CORS protection
- Environment variable security

### 4. **Data Management**

- CRUD operations (Create, Read, Update, Delete)
- Data validation and sanitization
- Conflict detection (preventing double bookings)
- Data persistence using JSON files
- In-memory caching for performance

### 5. **Testing Strategy**

- Unit tests for individual functions
- Integration tests for API endpoints
- Test coverage reporting
- Automated testing with Jest
- Continuous testing during development

### 6. **Error Handling**

- Centralized error handling middleware
- Custom error classes
- Meaningful error messages
- Logging with Morgan
- Graceful degradation

### 7. **Code Quality**

- Modular code organization
- DRY (Don't Repeat Yourself) principle
- Single Responsibility Principle
- Meaningful variable and function names
- Comprehensive documentation
- Consistent code formatting

### 8. **Version Control**

- Git for source control
- Feature branches
- Meaningful commit messages
- Pull request workflow
- GitHub for collaboration

### 9. **DevOps & Deployment**

- Containerization with Docker
- Environment-based configuration
- CI/CD ready structure
- Cloud deployment (Render)
- Health checks and monitoring

### 10. **Documentation**

- Code comments
- API documentation
- README files
- Deployment guides
- User-facing documentation

---

## 🧪 Testing

### Running Tests

```bash
cd BarberBook-Backend

# Run all tests
npm test

# Run tests with coverage report
npm test -- --coverage

# Run tests in watch mode (development)
npm run test:watch
```

### Test Coverage

The test suite covers:

✅ **Authentication Tests** (`tests/auth.test.js`)

- User registration (success & validation)
- User login (success & failure)
- Token generation and verification
- Protected route access

✅ **Barber Tests** (`tests/barber.test.js`)

- List all barbers
- Get barber details
- Get barber availability
- Invalid barber ID handling

✅ **Appointment Tests** (`tests/appointment.test.js`)

- Create appointment (customer)
- Get appointments (customer & barber views)
- Update appointment status
- Delete/cancel appointment
- Double-booking prevention
- Calendar view (barber)
- Authorization checks

### Test Results Example

```
PASS  tests/auth.test.js
PASS  tests/barber.test.js
PASS  tests/appointment.test.js

Test Suites: 3 passed, 3 total
Tests:       24 passed, 24 total
Snapshots:   0 total
Time:        2.5s

Coverage:
  Statements   : 85%
  Branches     : 78%
  Functions    : 82%
  Lines        : 85%
```

---

## 🔧 Configuration

### Environment Variables

Create a `.env` file in `BarberBook-Backend/`:

```env
# Server Configuration
PORT=5001
NODE_ENV=development

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_minimum_32_characters
JWT_EXPIRE=7d

# CORS Configuration
FRONTEND_URL=http://localhost:8000
```

**Production (Render):**

- Set `NODE_ENV=production`
- Generate strong JWT_SECRET: `openssl rand -base64 32`
- Set `FRONTEND_URL` to your deployed URL (or leave empty for same-origin)

### Database Migration (Future Enhancement)

Currently using JSON files for simplicity. To migrate to a database:

1. **MongoDB:**

   - Install `mongoose`
   - Create schema models
   - Replace `dataStore.js` with MongoDB operations
   - Connect to MongoDB Atlas (free tier)

2. **PostgreSQL:**
   - Install `pg` or use an ORM like Sequelize
   - Define table schemas
   - Update data access layer
   - Deploy with Render PostgreSQL

---

## 📊 Project Statistics

- **Lines of Code:** ~5,000+ (backend + frontend)
- **API Endpoints:** 12
- **Test Cases:** 24+
- **Dependencies:** 12 (backend)
- **Development Time:** 4-6 weeks
- **Team Size:** 1-3 developers

---

## 🤝 Contributing

This is an academic project, but contributions are welcome for learning purposes:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Coding Standards

- Follow existing code style
- Write meaningful commit messages
- Add tests for new features
- Update documentation
- Comment complex logic

---

## 🐛 Known Limitations & Future Enhancements

### Current Limitations

- **Data Persistence:** JSON files reset on Render free tier restart
- **File Storage:** No image upload for barber profiles
- **Payment:** No integrated payment system
- **Notifications:** No email/SMS reminders
- **Search:** Limited search and filtering options

### Planned Enhancements

- [ ] Migrate to MongoDB/PostgreSQL for production
- [ ] Add email notifications (nodemailer)
- [ ] Implement SMS reminders (Twilio)
- [ ] Payment integration (Stripe)
- [ ] Image upload for barber profiles
- [ ] Advanced search and filtering
- [ ] Customer reviews and ratings
- [ ] Calendar integration (Google Calendar)
- [ ] Mobile app (React Native)
- [ ] Real-time updates (Socket.io)
- [ ] Admin dashboard
- [ ] Analytics and reporting

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Authors & Acknowledgments

**Developer(s):**

- Your Name - _Full Stack Development_ - [GitHub](https://github.com/YOUR_USERNAME)

**Course:**

- Software Engineering Final Project
- [University Name]
- Instructor: [Instructor Name]
- Semester: Fall 2025

**Acknowledgments:**

- Express.js documentation and community
- Node.js best practices
- MDN Web Docs for frontend reference
- Stack Overflow community
- Course teaching assistants and peers

---

## 📞 Support & Contact

For questions, issues, or feedback:

- **GitHub Issues:** [Create an issue](https://github.com/YOUR_USERNAME/BarberBook-Project/issues)
- **Email:** your.email@example.com
- **Documentation:** See individual README files in subdirectories

---

## 🎯 Learning Outcomes

By completing this project, the following skills were demonstrated:

### Technical Skills

✅ Full-stack web development  
✅ RESTful API design and implementation  
✅ Database design and management  
✅ Authentication and authorization  
✅ Frontend-backend integration  
✅ Testing and quality assurance  
✅ Version control with Git  
✅ Cloud deployment and DevOps  
✅ Docker containerization

### Software Engineering Practices

✅ Requirements analysis  
✅ System design and architecture  
✅ Agile development methodology  
✅ Code documentation  
✅ Error handling and debugging  
✅ Security best practices  
✅ Performance optimization  
✅ Code review and collaboration

---

## 📚 References & Resources

- [Express.js Documentation](https://expressjs.com/)
- [Node.js Best Practices](https://github.com/goldbergyoni/nodebestpractices)
- [JWT.io](https://jwt.io/)
- [REST API Design](https://restfulapi.net/)
- [Docker Documentation](https://docs.docker.com/)
- [Render Documentation](https://render.com/docs)
- [MDN Web Docs](https://developer.mozilla.org/)

---

**⭐ If you found this project helpful for your learning, please give it a star!**

---

_Last Updated: December 2025_
