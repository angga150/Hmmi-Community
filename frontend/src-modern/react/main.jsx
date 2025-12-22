import React from "react";
import ReactDOM from "react-dom/client";
import LoginForm from "./LoginForm"; // komponen utama Anda
//import "./index.css"; // custom CSS

// Bootstrap CSS (jika ingin import via npm)
import "bootstrap/dist/css/bootstrap.min.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <LoginForm />
  </React.StrictMode>
);
