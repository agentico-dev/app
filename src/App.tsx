
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./hooks/useAuth";

// Layouts
import DashboardLayout from "./components/layout/DashboardLayout";

// Pages
import Dashboard from "./pages/Dashboard";
import ProjectsPage from "./pages/ProjectsPage";
import AIToolsPage from "./pages/AIToolsPage";
import ApplicationsPage from "./pages/ApplicationsPage";
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            <Routes>
              {/* Public routes */}
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              
              {/* Protected routes (dashboard layout) */}
              <Route element={<DashboardLayout />}>
                <Route path="/" element={<Dashboard />} />
                <Route path="/projects" element={<ProjectsPage />} />
                <Route path="/applications" element={<ApplicationsPage />} />
                <Route path="/ai-tools" element={<AIToolsPage />} />
                <Route path="/servers" element={<ProjectsPage />} />
                <Route path="/models" element={<ProjectsPage />} />
                <Route path="/data" element={<ProjectsPage />} />
                <Route path="/agents" element={<ProjectsPage />} />
                <Route path="/profile" element={<ProjectsPage />} />
                <Route path="/settings" element={<ProjectsPage />} />
              </Route>
              
              {/* Catch-all route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
