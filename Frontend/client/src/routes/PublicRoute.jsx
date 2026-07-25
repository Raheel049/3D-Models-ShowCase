import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../Components/Context/useAuth";

const PublicRoute = () => {
  const { loading, isAuthenticated } = useAuth();

  if (loading) return <h2>Loading...</h2>;

  if (isAuthenticated) {
    return <Navigate to="/Dashboard" replace />;
  }

  return <Outlet />;
};

export default PublicRoute;