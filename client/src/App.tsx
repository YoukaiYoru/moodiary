// App.tsx
import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./router/ProtectedRoute";
import Layout from "./home/Layout";
import Home from "./pages/Home";
import HomeLogin from "./pages/HomeLogin";
import Statistics from "./pages/Statistics";

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
      </Route>
    </Routes>
  );
}

export default App;
