import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import AppNavbar from "./Components/AppNavbar";
import Home from "./Components/Home";
import Login from "./Components/Login";
import Register from "./Components/Register";
import Workouts from "./Components/Workouts";
import Exercises from "./Components/Exercises";
import Profile from "./Components/Profile";
import NearbyGyms from "./Components/NearbyGyms";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login"    element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/"         element={<ProtectedLayout><Home /></ProtectedLayout>} />
        <Route path="/workouts" element={<ProtectedLayout><Workouts /></ProtectedLayout>} />
        <Route path="/exercises" element={<ProtectedLayout><Exercises /></ProtectedLayout>} />
        <Route path="/profile"  element={<ProtectedLayout><Profile /></ProtectedLayout>} />
        <Route path="/nearby-gyms" element={<ProtectedLayout><NearbyGyms /></ProtectedLayout>} />
        <Route path="*"         element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
};

const ProtectedLayout = ({ children }) => {
  return (
    <>
      <AppNavbar />
      <div className="container-fluid mt-4">{children}</div>
    </>
  );
};

export default App;
