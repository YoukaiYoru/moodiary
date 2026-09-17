import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { BrowserRouter } from "react-router-dom";
import { NoteUpdateProvider } from "@/contexts/NoteUpdateContext";
import { AuthProvider } from "@/contexts/AuthContext";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AuthProvider>
      <NoteUpdateProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </NoteUpdateProvider>
    </AuthProvider>
  </StrictMode>
);
