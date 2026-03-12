# Threadz - Complete T-shirt Design and E-commerce Platform

Threadz is a full-stack web application for designing, customizing, and selling t-shirts online. Built with modern technologies including FastAPI, Next.js, React, and PostgreSQL.

## 🚀 Features

### Core Features
- **T-shirt Designer**: Interactive 3D design tool with real-time preview
- **E-commerce**: Complete shopping cart, checkout, and payment integration
- **User Management**: Authentication, profiles, and order tracking
- **AI-Powered Design**: AI-assisted design suggestions and generation
- **Admin Dashboard**: Comprehensive admin panel for order and product management
- **Analytics**: Detailed analytics and reporting system
- **Email Notifications**: Automated email system for orders and updates
- **Search & Filtering**: Advanced product search with filters
- **Rate Limiting**: Built-in rate limiting and security features

### Technical Features
- **Microservices Architecture**: Scalable backend with Celery for background tasks
- **Database Migrations**: Alembic for database version control
- **Caching**: Redis for performance optimization
- **File Storage**: Configurable local or cloud storage
- **API Documentation**: Auto-generated OpenAPI/Swagger docs
- **Testing**: Comprehensive test suite for both frontend and backend
- **Docker Support**: Complete containerization with Docker Compose
- **Conda Environment**: Managed Python environment with conda
- **CI/CD Ready**: GitHub Actions workflow configuration

## 🏗️ Architecture

```
Threadz/
├── Threadz-V1/
│   ├── backend/                 # FastAPI backend application
│   │   ├── app/                # Main application code
│   │   ├── alembic/            # Database migrations
│   │   ├── tests/              # Backend tests
│   │   └── requirements.txt    # Python dependencies
│   └── frontend/               # Next.js frontend application
│       ├── src/                # React components and pages
│       ├── public/             # Static assets
│       └── package.json        # Node.js dependencies
├── docker-compose.yml          # Development Docker setup
├── environment.yml             # Conda environment configuration
├── Makefile                    # Development commands
├── setup.sh                    # Automated setup script
└── README.md                   # This file
```

## 🛠️ Tech Stack

### Backend
- **Framework**: FastAPI
- **Database**: PostgreSQL with SQLAlchemy ORM
- **Cache**: Redis
- **Task Queue**: Celery
- **Authentication**: JWT with passlib
- **File Processing**: Pillow
- **Email**: FastAPI Mail
- **API Documentation**: OpenAPI/Swagger
- **Testing**: Pytest

### Frontend
- **Framework**: Next.js 16
- **UI Library**: React 19
- **Styling**: Tailwind CSS
- **Components**: Radix UI + Shadcn
- **State Management**: Redux Toolkit
- **3D Graphics**: Three.js + React Three Fiber
- **Canvas**: Fabric.js
- **Icons**: Lucide React
- **TypeScript**: Full TypeScript support

### DevOps & Infrastructure
- **Containerization**: Docker & Docker Compose
- **Environment Management**: Conda
- **Reverse Proxy**: Nginx
- **Database Migrations**: Alembic
- **Code Quality**: ESLint, Black, Pytest
- **Version Control**: Git

## 🚀 Quick Start

### Prerequisites
- **Conda/Miniconda**: [Install Conda](https://docs.conda.io/en/latest/miniconda.html)
- **Node.js 18+**: Included in conda environment
- **Python 3.11+**: Included in conda environment
- **Git**: For version control

### Automated Setup (Recommended)

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd Threadz
   ```

2. **Run the setup script**
   ```bash
   ./setup.sh
   ```

3. **Activate the conda environment**
   ```bash
   conda activate threadz-env
   ```

4. **Start the development servers**
   ```bash
   npm run dev
   ```

### Manual Setup

1. **Create conda environment**
   ```bash
   conda env create -f environment.yml
   conda activate threadz-env
   ```

2. **Install frontend dependencies**
   ```bash
   cd Threadz-V1/frontend
   npm install
   cd ../..
   ```

3. **Setup environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Run database migrations**
   ```bash
   cd Threadz-V1/backend
   alembic upgrade head
   cd ../..
   ```

5. **Start development servers**
   ```bash
   npm run dev
   ```

## 🌐 Access Points

After starting the development servers:

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **API Documentation**: http://localhost:8000/docs
- **Alternative API Docs**: http://localhost:8000/redoc

## 🐳 Docker Development

### Using Docker Compose

1. **Start all services**
   ```bash
   npm run docker:dev
   # or
   make docker-up
   ```

2. **Stop all services**
   ```bash
   npm run docker:down
   # or
   make docker-down
   ```

### Services Included
- **PostgreSQL**: Database server
- **Redis**: Cache and message broker
- **Backend**: FastAPI application
- **Frontend**: Next.js application
- **Celery Worker**: Background task processor
- **Celery Beat**: Task scheduler
- **Nginx**: Reverse proxy

## 📝 Available Commands

### Development Commands
```bash
# Start both frontend and backend
npm run dev
make dev

# Start individual services
npm run dev:backend
npm run dev:frontend
make dev-backend
make dev-frontend
```

### Testing Commands
```bash
# Run all tests
npm run test
make test

# Run specific tests
npm run test:backend
npm run test:frontend
make test-backend
make test-frontend
```

### Database Commands
```bash
# Run migrations
npm run migrate
make migrate

# Generate new migration
npm run migrate:generate
make migrate-gen MSG="your migration message"

# Seed database
npm run seed
make seed
```

### Code Quality Commands
```bash
# Run linting
npm run lint
make lint

# Format code
make format
```

### Docker Commands
```bash
# Development with Docker
npm run docker:dev
make docker-up

# Production with Docker
npm run docker:prod
```

## ⚙️ Configuration

### Environment Variables

Key environment variables (see `.env.example`):

```bash
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/threadz

# Redis
REDIS_URL=redis://localhost:6379

# JWT Secret
SECRET_KEY=your-super-secret-key

# Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password

# Payment (Razorpay)
RAZORPAY_KEY_ID=your-key-id
RAZORPAY_KEY_SECRET=your-key-secret

# AI Services
OPENAI_API_KEY=your-openai-key
STABILITY_API_KEY=your-stability-key
```

### Database Setup

1. **PostgreSQL**: The setup script creates a PostgreSQL container
2. **Migrations**: Alembic handles database schema changes
3. **Seeding**: Optional seed data for development

## 🧪 Testing

### Backend Tests
```bash
cd Threadz-V1/backend
python -m pytest -v --cov=app
```

### Frontend Tests
```bash
cd Threadz-V1/frontend
npm test
```

### Test Coverage
- Backend: Unit tests for API endpoints, services, and utilities
- Frontend: Component tests and integration tests
- E2E: End-to-end tests (planned)

## 📚 API Documentation

The backend provides automatic API documentation:

- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc
- **OpenAPI JSON**: http://localhost:8000/openapi.json

## 🚀 Deployment

### Production Deployment

1. **Environment Setup**
   ```bash
   cp .env.example .env.production
   # Configure production values
   ```

2. **Build and Deploy**
   ```bash
   npm run docker:prod
   ```

3. **SSL Configuration**
   ```bash
   # Generate SSL certificates
   ./generate_ssl_cert.sh
   ```

### Deployment Options
- **Docker**: Recommended for production
- **Cloud**: AWS, Google Cloud, Azure
- **VPS**: DigitalOcean, Linode, Vultr

## 🔒 Security Features

- **Rate Limiting**: Built-in rate limiting for API endpoints
- **CORS**: Configurable CORS policies
- **Authentication**: JWT-based authentication
- **Input Validation**: Pydantic models for request validation
- **SQL Injection Protection**: SQLAlchemy ORM
- **XSS Protection**: Security headers and input sanitization
- **HTTPS**: SSL/TLS support

## 📈 Monitoring & Analytics

- **Sentry Integration**: Error tracking and performance monitoring
- **Application Analytics**: Custom analytics dashboard
- **Performance Monitoring**: Request timing and database query monitoring
- **Logging**: Structured logging with different levels

## 🤝 Contributing

1. **Fork** the repository
2. **Create** a feature branch: `git checkout -b feature/amazing-feature`
3. **Commit** your changes: `git commit -m 'Add amazing feature'`
4. **Push** to the branch: `git push origin feature/amazing-feature`
5. **Open** a Pull Request

### Development Guidelines
- Follow PEP 8 for Python code
- Use TypeScript for frontend development
- Write tests for new features
- Update documentation
- Use meaningful commit messages

## � License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:

- **Documentation**: Check this README and inline code comments
- **Issues**: [GitHub Issues](https://github.com/your-username/threadz/issues)
- **Discussions**: [GitHub Discussions](https://github.com/your-username/threadz/discussions)

## 🗺️ Roadmap

### Upcoming Features
- [ ] Mobile app (React Native)
- [ ] Advanced AI design tools
- [ ] Multi-vendor marketplace
- [ ] Social features and sharing
- [ ] Advanced analytics dashboard
- [ ] Subscription models
- [ ] International shipping integration

### Technical Improvements
- [ ] GraphQL API
- [ ] Microservices architecture
- [ ] Kubernetes deployment
- [ ] Advanced caching strategies
- [ ] Real-time features with WebSockets

---

**Built with ❤️ by the Threadz Team**
