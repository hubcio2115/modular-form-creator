import { createBrowserRouter } from "react-router";

import RootLayout from "./layouts/root-layout";
import { queryClient } from "@lib/query-client";

import Home from "./pages/home/Home";
import { loader as homeLoader } from "./pages/home/homeLoader";

import ResourceDetailsPage from "./pages/resource/ResourceDetails";
import { loader as resourceDetailsLoader } from "./pages/resource/resourceDetailsLoader";

import RouteError from "./pages/error/RouteError";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: RootLayout,
    children: [
      {
        index: true,
        Component: Home,
        loader: homeLoader(queryClient),
      },

      {
        path: "resources/:resourceId",
        Component: ResourceDetailsPage,
        loader: resourceDetailsLoader(queryClient),
        ErrorBoundary: RouteError,
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
