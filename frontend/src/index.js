import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App"; // ✅ This imports your App.jsx
import "./index.css";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
