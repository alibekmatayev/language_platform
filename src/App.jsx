import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";

import WelcomePage from "./pages/WelcomePage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Verify from "./pages/Verify";
import Learn from "./pages/Learn";
import Friends from "./pages/Friends";
import Leaderboard from "./pages/Leaderboard";
import Achievements from "./pages/Achievements";
import Profile from "./pages/Profile";
import Logout from "./pages/Logout";
import Error from "./pages/Error";

import ProtectedRoute from "./routes/ProtectedRoute";
import AdminRoute from "./routes/AdminRoute";
import Layout from "./routes/Layout";

import AdminPage from "./components/admin/AdminPage";
import AdminUsers from "./components/admin/users/AdminUsers";
import AdminModules from "./components/admin/modules/AdminModules";
import LessonForm from "./components/admin/lessons/LessonForm";

import ModulesList from "./components/modules/ModulesList";
import ExerciseTest from "./components/exercises/ExerciseTest";

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify/:username/:code" element={<Verify />} />
        <Route path="/logout" element={<Logout />} />
        {/* <Route path="/comingsoon" element={<Error />} /> */}

        {/* Protected Routes с Sidebar */}
        <Route
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route path="/learn" element={<Learn />} />
          <Route path="/modules" element={<ModulesList />} />
          <Route path="/friends/:username" element={<Friends />} />
          <Route path="/ratings" element={<Leaderboard />} />
          <Route path="/achievements" element={<Achievements />} />
          <Route path="/profile/:username" element={<Profile />} />
        </Route>

        {/* Protected Route без Layout — /lesson */}
        <Route
          path="/lesson"
          element={
            <ProtectedRoute>
              <ExerciseTest />
            </ProtectedRoute>
          }
        />

        {/* Protected Routes без Sidebar — админка */}
        <Route
          path="/admin/*"
          element={
            <ProtectedRoute>
              <AdminRoute>
                <AdminPage />
              </AdminRoute>
            </ProtectedRoute>
          }
        >
          <Route path="users" element={<AdminUsers />} />
          <Route path="modules" element={<AdminModules />} />
          <Route path="lessons" element={<LessonForm />} />
          <Route index element={<Navigate to="modules" replace />} />
        </Route>

        {/* Редирект на /learn */}
        <Route path="/" element={<WelcomePage />} />
        <Route path="*" element={<Navigate to="/learn" replace />} />
      </Routes>
    </Router>
  );
}
