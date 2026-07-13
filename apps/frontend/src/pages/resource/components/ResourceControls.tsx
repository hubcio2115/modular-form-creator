import type { PropsWithChildren } from "react";
import { useLocation, useNavigate } from "react-router";
import { ChevronLeft } from "lucide-react";
import { IconButton } from "@components/design-system";
import { FieldLabel, FieldRow, FieldValue } from "./ResourceLayout";

export function BackButton() {
  const navigate = useNavigate();
  const location = useLocation();

  const state = location.state as { resourcesSearch?: string } | null;
  const resourcesSearch = typeof state?.resourcesSearch === "string" ? state.resourcesSearch : "";

  function onClick() {
    navigate({ pathname: "/resources", search: resourcesSearch });
  }

  return (
    <IconButton variant="ghost" aria-label="Go back" onClick={onClick}>
      <ChevronLeft />
    </IconButton>
  );
}

interface FieldProps extends PropsWithChildren {
  label: string;
}

export function Field({ label, children }: FieldProps) {
  return (
    <FieldRow>
      <FieldLabel>{label}</FieldLabel>

      <FieldValue>{children}</FieldValue>
    </FieldRow>
  );
}
