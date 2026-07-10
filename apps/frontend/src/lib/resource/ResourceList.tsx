import { useInfiniteQuery } from "@tanstack/react-query";
import { NavLink } from "react-router";
import { resourceQueryOptions } from "./resource.queries";
import type { PaginatedResourceParams } from "~/pages/home/homeLoader";
import { Badge, Button, Card } from "~/components/design-system";
import { Spinner } from "~/components/Spinner";
import { Dimmable } from "~/components/Dimmable";
import ResourceMessageCard from "./ResourceMessageCard";
import { styled } from "styled-components";

interface ResourceTableProps {
  searchParams: PaginatedResourceParams;
  onCreate: () => void;
}

export default function ResourceList({ searchParams, onCreate }: ResourceTableProps) {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery(
    resourceQueryOptions.list(searchParams),
  );

  if (!data) return null;

  const items = [...new Map(data.pages.flatMap((page) => page.items).map((item) => [item.resourceId, item])).values()];

  if (items.length === 0 && !!searchParams.name) {
    return <ResourceMessageCard title="No results" message={`Nothing matches "${searchParams.name}".`} />;
  }

  if (items.length === 0) {
    return (
      <ResourceMessageCard title="There are no resources yet">
        <Button onClick={onCreate}>Create</Button>
      </ResourceMessageCard>
    );
  }

  return (
    <Resources>
      {items.map((resource) => (
        <ResourceLink key={resource.resourceId} to={`/resources/${resource.resourceId}`}>
          {({ isPending }) => (
            <CardSlot>
              <Dimmable $dimmed={isPending}>
                <Card>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    {resource.name}
                    <Badge variant={resource.status === "completed" ? "success" : "info"}>{resource.status}</Badge>
                  </div>
                </Card>
              </Dimmable>

              {isPending && (
                <SpinnerOverlay>
                  <CardSpinner />
                </SpinnerOverlay>
              )}
            </CardSlot>
          )}
        </ResourceLink>
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

const ResourceLink = styled(NavLink)`
  text-decoration: none;
  color: inherit;
`;

const CardSlot = styled.div`
  position: relative;
`;

const SpinnerOverlay = styled.div`
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
`;

const CardSpinner = styled(Spinner)`
  position: static;
`;
