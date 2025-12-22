### setup this repo

```
git clone https://github.com/angga150/Hmmi-Community.git
npm run setup
npm run dev
```

### localhost

`http://localhost:3000/` - Buat Jalankan Frontend.

`http://localhost:8000/` - Buat Jalankan Backend.

### Frontend Login

`http://localhost:3000/test.html` - Ini adalah html dari react.

### Url yang dipanggil untuk react 

- POST http://localhost/Hmmi-Community/backend/public/api/auth/login
- GET  http://localhost/Hmmi-Community/backend/public/api/auth/me
- Header:
- Authorization: TOKEN

### Posisi Pemanggilan 

- User klik Login (React)
- ↓
- React (fetch / axios)
- ↓
- http://localhost/Hmmi-Community/backend/public/api/auth/login
- ↓
- index.php (single entry)
- ↓
- api/auth/login.php
- ↓
- response JSON balik ke React

### Contoh PANGGIL LOGIN di React

### Misalnya di : frontend/src-modern/pages/Login.jsx

``` 
import axios from "axios";

export default function Login() {

  const handleLogin = async () => {
    const response = await axios.post(
      "http://localhost/Hmmi-Community/backend/public/api/auth/login",
      {
        email: "test@mail.com",
        password: "123456"
      }
    );

    // simpan token
    localStorage.setItem("token", response.data.token);
  };

  return <button onClick={handleLogin}>Login</button>;
}
```

### Contoh PANGGIL /me (SETELAH LOGIN)

```
import axios from "axios";
import { useEffect } from "react";

export default function Profile() {

  useEffect(() => {
    axios.get(
      "http://localhost/Hmmi-Community/backend/public/api/auth/me",
      {
        headers: {
          Authorization: localStorage.getItem("token")
        }
      }
    ).then(res => {
      console.log(res.data.user);
    });
  }, []);

  return <div>Profile</div>;
}
```

- 📌 Header Authorization DIKIRIM DARI REACT


### Form login yang di minta backend 
- email 
- password

### logic register dan login sudah diperbaiki
- bisa dikirim lewat form html biasa ( no js ) :
```
<form method="POST" action="http://localhost/project-app/backend/public/api/auth/login">
  <input type="email" name="email" placeholder="Email" required>
  <input type="password" name="password" placeholder="Password" required>
  <button type="submit">Login</button>
</form>
```

- bisa juga dikirim lewat html + js (fetch), contoh :
```
<form id="loginForm">
  <input id="email" type="email">
  <input id="password" type="password">
  <button>Login</button>
</form>

<script>
document.getElementById("loginForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const res = await fetch("http://localhost/project-app/backend/public/api/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      email: email.value,
      password: password.value
    })
  });

  const data = await res.json();
  console.log(data);
});
</script>
```

- bisa juga dari react/vite, contoh :
```
await fetch(import.meta.env.VITE_API_URL + "/auth/login", {
  method: "POST",
  headers: {
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    email,
    password
  })
});
```

### dipikirkan secara logika. terimakasih saya mau istirahat dulu malam lanjut lagi😂
### oh iya itu database nya sedikit saya rubah mohon di update