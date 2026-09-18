// App.tsx
import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./router/ProtectedRoute";
import Layout from "./home/Layout";
import Home from "./pages/Home";
import Loader from "./components/Loader";

const HomeLogin = lazy(() => import("./pages/HomeLogin"));
const Statistics = lazy(() => import("./pages/Statistics"));
const MoodNotes = lazy(() => import("./pages/MoodNotes"));
const ProfileSettings = lazy(() => import("./pages/ProfileSettings"));

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
        <Route
          index
          element={
            <Suspense fallback={<Loader isLoaded={false} />}>
              <HomeLogin />
            </Suspense>
          }
        />
        <Route
          path="stats"
          element={
            <Suspense fallback={<Loader isLoaded={false} />}>
              <Statistics />
            </Suspense>
          }
        />
        <Route
          path="notes/:id"
          element={
            <Suspense fallback={<Loader isLoaded={false} />}>
              <MoodNotes />
            </Suspense>
          }
        />
        <Route
          path="profile"
          element={
            <Suspense fallback={<Loader isLoaded={false} />}>
              <ProfileSettings />
            </Suspense>
          }
        />
      </Route>
    </Routes>
  );
}

export default App;
