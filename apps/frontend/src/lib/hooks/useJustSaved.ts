import { useEffect, useState } from "react";

/**
 * Tracks a transient "just saved" flag used to flash success UI (eq. a checkmark).
 *
 * Call the returned `markSaved` after a successful save. The flag flips to `true`
 * and automatically resets to `false` after `ms` duration.
 *
 * @param ms How long the flag stays `true`, in milliseconds. Defaults to 3000.
 */
export function useJustSaved(ms = 3_000) {
  const [justSaved, setJustSaved] = useState(false);

  useEffect(() => {
    if (!justSaved) return;

    const timeout = setTimeout(() => setJustSaved(false), ms);
    return () => clearTimeout(timeout);
  }, [justSaved, ms]);

  function markSaved() {
    setJustSaved(true);
  }

  return [justSaved, markSaved] as const;
}
