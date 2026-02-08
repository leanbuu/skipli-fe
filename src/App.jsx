import { Routes, Route } from "react-router-dom";
import LoginPage from './pages/LoginPage';
import InstructorDashboard from "./pages/InstructorDashboard";
import StudentDashboard from "./pages/StudentDashboard";
import VerifyStudent from "./pages/VerifyStudent";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/verify-email" element={<VerifyStudent />} />
      <Route path="/instructor/dashboard" element={<InstructorDashboard />} />
      <Route path="/student/dashboard" element={<StudentDashboard />} />
    </Routes>
  );
}

