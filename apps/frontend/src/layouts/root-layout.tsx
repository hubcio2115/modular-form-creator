import { GlobalStyles, theme } from "@components/design-system";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { NuqsAdapter } from "nuqs/adapters/react-router/v8";
import { ThemeProvider } from "styled-components";
import { Outlet } from "react-router";
import { queryClient } from "~/lib/query-client";

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <NuqsAdapter>
          <GlobalStyles />
          <Outlet />
        </NuqsAdapter>
      </ThemeProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
