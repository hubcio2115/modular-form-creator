import { Suspense } from "react";
import { Outlet, useParams } from "react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Badge } from "@components/design-system";
import { Skeleton } from "@components/Skeleton";
import type { Resource } from "~/lib/resource/resource";
import { resourceQueryOptions } from "~/lib/resource/resource.queries";
import { ResourceNav } from "./ResourceNav";
import { BackButton } from "./ResourceControls";
import { BadgeSkeleton, DetailsCard, Header, Heading, Page } from "./ResourceLayout";

export default function ResourceShellLayout() {
  const { resourceId } = useParams();

  return (
    <Page>
      <Suspense fallback={<ResourceShellSkeleton />}>
        <ResourceShell resourceId={+resourceId!} />
      </Suspense>
    </Page>
  );
}

function ResourceShell({ resourceId }: Pick<Resource, "resourceId">) {
  const { data: resource } = useSuspenseQuery(resourceQueryOptions.getById(resourceId));

  return (
    <DetailsCard>
      <Header>
        <BackButton />

        <Heading>{resource.name}</Heading>

        <Badge variant={resource.status === "completed" ? "success" : "info"}>{resource.status}</Badge>
      </Header>

      <ResourceNav resourceId={resource.resourceId} />

      <Outlet context={resource} />
    </DetailsCard>
  );
}

function ResourceShellSkeleton() {
  return (
    <DetailsCard aria-busy="true" aria-live="polite">
      <Header>
        <BackButton />

        <Heading>
          <Skeleton $height="1.5rem" $width="60%" />
        </Heading>

        <BadgeSkeleton $height="1.5rem" $width="3rem" />
      </Header>
    </DetailsCard>
  );
}
