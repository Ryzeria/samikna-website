# SAMIKNA — Sistem Aplikasi Monitoring Kesehatan Tanaman

Platform monitoring pertanian berbasis teknologi **remote sensing** dan **data satelit** untuk kabupaten di Jawa Timur.

## Tech Stack

- **Framework:** Next.js 15.5 (Pages Router)
- **UI:** React 18 + Tailwind CSS 3 + Framer Motion
- **Auth:** JWT (httpOnly cookie) + bcryptjs
- **Database:** MySQL/MariaDB via mysql2
- **Maps:** Google Earth Engine (iframe embed)

## Struktur Proyek

```
src/
├── pages/
│   ├── index.jsx              # Landing page
│   ├── login.jsx              # Halaman login
│   ├── dashboard/             # Halaman dashboard (protected)
│   │   ├── index.jsx          # Overview & analytics
│   │   ├── maps.jsx           # Peta satelit GEE
│   │   ├── crop-management.jsx
│   │   ├── supply-chain.jsx
│   │   ├── chatbot.jsx
│   │   ├── reports.jsx
│   │   └── profile.jsx
│   └── api/                   # API routes (server-side)
│       ├── auth/              # login, logout, me, csrf-token
│       ├── dashboard/
│       ├── crop-management/
│       ├── supply-chain/
│       ├── reports/
│       └── profile/
├── components/
│   ├── layout/                # Navbar, Footer
│   ├── dashboard/             # DashboardLayout + sub-komponen
│   └── sections/              # Landing page sections
├── contexts/
│   └── AuthContext.jsx        # Auth state + useAuth + withAuth
├── lib/
│   ├── apiClient.js           # Centralized fetch + CSRF otomatis
│   ├── apiResponse.js         # Standard API response helper
│   ├── authMiddleware.js      # Server-side JWT middleware
│   ├── csrf.js                # CSRF token utilities
│   ├── rateLimiter.js         # In-memory rate limiter
│   ├── validators.js          # Server-side input validation
│   └── database.js            # MySQL connection & queries
└── constants/
    └── index.js               # Konstanta aplikasi terpusat
```

## Setup Development

### 1. Clone & install

```bash
git clone <repo-url>
cd samikna-website
npm install
```

### 2. Environment variables

Buat file `.env.local` di root project:

```env
# Database
DB_HOST=your-db-host
DB_PORT=3306
DB_NAME=your-db-name
DB_USER=your-db-user
DB_PASS=your-db-password

# Auth
JWT_SECRET=your-very-long-random-secret-min-32-chars

# App URLs (opsional)
NEXT_PUBLIC_API_URL=http://localhost:3000
NEXT_PUBLIC_SITE_URL=https://samikna.id
```

### 3. Inisialisasi database

```bash
npm run db:init    # Buat tabel-tabel
npm run db:seed    # Isi data awal
npm run db:test    # Test koneksi
```

### 4. Jalankan development server

```bash
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000).

## Deployment

### Vercel (rekomendasi)

```bash
npm run deploy:vercel
```

Pastikan semua environment variables sudah diset di dashboard Vercel.

### Hostinger (static export)

```bash
npm run build:static
```

Upload isi folder `/out` ke `public_html` di Hostinger.
Catatan: static mode tidak mendukung API routes — diperlukan server Node.js terpisah.

## Autentikasi

- Token JWT disimpan sebagai **httpOnly cookie** (`samikna_token`) — tidak bisa diakses JavaScript
- CSRF protection menggunakan **Double Submit Cookie pattern**
- Rate limiting: 5 gagal / 15 menit → block 30 menit
- Session: 8 jam (atau sampai browser ditutup jika "Remember Me" tidak dicentang)
