### setup this repo

---

```bash
git clone https://github.com/angga150/Hmmi-Community.git
npm run setup
npm run dev
```

## Route Pada React

---

- Panggil `localhost:3000/` untuk menjalankan.
- Link otomatis mengarahkan ke `localhost:3000/login` untuk melakukan login.
- Route yang sudah tersedia saat ini :
  - `/login`
  - `/register`
  - `/dashboard`
  - `/logout`

### struktur folder backend, yang belum ada tandanya belum di bikin masih plan

---

```
backend/
├── api/                          # API Endpoints (RESTful)
│   ├── admin/                    # Admin-only endpoints
│   │   ├── users.php            # User management (CRUD users)
│   │   ├── dashboard.php        # Admin dashboard statistics
│   │   └── system.php           # System settings & maintenance
│   │
│   ├── attendance/               # Attendance system endpoints
│   │   ├── checkin/             # Check-in methods
│   │   │   ├── manual.php       # Manual code check-in (POST)
│   │   │   ├── scan.php         # QR code scan check-in (POST)
│   │   │   └── webcam.php       # Webcam-based check-in (optional)
│   │   │
│   │   ├── qrcode/              # QR Code generation & scanning
│   │   │   └── index.php        # Generate/display QR codes (GET)
│   │   │
│   │   ├── reports/             # Attendance reports
│   │   │   ├── session.php      # Session-wise report (GET)
│   │   │   ├── user.php         # User attendance history
│   │   │   ├── event.php        # Event attendance summary
│   │   │   └── export.php       # Export reports (CSV/Excel)
│   │   │
│   │   └── sessions/            # Attendance session management
│   │       ├── index.php        # CRUD sessions (GET/POST/PUT/DELETE)
│   │       ├── active.php       # List active sessions only
│   │       └── close.php        # Close/end a session
│   │
│   ├── auth/                     # Authentication endpoints
│   │   ├── login.php            # User login (POST)
│   │   ├── register.php         # User registration (POST) - admin only
│   │   ├── logout.php           # User logout (POST)
│   │   ├── me.php               # Get current user info (GET)
│   │   └── refresh.php          # Token refresh (POST)
│   │
│   ├── events/                   # Event management
│   │   └── index.php            # CRUD events (GET/POST/PUT/DELETE)
│   │
│   ├── meetings/                 # Meeting management
│   │   └── index.php            # CRUD meetings (GET/POST/PUT/DELETE)
│   │
│   └── user/                     # User profile endpoints
│       ├── profile.php           # Update profile (PUT)
│       ├── password.php          # Change password (PUT)
│       └── attendance.php        # Get user's attendance history
│
├── config/                       # Configuration files
│   ├── cors.php                  # CORS configuration
│   ├── database.php              # Database connection
│   ├── env.example               # Environment variables template
│   └── constants.php             # Application constants
│
├── middleware/                   # Middleware functions
│   ├── auth.php                  # Authentication middleware
│   ├── admin.php                 # Admin role middleware
│   ├── validation.php            # Input validation
│   └── logger.php                # Request logging
│
├── public/                       # Publicly accessible files
│   ├── .htaccess                 # Apache rewrite rules
│   ├── index.php                 # Main router/entry point
│   └── assets/                   # Static assets (QR codes, exports)
│
├── utils/                        # Utility classes/functions
│   ├── code_generator.php        # Generate unique codes
│   ├── response_helper.php       # Standard API response format
│   ├── qr_generator.php          # QR code generation utility
│   ├── validator.php             # Data validation helpers
│   └── date_helper.php           # Date/time utilities
│
├── vendor/                       # Composer dependencies
├── logs/                         # Application logs
└── .env                          # Environment variables
```

### Middleware Flow:

- middleware/auth.php → Gatekeeper semua endpoint protected
- Cek token di header
- Validasi di database
- Cek expiry time
- Return user data jika valid
- Auto response 401 jika invalid

## API DOKUMENTASI 📚

---

### Meeting Manajement

##### Required Fiels

- title (string, max 64 chars): Meeting name
- description (string, max 255 chars): Meeting description
- meeting_date (datetime): Date & time (format: YYYY-MM-DD HH:MM:SS)

##### OPTIONAL FIELDS:

- place (string): Location
- status (enum): upcoming (default), ongoing, completed, cancelled

##### Endpoints

```js
// 1. List meetings (with filters)
GET /api/meetings
GET /api/meetings?status=upcoming
GET /api/meetings?date=2025-01-15
GET /api/meetings?upcoming=true

// 2. Create meeting (admin only)
POST /api/meetings
{
    "title": "IT Division Meeting",
    "description": "Website project discussion",
    "meeting_date": "2025-01-20 14:00:00",
    "place": "Computer Lab 1"
}

// 3. Update meeting (admin only)
PUT /api/meetings/{id}
{
    "status": "completed"
}

// 4. Delete meeting (admin only)
DELETE /api/meetings/{id}
```

### EVENTS Management

##### REQUIRED FIELDS:

- title (string): Event name
- description (string): Event description
- event_date (datetime): Event date & time

##### OPTIONAL FIELDS:

- place (string): Location
- status (enum): upcoming, ongoing, completed, cancelled, postponed

##### ENDPOINTS:

```js
// Same as meetings, endpoint: /api/events
GET /api/events?status=upcoming
POST /api/events
PUT /api/events/{id}
DELETE /api/events/{id}
```

### ATTENDANCE SYSTEM

##### ADMIN: Create Attendance Session

```js
POST /api/attendance/sessions
{
    "title": "PHP Workshop Attendance",
    "event_id": 1,        // Optional: link to event
    "meeting_id": 1,      // Optional: link to meeting
    "event_date": "2025-01-15",
    "max_attendees": 50,  // Optional: participant limit
    "expires_in_hours": 24 // Optional: code validity (default: 24h)
}

// Response includes:
{
    "unique_code": "ABC123XY",  // Code for manual check-in
    "qr_data": {...}            // Data for QR code generation
}
```

##### USER: Check-in Methods - MANUAL CHECK-IN (Enter Code)

```js
POST /api/attendance/checkin/manual
{
    "code": "ABC123XY"
}
```

### fitur yang terbaru

- create meeting, event, absensi kehadiran
- checkin manual code

> untuk scan nya belum di selesaikan harus install library dulu kalo tau coba di share
> saat ini qr_code nya masih checkin manual

### output yang mau dibutuhkan FE

- get all meetings.
- get all events.
- get all user.

> ini dibutuhkan untuk menampilkan semua data dari BE > FE.

### Contoh outputnya:

```json
{
  "status": true,
  "message": "pesan get data",
  "data": [
    {
      "title": "judul 1",
      "description": "deskripsi 1",
      "dan_data_lainya": "..."
    },
    {
      "title": "judul 2",
      "description": "deskripsi 2",
      "dan_data_lainya": "..."
    }
  ]
}
```
