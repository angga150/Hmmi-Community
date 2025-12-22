import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

import React from "react";
import ReactDOM from "react-dom/client";
import LoginForm from "./LoginForm";

ReactDOM.createRoot(document.getElementById("react-login")).render(
  <LoginForm />
);
