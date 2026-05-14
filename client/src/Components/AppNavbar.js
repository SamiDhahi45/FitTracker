import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  Navbar, NavbarBrand, NavbarToggler, Collapse,
  Nav, NavItem, NavLink, Button
} from "reactstrap";
import { logout } from "../Features/UserSlice";

const AppNavbar = () => {
  const dispatch  = useDispatch();
  const navigate  = useNavigate();
  const user      = useSelector((state) => state.users.user);
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <Navbar color="primary" dark expand="md" className="px-3">
      <NavbarBrand href="/">FitTrack</NavbarBrand>
      <NavbarToggler onClick={() => setIsOpen(!isOpen)} />
      <Collapse isOpen={isOpen} navbar>
        <Nav className="me-auto" navbar>
          <NavItem><NavLink href="/" className="text-white">Dashboard</NavLink></NavItem>
          <NavItem><NavLink href="/workouts" className="text-white">Workouts</NavLink></NavItem>
          <NavItem><NavLink href="/exercises" className="text-white">Exercises</NavLink></NavItem>
          <NavItem><NavLink href="/profile" className="text-white">Profile</NavLink></NavItem>
          <NavItem><NavLink href="/nearby-gyms" className="text-white">Nearby Gyms</NavLink></NavItem>
        </Nav>
        <Nav navbar>
          <NavItem className="d-flex align-items-center me-3 text-white">
            {user?.name}
          </NavItem>
          <NavItem>
            <Button color="light" size="sm" onClick={handleLogout}>Logout</Button>
          </NavItem>
        </Nav>
      </Collapse>
    </Navbar>
  );
};

export default AppNavbar;
