# 🛒 Ecommerce ReactJS - Fullstack E-commerce Platform

[![Node.js](https://img.shields.io/badge/Node.js-v20-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-19-blue.svg)](https://reactjs.org/)
[![NestJS](https://img.shields.io/badge/NestJS-11-red.svg)](https://nestjs.com/)
[![Docker](https://img.shields.io/badge/Docker-Compose-blue.svg)](https://docker.com/)
[![MySQL](https://img.shields.io/badge/MySQL-8.0-orange.svg)](https://mysql.com/)
[![License](https://img.shields.io/badge/License-UNLICENSED-gray.svg)](LICENSE)
[![Status](https://img.shields.io/badge/Status-Production%20Ready-brightgreen.svg)](https://github.com/)

## 📋 Mô tả dự án
Ecommerce-ReactJS-main là ứng dụng **e-commerce fullstack** hiện đại được xây dựng với:
- **Frontend**: ReactJS 19 + Vite + TailwindCSS + React Router + Zustand (state management) + Framer Motion (animations).
- **Backend**: NestJS 11 (TypeScript) + TypeORM + MySQL + JWT Authentication + Swagger API docs.
- **Database**: MySQL 8.0 với seed data cho products (furniture), admin users.
- **Deployment**: Docker & Docker Compose cho easy setup (multi-container: api, frontend, db).
- **Tính năng chính**:
  - Quản lý sản phẩm (CRUD).
  - Authentication & Authorization (JWT).
  - Giỏ hàng, Orders.
  - Chatbot integration (AI-powered).
  - Responsive UI, modern design.

Dự án hỗ trợ chạy development local hoặc production via Docker.

## 📋 Yêu cầu hệ thống
- Node.js >= 20
- Docker & Docker Compose
- Git
- Editor: VSCode (recommended)
- MySQL client (optional, e.g., phpMyAdmin, TablePlus)

## 🚀 Hướng dẫn cài đặt và chạy

### 1. Clone/Unzip dự án
```
unzip Ecommerce-ReactJS-main.zip
cd Ecommerce-ReactJS-main
```

### 2. Cấu hình Environment Variables
Tạo file `backend/.env` từ mẫu (nếu có `.env.example`, copy nó):
```bash
cp backend/.env.example backend/.env  # Nếu tồn tại
```
**Các biến môi trường cần thiết** (sử dụng defaults nếu không set):

| Variable          | Mô tả                          | Default/Example             |
|-------------------|--------------------------------|-----------------------------|
| `DB_HOST`         | Database host                 | `db` (Docker) / `localhost` |
| `DB_PORT`         | Database port                 | `3306`                      |
| `DB_USERNAME`     | DB user                       | `rose`                      |
| `DB_PASSWORD`     | DB password                   | `33213456`                  |
| `DB_DATABASE`     | Database name                 | `ecom_DB`                   |
| `DB_ROOT_PASSWORD`| MySQL root password           | `root_password`             |
| `JWT_SECRET`      | JWT signing secret            | `your-super-secret-key`     |
| `PORT`            | Backend port                  | `3000`                      |

**Ví dụ backend/.env**:
```
DB_HOST=db
DB_PORT=3306
DB_USERNAME=rose
DB_PASSWORD=33213456
DB_DATABASE=ecom_DB
JWT_SECRET=your-super-secret-jwt-key-here
```

### 3. Chạy với Docker (Khuyến nghị - Production/Dev)
```bash
# Build và chạy all services
docker compose up -d --build

# Logs
docker compose logs -f

# Stop
docker compose down
```
- **Frontend**: http://localhost (port 80)
- **Backend API**: http://localhost:3000 (Swagger docs: http://localhost:3000/api)
- **Database**: localhost:3306 (user: root / root_password)

### 4. Chạy Development Mode (Separate - No Docker)
#### Database (MySQL)
Chạy MySQL local với config từ .env.

#### Backend
```bash
cd backend
npm install
npm run start:dev  # http://localhost:3000
```

#### Frontend
```bash
cd frontend
npm install
npm run dev  # http://localhost:5173 (Vite default)
```
**Lưu ý**: Update frontend proxy/VITE_API_URL to `http://localhost:3000` if needed (check vite.config.js).

#### Seed Data
```bash
cd backend
npm run build  # If needed
node seed-admin.js     # Create admin
node seed-furniture.js # Add products
```

### 5. Build Production
```bash
# Backend
cd backend && npm run build && npm run start:prod

# Frontend
cd frontend && npm run build  # Output to dist/
```

## 🛠️ Cấu trúc thư mục
```
Ecommerce-ReactJS-main/
├── backend/          # NestJS API
│   ├── src/          # Controllers, Entities, Services
│   ├── seed-*.js     # Data seeding
│   ├── Dockerfile
│   └── package.json
├── frontend/         # React App
│   ├── src/          # Components (Chatbot.jsx etc.)
│   ├── Dockerfile
│   └── package.json
├── docker-compose.yml # Orchestration
└── README.md         # This file!
```

## 🔌 API Endpoints (Swagger)
- Access: http://localhost:3000/api
- Auth: POST /auth/login/register
- Products: GET/POST /products

## 🔧 Troubleshooting
- **DB Connection failed**: Check .env vars, `docker compose logs db`.
- **Port conflict**: Change ports in docker-compose.yml.
- **Node modules**: Delete `node_modules` + `npm install`.
- **Frontend not proxying API**: Check nginx.conf or vite proxy.
- **Seeds not running**: Ensure DB exists, run manually.

## 🤝 Contributing
1. Fork repo.
2. Create feature branch.
3. Commit changes.
4. Test with Docker.
5. PR to main.

## 📄 License
UNLICENSED - For personal/educational use.

## 👨‍💻 Authors
- Developed with ❤️ using ReactJS + NestJS stack.

**Happy Shopping! 🛍️**

