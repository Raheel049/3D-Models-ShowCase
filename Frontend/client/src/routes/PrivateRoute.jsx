import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../Components/Context/useAuth";

const PrivateRoute = () => {
  const { loading, isAuthenticated } = useAuth();

  if (loading) return <h2>Loading...</h2>;

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default PrivateRoute;