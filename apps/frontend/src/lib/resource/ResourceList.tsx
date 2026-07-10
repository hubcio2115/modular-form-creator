import { useInfiniteQuery } from "@tanstack/react-query";
import { resourceQueryOptions } from "./resource.queries";
import type { PaginatedResourceParams } from "~/pages/home/homeLoader";
import { Link } from "react-router";
import { Badge, Button, Card } from "~/components/design-system";
import ResourceMessageCard from "./ResourceMessageCard";
import { styled } from "styled-components";

interface ResourceTableProps {
  searchParams: PaginatedResourceParams;
}

export default function ResourceList({ searchParams }: ResourceTableProps) {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery(
    resourceQueryOptions.list(searchParams),
  );

  if (!data) return null;

  const items = data.pages.flatMap((page) => page.items);

  if (items.length === 0 && !!searchParams.name) {
    return <ResourceMessageCard title="No results" message={`Nothing matches "${searchParams.name}".`} />;
  }

  if (items.length === 0) {
    return (
      <ResourceMessageCard title="There are no resources yet">
        <Link to="/">
          <Button>Create</Button>
        </Link>
      </ResourceMessageCard>
    );
  }

  return (
    <Resources>
      {items.map((resource) => (
        <Card key={resource.resourceId}>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            {resource.name}
            <Badge variant={resource.status === "completed" ? "success" : "info"}>{resource.status}</Badge>
          </div>
        </Card>
      ))}

      {hasNextPage && (
        <Button onClick={() => fetchNextPage()} disabled={isFetchingNextPage}>
          {isFetchingNextPage ? "Loading..." : "Load more"}
        </Button>
      )}
    </Resources>
  );
}

const Resources = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;
