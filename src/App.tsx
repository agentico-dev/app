import React from 'react';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import Index from "./pages/Index";
import DashboardLayout from "./components/layout/DashboardLayout";
import ErrorBoundary from "./components/ErrorBoundary";
import ProjectsPage from "./pages/ProjectsPage";
import ApplicationsPage from "./pages/ApplicationsPage";
import ServersPage from "./pages/ServersPage";
import AIToolsPage from "./pages/AIToolsPage";
import StudioPage from "./pages/StudioPage";
import SearchPage from "./pages/SearchPage";
import ProfilePage from "./pages/ProfilePage";
import SettingsPage from "./pages/SettingsPage";
import OrganizationsPage from "./pages/OrganizationsPage";
import OrganizationDetailPage from "./pages/OrganizationDetailPage";
import ProjectDetailPage from "./pages/ProjectDetailPage";
import ApplicationDetailPage from "./pages/ApplicationDetailPage";
import ServerDetailPage from "./pages/ServerDetailPage";
import AIToolDetailPage from "./pages/AIToolDetailPage";
import LoginPage from "./pages/LoginPage";
import { useAuth } from './hooks/useAuth';
import { useEffect } from 'react';
import EnvironmentsPage from "./pages/settings/EnvironmentsPage";
import EnvironmentDetailPage from "./pages/settings/EnvironmentDetailPage";

function App() {
  const { session, isLoading, supabase } = useAuth();

  useEffect(() => {
    // Check auth condition once the session is loaded
    if (isLoading) {
      console.log('Auth is loading...');
      return; // Do nothing until auth is loaded
    }

    if (!session) {
      console.log('No active Supabase session found.');
    } else {
      console.log('Supabase session found:', session);
    }
  }, [session, isLoading, supabase]);

  // Show a loading indicator while the auth state is loading
  if (isLoading) {
    return <div>Loading...</div>;
  }

  const router = createBrowserRouter([
    {
      path: "/",
      element: <DashboardLayout />,
      errorElement: <ErrorBoundary />,
      children: [
        {
          path: "index",
          element: <Index />,
        },
        {
          path: "/",
          element: <ProjectsPage />,
        },
        {
          path: "projects",
          element: <ProjectsPage />,
        },
        {
          path: "projects/:slug",
          element: <ProjectDetailPage />,
        },
        {
          path: "apps",
          element: <ApplicationsPage />,
        },
        {
          path: "apps/:slug",
          element: <ApplicationDetailPage />,
        },
        {
          path: "servers",
          element: <ServersPage />,
        },
        {
          path: "servers/:slug",
          element: <ServerDetailPage />,
        },
        {
          path: "tools",
          element: <AIToolsPage />,
        },
        {
          path: "tools/:slug",
          element: <AIToolDetailPage />,
        },
        {
          path: "studio",
          element: <StudioPage />,
        },
        {
          path: "search",
          element: <SearchPage />,
        },
        {
          path: "profile",
          element: <ProfilePage />,
        },
        {
          path: "settings",
          element: <SettingsPage />,
        },
        {
          path: "orgs",
          element: <OrganizationsPage />,
        },
        {
          path: "orgs/:slug",
          element: <OrganizationDetailPage />,
        },
        {
          path: "settings/environments",
          element: <EnvironmentsPage />,
        },
        {
          path: "settings/environments/:id",
          element: <EnvironmentDetailPage />,
        },
      ],
    },
    {
      path: "/login",
      element: <LoginPage />,
    },
  ], { basename: import.meta.env.BASE_URL });

  return (
    <React.StrictMode>
      <RouterProvider router={router} />
    </React.StrictMode>
  );
}

export default App;
