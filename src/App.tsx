import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useParams } from "react-router";
import { AuthProvider, useAuth } from "./hooks/useAuth";
import { TagsProvider } from "./contexts/TagsContext";
import { lazy, Suspense } from "react";

// Lazy-loaded components
const DashboardLayout = lazy(() => import("./components/layout/DashboardLayout"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const ProjectsPage = lazy(() => import("./pages/ProjectsPage"));
const ProjectDetailPage = lazy(() => import("./pages/projects/ProjectDetailPage"));
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
const ServerDetailPage = lazy(() => import("./pages/servers/ServerDetailPage"));

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

interface RedirectWithSlugProps {
  path: string;
}

interface RedirectWithSlugParams extends Record<string, string> {
  parentSlug: string;
  childSlug: string;
}

// Redirect component for slug-based routes
const RedirectWithSlug: React.FC<RedirectWithSlugProps> = ({ path }) => {
  const params = useParams<RedirectWithSlugParams>();
  return <Navigate to={`/${path}/${params.parentSlug}@${params.childSlug}`} replace />;
};

const AppRoutes = () => {
  const { session } = useAuth();

  // If user is not logged in and is visiting the root path, show landing page
  if (!session.user && window.location.pathname === '/') {
    return (
      <Routes>
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

        {/* Organization routes */}
        <Route path="/orgs" element={<OrganizationsPage />} />
        <Route path="/orgs/:slug" element={<OrganizationDetailPage />} />

        {/* Fix: Use parent route with specific path and child route for redirection */}
        <Route path="/organizations">
          <Route path=":slug" element={<Navigate to={`/orgs/${useParams().slug}`} replace />} />
        </Route>

        {/* Projects routes - both ID and slug-based */}
        <Route path="/projects" element={<ProjectsPage />} />
        <Route path="/projs" element={<Navigate to="/projects" replace />} />
        <Route path="/projects/new" element={<AuthenticatedRoute><NewProjectPage /></AuthenticatedRoute>} />
        <Route path="/projs/new" element={<Navigate to="/projects/new" replace />} />
        <Route path="/projects/:id" element={<ProjectDetailPage />} />
        <Route path="/projects/:orgSlug@:projSlug" element={<ProjectDetailPage />} />
        <Route path="/projs/:orgSlug@:projSlug" element={<Navigate to={`/projects/${useParams().orgSlug}@${useParams().projSlug}`} replace />} />

        {/* Applications routes - both ID and slug-based */}
        <Route path="/applications" element={<ApplicationsPage />} />
        <Route path="/apps" element={<Navigate to="/applications" replace />} />
        <Route path="/applications/new" element={<AuthenticatedRoute><NewApplicationPage /></AuthenticatedRoute>} />
        <Route path="/apps/new" element={<Navigate to="/applications/new" replace />} />

        {/* Application detail routes */}
        <Route path="/applications/:id" element={<AuthenticatedRoute><ApplicationDetailPage /></AuthenticatedRoute>} />
        <Route path="/apps/:orgSlug@:appSlug" element={<AuthenticatedRoute><ApplicationDetailPage /></AuthenticatedRoute>} />

        {/* Application API routes */}
        <Route path="/applications/:applicationId/apis/new" element={<AuthenticatedRoute><ApiFormPage /></AuthenticatedRoute>} />
        <Route path="/apps/:orgSlug@:appSlug/apis/new" element={<AuthenticatedRoute><ApiFormPage /></AuthenticatedRoute>} />
        <Route path="/applications/:applicationId/apis/:apiId" element={<AuthenticatedRoute><ApiFormPage /></AuthenticatedRoute>} />
        <Route path="/apps/:orgSlug@:appSlug/apis/:apiSlug" element={<AuthenticatedRoute><ApiFormPage /></AuthenticatedRoute>} />

        {/* Application Service routes */}
        <Route path="/applications/:applicationId/services/new" element={<AuthenticatedRoute><ServiceFormPage /></AuthenticatedRoute>} />
        <Route path="/apps/:orgSlug@:appSlug/services/new" element={<AuthenticatedRoute><ServiceFormPage /></AuthenticatedRoute>} />
        <Route path="/applications/:applicationId/services/:serviceId" element={<AuthenticatedRoute><ServiceFormPage /></AuthenticatedRoute>} />
        <Route path="/apps/:orgSlug@:appSlug/services/:serviceSlug" element={<AuthenticatedRoute><ServiceFormPage /></AuthenticatedRoute>} />

        {/* Application Message routes */}
        <Route path="/applications/:applicationId/messages/new" element={<AuthenticatedRoute><MessageFormPage /></AuthenticatedRoute>} />
        <Route path="/apps/:orgSlug@:appSlug/messages/new" element={<AuthenticatedRoute><MessageFormPage /></AuthenticatedRoute>} />
        <Route path="/applications/:applicationId/messages/:messageId" element={<AuthenticatedRoute><MessageFormPage /></AuthenticatedRoute>} />
        <Route path="/apps/:orgSlug@:appSlug/messages/:messageId" element={<AuthenticatedRoute><MessageFormPage /></AuthenticatedRoute>} />

        {/* Servers routes - both ID and slug-based */}
        <Route path="/servers" element={<ServersPage />} />
        <Route path="/servers/new" element={<AuthenticatedRoute><NewServerPage /></AuthenticatedRoute>} />
        <Route path="/servers/:id" element={<AuthenticatedRoute><ServerDetailPage /></AuthenticatedRoute>} />
        <Route path="/servers/:projSlug@:serverSlug" element={<AuthenticatedRoute><ServerDetailPage /></AuthenticatedRoute>} />

        {/* AI Tools routes - both ID and slug-based */}
        <Route path="/ai-tools" element={<AIToolsPage />} />
        <Route path="/tools" element={<Navigate to="/ai-tools" replace />} />
        <Route path="/ai-tools/new" element={<AuthenticatedRoute><NewToolPage /></AuthenticatedRoute>} />
        <Route path="/tools/new" element={<Navigate to="/ai-tools/new" replace />} />
        <Route path="/ai-tools/:id" element={<AIToolsPage />} />
        <Route path="/tools/:serverSlug@:toolSlug" element={<Navigate to={`/ai-tools/${window.location.pathname.split('/')[2]}`} replace />} />

        {/* Legacy routes that will be updated */}
        <Route path="/models" element={<ProjectsPage />} />
        <Route path="/data" element={<ProjectsPage />} />
        <Route path="/agents" element={<ProjectsPage />} />

        {/* User profile and settings */}
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
