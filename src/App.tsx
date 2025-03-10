
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";

// Layouts
import DashboardLayout from "./components/layout/DashboardLayout";

// Pages
import Dashboard from "./pages/Dashboard";
import ProjectsPage from "./pages/ProjectsPage";
import AIToolsPage from "./pages/AIToolsPage";
import ApplicationsPage from "./pages/ApplicationsPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Simple auth context simulation
const useAuth = () => {
  // In a real app, this would check for a token in localStorage or a cookie
  const [isAuthenticated, setIsAuthenticated] = useState(true); // For demo, defaulting to true

  useEffect(() => {
    // Here you would check for a valid auth token
    const hasToken = localStorage.getItem("authToken");
    setIsAuthenticated(!!hasToken || true); // For demo, always true
  }, []);

  return { isAuthenticated };
};

const App = () => {
  const { isAuthenticated } = useAuth();
  
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Auth routes (accessible when not authenticated) */}
            <Route path="/login" element={
              isAuthenticated ? <Navigate to="/" /> : <LoginPage />
            } />
            <Route path="/register" element={
              isAuthenticated ? <Navigate to="/" /> : <RegisterPage />
            } />
            
            {/* Protected routes (dashboard layout) */}
            <Route element={
              isAuthenticated ? <DashboardLayout /> : <Navigate to="/login" />
            }>
              <Route path="/" element={<Dashboard />} />
              <Route path="/projects" element={<ProjectsPage />} />
              <Route path="/applications" element={<ApplicationsPage />} />
              <Route path="/ai-tools" element={<AIToolsPage />} />
              <Route path="/servers" element={<ProjectsPage />} /> {/* Placeholder */}
              <Route path="/models" element={<ProjectsPage />} /> {/* Placeholder */}
              <Route path="/data" element={<ProjectsPage />} /> {/* Placeholder */}
              <Route path="/agents" element={<ProjectsPage />} /> {/* Placeholder */}
              <Route path="/profile" element={<ProjectsPage />} /> {/* Placeholder */}
              <Route path="/settings" element={<ProjectsPage />} /> {/* Placeholder */}
            </Route>
            
            {/* Catch-all route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
