import { BetterFetchError } from "@better-fetch/fetch";

export function isBetterFetchError(err: unknown): err is BetterFetchError {
  return err instanceof BetterFetchError;
}
