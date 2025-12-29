### setup this repo

---

```bash
git clone https://github.com/angga150/Hmmi-Community.git
npm run setup
npm run dev
```

### localhost

---

`http://localhost:3000/` - Buat Jalankan Frontend.

`http://localhost:8000/api` - Buat Jalankan Backend.

## Route Pada React

---

- Panggil `localhost:3000/` untuk menjalankan.
- Link otomatis mengarahkan ke `localhost:3000/login` untuk melakukan login.
- Route yang masih tersedia `/login`, `/register`, `/dashboard` & `/logout`.

## Redesain Tampilan

---

- [Icon React Font Awesome](https://react-icons.github.io/react-icons/icons/fa/)
- Custom CSS.
- Membuat Tampilan Dashboard
- Responsive Dashboard

### struktur folder backend saat ini

```
backend/
├── api/                           # Semua endpoint API
│   ├── admin/                     # Endpoint khusus admin
│   │   └── users.php              # GET: List semua users (admin only)
│   ├── auth/                      # Endpoint authentication
│   │   ├── login.php              # POST: Login user, generate token
│   │   ├── logout.php             # POST: Logout, invalidate token
│   │   ├── me.php                 # GET: Get current user info (protected)
│   │   └── register.php           # POST: Register user baru
│   ├── user/                      # Endpoint user management
│   │   └── profile.php            # GET/PUT: Get/update user profile (protected)
│   └── health.php                 # GET: Health check API (public)
│
├── config/                        # Konfigurasi aplikasi
│   ├── cors.php                   # CORS headers & preflight handling
│   └── database.php               # Koneksi PDO ke MySQL
│
├── middleware/                    # Middleware untuk request processing
│   └── auth.php                   # Validasi token & role-based access
│
├── public/                        # Entry point aplikasi (document root)
│   ├── .htaccess                  # URL rewriting (Apache)
│   └── index.php                  # Router utama (single entry point)
│
├── .env                           # Environment variables (DB credentials)
└── .gitignore                     # File yang di-ignore oleh Git
```

### Middleware Flow:

- middleware/auth.php → Gatekeeper semua endpoint protected
- Cek token di header
- Validasi di database
- Cek expiry time
- Return user data jika valid
- Auto response 401 jika invalid

### Role-based Access:

- User: Bisa akses /api/user/profile.php
- Admin: Bisa akses semua, termasuk /api/admin/users.php

> ini kenapa lama kali masuk dashboard nya padahal masuk nya dari login

> Itu karena perubahan endpoint yang awalnya `user` menjadi `username` di `me.php`

### Saran

---

username gak perlu UNIQ sih, boleh sama, yang harus beda itu Email, karena kan Login nya pakai E-Mail, jadi username bisa buat identitas nama lengkap anggota, misal `Ihsan Baihaqi`, kecuali loginnya gak pakai E-Mail jadi username nya `ihsan123`.
