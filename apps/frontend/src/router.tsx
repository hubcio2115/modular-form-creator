import { createBrowserRouter, redirect } from "react-router";

import RootLayout from "./layouts/root-layout";
import { queryClient } from "@lib/query-client";

import Home from "./pages/home/Home";
import { loader as homeLoader } from "./pages/home/homeLoader";

import ResourceShellLayout from "./pages/resource/components/ResourceShell";
import ResourceOverviewPage from "./pages/resource/ResourceOverview";
import ResourceDetailsPage from "./pages/resource/ResourceDetails";
import BasicInfoPage from "./pages/resource/BasicInfo";
import ProjectDetailsPage from "./pages/resource/project-details/ProjectDetails";
import { loader as resourceDetailsLoader } from "./pages/resource/resourceDetailsLoader";
import { loader as projectDetailsLoader } from "./pages/resource/project-details/projectDetailsLoader";

import RouteError from "./pages/error/RouteError";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: RootLayout,
    children: [
      {
        index: true,
        loader: () => redirect("/resources"),
      },

      {
        path: "resources",
        Component: Home,
        loader: homeLoader(queryClient),
      },

      {
        path: "resources/:resourceId",
        Component: ResourceShellLayout,
        loader: resourceDetailsLoader(queryClient),
        children: [
          {
            index: true,
            Component: ResourceOverviewPage,
          },
          {
            path: "details",
            Component: ResourceDetailsPage,
          },
          {
            path: "basic-info",
            Component: BasicInfoPage,
          },
          {
            path: "project-details",
            Component: ProjectDetailsPage,
            loader: projectDetailsLoader(queryClient),
          },
        ],
      },

      {
        path: "*",
        loader: () => {
          throw new Response("Page not found", { status: 404, statusText: "Not Found" });
        },
        ErrorBoundary: RouteError,
      },
    ],
  },
]);
