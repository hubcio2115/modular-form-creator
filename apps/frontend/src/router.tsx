import { createBrowserRouter } from "react-router";
import Home from "./pages/Home";
import RootLayout from "./layouts/root-layout";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: RootLayout,
    children: [
      {
        index: true,
        Component: Home,
      },
    ],
  },
]);
