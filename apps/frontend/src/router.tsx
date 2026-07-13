import { createBrowserRouter } from "react-router";
import Home from "./pages/home/Home";
import { loader as homeLoader } from "./pages/home/homeLoader";
import RootLayout from "./layouts/root-layout";
import { queryClient } from "@lib/query-client";

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
    ],
  },
]);
