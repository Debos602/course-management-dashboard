import { Navigate, useLocation } from "react-router-dom";
import { toast } from "sonner";
import PropTypes from "prop-types";
import { useAppDispatch, useAppSelector } from "../redux/features/hook";
import {
  logout,
  selectCurrentToken,
  selectCurrentUser,
} from "../redux/features/auth/authSlice";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const dispatch = useAppDispatch();
  const token = useAppSelector(selectCurrentToken);
  const userData = useAppSelector(selectCurrentUser); // Redux থেকে ইউজার ডাটা নিন
  const location = useLocation();

  if (!token) {
    console.log("[ProtectedRoute] No token found - redirecting to login");
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  try {
    if (!userData) {
      throw new Error("User data not found in Redux store");
    }

    // server response অনুযায়ী role extract করা
    const userRole = userData?.role; // small-case 'role'

    if (!userRole) {
      throw new Error("Role information not found in user data");
    }

    if (!allowedRoles || !Array.isArray(allowedRoles)) {
      console.error("[ProtectedRoute] Invalid allowedRoles:", allowedRoles);
      throw new Error("Invalid role configuration");
    }

    // case-insensitive comparison
    const normalizedUserRole = userRole.toLowerCase();
    const normalizedAllowedRoles = allowedRoles.map((role) =>
      role.toLowerCase()
    );

    if (!normalizedAllowedRoles.includes(normalizedUserRole)) {
      console.log(
        `[ProtectedRoute] Role ${userRole} not in allowed roles:`,
        allowedRoles
      );
      return <Navigate to="/unauthorized" replace />;
    }
  } catch (error) {
    console.error("[ProtectedRoute] Authentication error:", error);
    toast.error("Your session has expired. Please log in again.");
    dispatch(logout());
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
  allowedRoles: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default ProtectedRoute;
