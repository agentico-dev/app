
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./hooks/useAuth";
import { TagsProvider } from "./contexts/TagsContext";
import { lazy, Suspense } from "react";

// Lazy-loaded components
const DashboardLayout = lazy(() => import("./components/layout/DashboardLayout"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const ProjectsPage = lazy(() => import("./pages/ProjectsPage"));
const AIToolsPage = lazy(() => import("./pages/AIToolsPage"));
const ApplicationsPage = lazy(() => import("./pages/ApplicationsPage"));
const ProfilePage = lazy(() => import("./pages/ProfilePage"));
const LoginPage = lazy(() => import("./pages/auth/LoginPage"));
const RegisterPage = lazy(() => import("./pages/auth/RegisterPage"));
const NotFound = lazy(() => import("./pages/NotFound"));
const LandingPage = lazy(() => import("./pages/LandingPage"));
const OrganizationsPage = lazy(() => import("./pages/OrganizationsPage"));
const OrganizationDetailPage = lazy(() => import("./pages/OrganizationDetailPage"));

// New pages for creating resources
const NewProjectPage = lazy(() => import("./pages/projects/NewProjectPage"));
const NewApplicationPage = lazy(() => import("./pages/applications/NewApplicationPage"));
const NewServerPage = lazy(() => import("./pages/servers/NewServerPage"));
const NewToolPage = lazy(() => import("./pages/ai-tools/NewToolPage"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

// Route guard component to protect routes that require authentication
const AuthenticatedRoute = ({ children }: { children: React.ReactNode }) => {
  const { session } = useAuth();
  
  if (session.isLoading) {
    return <div className="flex h-screen w-full items-center justify-center">Loading...</div>;
  }
  
  return <>{children}</>;
};

// Public routes that redirect to dashboard if logged in
const RedirectIfAuthenticated = ({ children }: { children: React.ReactNode }) => {
  const { session } = useAuth();
  
  if (session.isLoading) {
    return <div className="flex h-screen w-full items-center justify-center">Loading...</div>;
  }
  
  if (session.user) {
    return <Navigate to="/" replace />;
  }
  
  return <>{children}</>;
};

const AppRoutes = () => {
  const { session } = useAuth();
  
  // If user is not logged in and is visiting the root path, show landing page
  if (!session.user && window.location.pathname === '/') {
    return (
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<RedirectIfAuthenticated><LoginPage /></RedirectIfAuthenticated>} />
        <Route path="/register" element={<RedirectIfAuthenticated><RegisterPage /></RedirectIfAuthenticated>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    );
  }
  
  return (
    <Routes>
      {/* Auth routes */}
      <Route path="/login" element={<RedirectIfAuthenticated><LoginPage /></RedirectIfAuthenticated>} />
      <Route path="/register" element={<RedirectIfAuthenticated><RegisterPage /></RedirectIfAuthenticated>} />
      
      {/* Dashboard layout routes - now accessible to all users */}
      <Route element={<DashboardLayout />}>
        <Route path="/" element={<Dashboard />} />
        
        {/* Projects routes */}
        <Route path="/projects" element={<ProjectsPage />} />
        <Route path="/projects/new" element={<AuthenticatedRoute><NewProjectPage /></AuthenticatedRoute>} />
        
        {/* Applications routes */}
        <Route path="/applications" element={<ApplicationsPage />} />
        <Route path="/applications/new" element={<AuthenticatedRoute><NewApplicationPage /></AuthenticatedRoute>} />
        
        {/* Servers routes */}
        <Route path="/servers" element={<ProjectsPage />} />
        <Route path="/servers/new" element={<AuthenticatedRoute><NewServerPage /></AuthenticatedRoute>} />
        
        {/* AI Tools routes */}
        <Route path="/ai-tools" element={<AIToolsPage />} />
        <Route path="/ai-tools/new" element={<AuthenticatedRoute><NewToolPage /></AuthenticatedRoute>} />
        
        <Route path="/models" element={<ProjectsPage />} />
        <Route path="/data" element={<ProjectsPage />} />
        <Route path="/agents" element={<ProjectsPage />} />
        <Route path="/organizations" element={<OrganizationsPage />} />
        <Route path="/organizations/:slug" element={<OrganizationDetailPage />} />
        <Route path="/profile" element={<AuthenticatedRoute><ProfilePage /></AuthenticatedRoute>} />
        <Route path="/settings" element={<AuthenticatedRoute><ProfilePage /></AuthenticatedRoute>} />
      </Route>
      
      {/* Catch-all route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            <TagsProvider>
              <Suspense fallback={<div className="flex h-screen w-full items-center justify-center">Loading...</div>}>
                <AppRoutes />
              </Suspense>
            </TagsProvider>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
