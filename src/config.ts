// Detecta si estamos en localhost
const isLocalhost = window.location.hostname === "localhost";

// URL del backend
export const API_URL = isLocalhost
  ? "http://localhost:8080"
  : "https://router-manager-backend-456769918123.us-central1.run.app";
