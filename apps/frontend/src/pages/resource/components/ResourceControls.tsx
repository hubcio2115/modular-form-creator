import type { PropsWithChildren } from "react";
import { useLocation, useNavigate } from "react-router";
import { ChevronLeft } from "lucide-react";
import { IconButton } from "@components/design-system";
import { FieldLabel, FieldRow, FieldValue } from "./ResourceLayout";

export function BackButton() {
  const navigate = useNavigate();
  const location = useLocation();

  const canGoBack = location.key !== "default";

  function onClick() {
    if (canGoBack) {
      navigate(-1);
    } else {
      navigate("/resources");
    }
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
