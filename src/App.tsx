import { BrowserRouter as Router, Routes, Route } from "react-router";
import ProtectedRoute from "./hooks/protectedRoute";
import ResetPasswordForm from "./pages/AuthPages/ResetPasswordForm";
import ResetRequest from "./pages/AuthPages/ResetRequest";
import SignIn from "./pages/AuthPages/SignIn";
import SignUp from "./pages/AuthPages/SignUp";
import AppLayout from "./layout/AppLayout";
import NotFound from "./pages/otherPages/NotFound";
import { Home } from "./pages/home/Home";

function App() {
  return (
    <Router basename="/">
      <Routes>
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/reset-password" element={<ResetRequest />} />
        <Route path="/reset-password-form" element={<ResetPasswordForm />} />
        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            {/* Rutas de la página del Dashboard */}
            <Route index path="/" element={<Home />} />
          </Route>
        </Route>
        {/* Ruta de Fallback */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
