// src/main.tsx (ou src/index.tsx) — REMPLACE LE CONTENU POUR GARANTIR LE PROVIDER
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { GoogleReCaptchaProvider } from "react-google-recaptcha-v3";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <GoogleReCaptchaProvider
      reCaptchaKey={import.meta.env.VITE_RECAPTCHA_SITE_KEY}
      scriptProps={{ async: true, defer: true }}
    >
      <App />
    </GoogleReCaptchaProvider>
  </React.StrictMode>
);


