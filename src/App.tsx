
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
const ServersPage = lazy(() => import("./pages/ServersPage"));
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

// Application detail and resource pages
const ApplicationDetailPage = lazy(() => import("./pages/applications/ApplicationDetailPage"));
const ApiFormPage = lazy(() => import("./pages/applications/api/ApiFormPage"));
const ServiceFormPage = lazy(() => import("./pages/applications/service/ServiceFormPage"));
const MessageFormPage = lazy(() => import("./pages/applications/message/MessageFormPage"));

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
  const { session, loading } = useAuth();

  if (loading) {
    return <div className="flex h-screen w-full items-center justify-center">Loading...</div>;
  }

  return <>{children}</>;
};

// Public routes that redirect to dashboard if logged in
const RedirectIfAuthenticated = ({ children }: { children: React.ReactNode }) => {
  const { session, loading } = useAuth();

  if (loading) {
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
        {/* <Route path="/" element={<LandingPage />} /> */}
        <Route element={<DashboardLayout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Route>
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
        <Route path="/dashboard" element={<Dashboard />} />

        {/* Projects routes */}
        <Route path="/projects" element={<ProjectsPage />} />
        <Route path="/projects/new" element={<AuthenticatedRoute><NewProjectPage /></AuthenticatedRoute>} />

        {/* Applications routes */}
        <Route path="/applications" element={<ApplicationsPage />} />
        <Route path="/applications/new" element={<AuthenticatedRoute><NewApplicationPage /></AuthenticatedRoute>} />
        <Route path="/applications/:id" element={<AuthenticatedRoute><ApplicationDetailPage /></AuthenticatedRoute>} />
        <Route path="/applications/:applicationId/apis/new" element={<AuthenticatedRoute><ApiFormPage /></AuthenticatedRoute>} />
        <Route path="/applications/:applicationId/apis/:apiId" element={<AuthenticatedRoute><ApiFormPage /></AuthenticatedRoute>} />
        <Route path="/applications/:applicationId/services/new" element={<AuthenticatedRoute><ServiceFormPage /></AuthenticatedRoute>} />
        <Route path="/applications/:applicationId/services/:serviceId" element={<AuthenticatedRoute><ServiceFormPage /></AuthenticatedRoute>} />
        <Route path="/applications/:applicationId/messages/new" element={<AuthenticatedRoute><MessageFormPage /></AuthenticatedRoute>} />
        <Route path="/applications/:applicationId/messages/:messageId" element={<AuthenticatedRoute><MessageFormPage /></AuthenticatedRoute>} />

        {/* Servers routes */}
        <Route path="/servers" element={<ServersPage />} />
        <Route path="/servers/new" element={<AuthenticatedRoute><NewServerPage /></AuthenticatedRoute>} />

        {/* AI Tools routes */}
        <Route path="/ai-tools" element={<AIToolsPage />} />
        <Route path="/ai-tools/new" element={<AuthenticatedRoute><NewToolPage /></AuthenticatedRoute>} />

        <Route path="/models" element={<ProjectsPage />} />
        <Route path="/data" element={<ProjectsPage />} />
        <Route path="/agents" element={<ProjectsPage />} />
        <Route path="/orgs" element={<OrganizationsPage />} />
        <Route path="/orgs/:slug" element={<OrganizationDetailPage />} />
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
