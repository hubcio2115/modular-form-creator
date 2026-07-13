import type { Preview } from "@storybook/react-vite";
import { ThemeProvider } from "styled-components";
import { GlobalStyles } from "../src/components/design-system";
import { theme } from "../src/components/design-system/theme/theme";

const preview: Preview = {
  decorators: [
    (Story) => (
      <ThemeProvider theme={theme}>
        <GlobalStyles />
        <div style={{ padding: "24px" }}>
          <Story />
        </div>
      </ThemeProvider>
    ),
  ],
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    a11y: {
      test: "todo",
    },
  },
};

export default preview;
