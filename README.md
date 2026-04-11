# Ecommerce-ReactJS

Hướng dẫn chạy project (frontend + backend + database) và cách **export/import dữ liệu** để chuyển sang máy khác.

---

## 1) Yêu cầu môi trường

- Node.js 20+
- npm 10+
- Docker Desktop

---

## 2) Cấu trúc project

- `frontend/` — React + Vite
- `backend/` — NestJS + TypeORM + MySQL
- `docker-compose.yml` — chạy API + DB bằng Docker

---

## 3) Cách chạy

#### Backend
```bash
cd backend
npm install
npm run start:dev
```
Mặc định API: `http://localhost:3000/api`

#### Frontend
Mở terminal mới:
```bash
cd frontend
npm install
npm run dev -- --host 0.0.0.0 --port 5173
```
Mặc định web: `http://localhost:5173`

---

Ở thư mục gốc project:
```bash
docker compose up -d --build
```

- API: `http://localhost:3000/api`
- DB: `localhost:3306`

> Nếu muốn chỉ build/restart API:
```bash
docker compose up -d --build api
```

---

## 4) Biến môi trường

### Backend (`backend/.env`)
Các biến quan trọng:

```env
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=rose
DB_PASSWORD=your_db_password
DB_DATABASE=ecom_DB

PORT=3000
FRONTEND_URL=http://localhost:5173
BACKEND_PUBLIC_URL=http://localhost:3000

JWT_SECRET=your_secret
JWT_EXPIRES_IN=1d

# Contact SMTP
CONTACT_RECEIVER_EMAIL=your_email@gmail.com
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
```

### Frontend (`frontend/.env.development`)
```env
VITE_API_BASE_URL=http://localhost:3000/api
```

---

## 5) Chạy build production

### Backend
```bash
cd backend
npm run build
```

### Frontend
```bash
cd frontend
npm run build
```

---

## 6) Tài khoản admin

Đăng nhập bằng tài khoản admin đã seed/sẵn trong DB của bạn.

Nếu cần reset/seed admin, dùng các script trong `backend/` như:
- `seed-admin.js`
- `reset-admin.js`

---

## 7) Export / Import dữ liệu (chuyển máy)

Tính năng này đã có trong **Admin > Analytics**:

- **Export Full Data**: tải file JSON toàn bộ dữ liệu
- **Import Data**: chọn file JSON để nhập vào máy mới

Khi import có 2 chế độ:
- **Replace existing = true**: thay toàn bộ dữ liệu cũ
- **Replace existing = false**: merge/upsert

### API tương ứng (Admin only)
- `GET /api/data-transfer/export`
- `POST /api/data-transfer/import`

Payload import:
```json
{
  "data": { ...exportedData },
  "replaceExisting": false
}
```

---

## 8) Healthcheck

- `GET /api/health`
- `GET /api/ready`
- `GET /api/version`

---

## 9) Tính năng nổi bật đã có

- Auth + Role admin/user
- Sản phẩm, danh mục, giỏ hàng, đơn hàng
- Thanh toán MoMo
- Wishlist
- Coupon demo (`SAVE10`)
- Contact gửi mail SMTP
- Admin Analytics + CSV Export + Low stock alert
- Export/Import full data để migration giữa các máy

---

## 10) Lưu ý bảo mật

- Không commit file `.env` chứa secret lên GitHub.
- Dùng Gmail App Password cho SMTP (không dùng mật khẩu tài khoản chính).
- Đổi `JWT_SECRET` trước khi deploy public.
