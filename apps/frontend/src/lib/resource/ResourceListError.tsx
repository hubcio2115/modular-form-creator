import { Button } from "~/components/design-system";
import ResourceMessageCard from "./ResourceMessageCard";

interface ResourceListErrorProps {
  onRetry: () => void;
}

export default function ResourceListError({ onRetry }: ResourceListErrorProps) {
  return (
    <ResourceMessageCard title="Something went wrong :(" message="We couldn't load your resources.">
      <Button onClick={onRetry}>Retry</Button>
    </ResourceMessageCard>
  );
}
