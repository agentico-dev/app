
import { Navigate } from "react-router";

const Index = () => {
  // Redirects to the dashboard instead of "/index"
  return <Navigate to="/dashboard" replace />;
};

export default Index;
