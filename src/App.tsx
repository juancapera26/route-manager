import { BrowserRouter as Router, Routes, Route } from "react-router";
import ProtectedRoute from "./hooks/protectedRoute";
import ResetPasswordForm from "./pages/AuthPages/ResetPasswordForm";
import ResetRequest from "./pages/AuthPages/ResetRequest";
import SignIn from "./pages/AuthPages/SignIn";
import SignUp from "./pages/AuthPages/SignUp";
import AppLayout from "./layout/AppLayout";
import NotFound from "./pages/otherPages/NotFound";
import { Home } from "./pages/home/Home";
import { Admin } from "./pages/admin/Admin";
import AppLayout_home from "./pages/home/layout_conductor/AppLayout_home";

function App() {
  return (
    <Router basename="/">
      <Routes>
        {/* Rutas públicas */}
        <Route path="/" element={<SignIn />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/reset-password" element={<ResetRequest />} />
        <Route path="/reset-password-form" element={<ResetPasswordForm />} />

        {/* Rutas protegidas */}
        <Route element={<ProtectedRoute allowedRoles={["1"]} />}>
          <Route path="/admin" element={<AppLayout />}>
            <Route index element={<Admin />} />
          </Route>
        </Route>

        <Route element={<ProtectedRoute allowedRoles={["2"]} />}>
          <Route path="/home" element={<AppLayout_home />}>
            <Route index element={<Home />} />
          </Route>
        </Route>

        {/* Fallback */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
