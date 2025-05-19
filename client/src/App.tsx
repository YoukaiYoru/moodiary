// App.tsx
import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./router/ProtectedRoute";
import Layout from "./home/Layout";
import Home from "./pages/Home";
import HomeLogin from "./pages/HomeLogin";
import Statistics from "./pages/Statistics";
import MoodNotes from "./pages/MoodNotes";

function App() {
  return (
    <Routes>
      {/* Ruta pública */}
      <Route path="/" element={<Home />} />

      {/* Rutas protegidas con layout directamente */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route index element={<HomeLogin />} />
        <Route path="stats" element={<Statistics />} />
        <Route path="notes/:id" element={<MoodNotes />} />
      </Route>
    </Routes>
  );
}

export default App;
