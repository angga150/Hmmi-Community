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

### rencana struktur folder backend, yang belum ada tandanya belum dibikin

```
backend/
├── api/                           # Semua endpoint API
│   ├── admin/                     # Endpoint khusus admin
│   │   ├── users.php              # GET: List semua users (admin only)
│   │   └── dashboard.php          # GET: Dashboard stats (admin only)
│   │
│   ├── auth/                      # Endpoint authentication
│   │   ├── login.php              # POST: Login user, generate token
│   │   ├── logout.php             # POST: Logout, invalidate token
│   │   ├── me.php                 # GET: Get current user info (protected)
│   │   └── register.php           # POST: Register user baru
│   │
│   ├── events/                    # CRUD Events Management
│   │   ├── index.php              # GET/POST: List/Create events
│   │   ├── [id].php               # GET/PUT/DELETE: Single event
│   │   ├── attendance.php         # GET: Event attendance records
│   │   └── upcoming.php           # GET: Upcoming events
│   │
│   ├── meetings/                  # CRUD Meetings Management
│   │   ├── index.php              # GET/POST: List/Create meetings
│   │   ├── [id].php               # GET/PUT/DELETE: Single meeting
│   │   ├── attendance.php         # GET: Meeting attendance records
│   │   └── schedule.php           # GET: Today's meetings
│   │
│   ├── attendance/                # Attendance System
│   │   ├── sessions/              # Attendance Sessions Management
│   │   │   ├── index.php          # GET/POST: List/Create sessions
│   │   │   ├── [id].php           # GET/PUT/DELETE: Single session
│   │   │   ├── generate.php       # POST: Generate QR code for session
│   │   │   ├── validate.php       # POST: Validate session code
│   │   │   └── close.php          # POST: Close/end session
│   │   │
│   │   ├── checkin/               # Check-in Endpoints
│   │   │   ├── scan.php           # POST: QR code check-in
│   │   │   ├── manual.php         # POST: Manual code check-in
│   │   │   ├── verify.php         # GET: Verify check-in status
│   │   │   └── history.php        # GET: User check-in history
│   │   │
│   │   └── reports/               # Reports & Analytics
│   │       ├── export.php         # GET: Export PDF/Excel
│   │       ├── stats.php          # GET: Statistics dashboard
│   │       ├── summary.php        # GET: Summary report
│   │       ├── user.php           # GET: User attendance report
│   │       └── session.php        # GET: Session attendance report
│   │
│   ├── user/                      # User Management
│   │   ├── profile.php            # GET/PUT: Get/update user profile
│   │   ├── attendance.php         # GET: User attendance history
│   │   └── events.php             # GET: User's registered events
│   │
│   ├── dashboard/                 # Dashboard Endpoints
│   │   ├── overview.php           # GET: Dashboard overview data
│   │   ├── calendar.php           # GET: Calendar events data
│   │   └── notifications.php      # GET: User notifications
│   │
│   └── health.php                 # GET: Health check API (public)
│
├── config/                        # Konfigurasi aplikasi
│   ├── cors.php                   # CORS headers & preflight handling
│   └── database.php               # Koneksi PDO ke MySQL
│
├── middleware/                    # Middleware untuk request processing
│   ├── auth.php                   # Validasi token & role-based access
│   ├── admin.php                  # Middleware untuk admin only
│   └── validation.php             # Input validation middleware
│
├── utils/                         # Utility Functions
│   ├── generators/                # Code & Data Generators
│   │   ├── qr_generator.php       # Generate QR code images
│   │   ├── code_generator.php     # Generate unique codes
│   │   └── token_generator.php    # Generate secure tokens
│   │
│   ├── exporters/                 # Export Utilities
│   │   ├── excel_exporter.php     # Export to Excel
│   │   ├── pdf_exporter.php       # Export to PDF
│   │   └── csv_exporter.php       # Export to CSV
│   │
│   ├── validators/                # Validation Utilities
│   │   ├── input_validator.php    # Validate user input
│   │   ├── date_validator.php     # Validate dates
│   │   └── file_validator.php     # Validate file uploads
│   │
│   ├── helpers/                   # Helper Functions
│   │   ├── response_helper.php    # Standardized API responses
│   │   ├── date_helper.php        # Date formatting helpers
│   │   └── sanitizer.php          # Data sanitization
│   │
│   └── notifications/             # Notification System
│       ├── email_notifier.php     # Email notifications
│       └── push_notifier.php      # Push notifications
│
├── models/                        # Data Models (optional - jika mau OOP)
│   ├── User.php                   # User model
│   ├── Event.php                  # Event model
│   ├── Meeting.php                # Meeting model
│   ├── AttendanceSession.php      # Attendance session model
│   └── AttendanceRecord.php       # Attendance record model
│
├── public/                        # Entry point aplikasi (document root)
│   ├── .htaccess                  # URL rewriting (Apache)
│   ├── index.php                  # Router utama (single entry point)
│   └── assets/                    # Static assets (jika ada)
│       ├── qr_codes/              # Generated QR codes storage
│       └── exports/               # Generated export files
│
├── logs/                          # Application logs
│   ├── access.log                 # API access logs
│   ├── error.log                  # Error logs
│   └── attendance.log             # Attendance activity logs
│
├── temp/                          # Temporary files
│   ├── cache/                     # Cache files
│   └── uploads/                   # Temporary uploads
│
├── .env                           # Environment variables
├── .env.example                   # Environment template
├── .gitignore                     # Git ignore file
├── README.md                      # Project documentation
└── composer.json                  # PHP dependencies (jika pakai Composer)
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

---

> untuk username user nya itu rencananya sih dibikin unique trus nanti di tambah name sebagai nama lengkap, tapi untuk sekarang gitu aja lah wkwk

> untuk pertanyaan halaman admin saya user dipisah gak? mungkin gak usah di pisah tapi untuk access nya yang di cek. contoh di sidebar -> tombol anggota tuh  kan hanya bisa di lihat oleh admin kalau bukan admin maka tombol nya tidak ada gitu 

> untuk sistem checkin nya belum aku testing