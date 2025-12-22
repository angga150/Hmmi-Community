import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App"; // komponen utama
//import "./index.css"; // custom CSS

// Bootstrap CSS (jika ingin import via npm)
// import "bootstrap/dist/css/bootstrap.min.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
