import { createFetch } from "@better-fetch/fetch";
import { env } from "@lib/env";

export const $fetch = createFetch({
  baseURL: env.VITE_API_URL,
});
