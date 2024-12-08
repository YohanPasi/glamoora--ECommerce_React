import { Navigate, useLocation } from "react-router-dom";
import PropTypes from "prop-types";

function CheckAuth({ isAuthenticated, user, children }) {
  const location = useLocation();

  // Redirect unauthenticated users to login unless already on login/register pages
  if (
    !isAuthenticated &&
    !location.pathname.includes("/login") &&
    !location.pathname.includes("/register")
  ) {
    return <Navigate to="/auth/login" replace />;
  }

  // Redirect authenticated users away from login/register pages to their dashboards
  if (
    isAuthenticated &&
    (location.pathname.includes("/login") || location.pathname.includes("/register"))
  ) {
    if (user?.role === "admin") {
      return <Navigate to="/admin/dashboard" replace />;
    } else if (user?.role === "user") {
      return <Navigate to="/shop/home" replace />;
    }
  }

  // Prevent non-admin users from accessing admin routes
  if (isAuthenticated && location.pathname.includes("/admin")) {
    if (user?.role !== "admin") {
      return <Navigate to="/unauth-page" replace />;
    }
  }

  // Prevent admin users from accessing shop routes
  if (isAuthenticated && location.pathname.includes("/shop")) {
    if (user?.role === "admin") {
      return <Navigate to="/admin/dashboard" replace />;
    }
  }

  // Redirect authenticated users with no or unexpected roles
  if (isAuthenticated && !["admin", "user"].includes(user?.role)) {
    return <Navigate to="/unauth-page" replace />;
  }

  // Allow access to children if none of the above conditions are met
  return <>{children}</>;
}

CheckAuth.propTypes = {
  isAuthenticated: PropTypes.bool.isRequired,
  user: PropTypes.shape({
    role: PropTypes.string,
  }),
  children: PropTypes.node.isRequired,
};

export default CheckAuth;
