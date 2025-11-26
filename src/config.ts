// Detecta si estamos en localhost
const isLocalhost = window.location.hostname === "localhost";

// URL del backend
export const API_URL = isLocalhost
  ? "http://localhost:8080"
  : "https://router-manager-bakend.onrender.com";
