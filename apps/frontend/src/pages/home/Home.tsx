import { useQueryStates } from "nuqs";
import styled, { keyframes } from "styled-components";
import { paginatedResourceParams } from "./homeLoader";
import { Button, Input, Select } from "@components/design-system";
import type { Resource } from "~/lib/resource/resource";
import { useEffect, useState } from "react";
import { useDebounce } from "@uidotdev/usehooks";
import ResourceList from "~/lib/resource/ResourceList";
import ResourceListError from "~/lib/resource/ResourceListError";
import { ErrorBoundary } from "react-error-boundary";
import { QueryErrorResetBoundary, useIsFetching } from "@tanstack/react-query";
import { resourceQueryOptions } from "~/lib/resource/resource.queries";

const statusOptions = [
  { value: "", label: "All statuses" },
  { value: "draft", label: "Draft" },
  { value: "completed", label: "Completed" },
];

const sortOrderOptions = [
  { value: "desc", label: "Descending" },
  { value: "asc", label: "Ascending" },
];

export default function Home() {
  const [searchParams, setSearchParams] = useQueryStates(paginatedResourceParams);

  const [search, setSearch] = useState(searchParams.name);
  const debouncedSearch = useDebounce(search, 500);

  useEffect(() => {
    setSearchParams({ name: debouncedSearch });
  }, [debouncedSearch, setSearchParams]);

  const isFetching = useIsFetching({ queryKey: [resourceQueryOptions.all] }) > 0;

  return (
    <AppShell>
      <ListContainer>
        <div style={{ display: "flex", gap: "1rem", width: "100%" }}>
          <SearchField>
            <Input
              label="Search"
              defaultValue={search ?? ""}
              onChange={(e) => {
                setSearch(e.target.value);
              }}
            />
          </SearchField>

          <Button style={{ alignSelf: "flex-end", maxHeight: "max-content" }}>Add</Button>
        </div>

        <FiltersRow>
          <StatusField>
            <Select
              label="Status"
              options={statusOptions}
              value={searchParams.status ?? ""}
              onChange={(e) => {
                setSearchParams({ status: e.target.value === "" ? null : (e.target.value as Resource["status"]) });
              }}
            />
          </StatusField>

          <SortField>
            <Select
              label="Order"
              options={sortOrderOptions}
              value={searchParams.sortOrder}
              onChange={(e) => {
                setSearchParams({ sortOrder: e.target.value as typeof searchParams.sortOrder });
              }}
            />
          </SortField>
        </FiltersRow>

        <ListRegion>
          {isFetching && (
            <SpinnerOverlay>
              <Spinner />
            </SpinnerOverlay>
          )}

          <QueryErrorResetBoundary>
            {({ reset }) => (
              <ErrorBoundary
                onReset={reset}
                fallbackRender={({ resetErrorBoundary }) => <ResourceListError onRetry={resetErrorBoundary} />}
              >
                <Dimmable $dimmed={isFetching}>
                  <ResourceList searchParams={searchParams} />
                </Dimmable>
              </ErrorBoundary>
            )}
          </QueryErrorResetBoundary>
        </ListRegion>
      </ListContainer>
    </AppShell>
  );
}

const AppShell = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  align-items: center;
  padding: 2rem 1rem;
`;

const ListContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 500px;
  gap: 1rem;
  align-items: center;

  @media (min-width: 768px) {
    max-width: 640px;
  }
`;

const SearchField = styled.div`
  flex: 1;
  min-width: 0;
`;

const FiltersRow = styled.div`
  display: flex;
  gap: 1rem;
  width: 100%;
`;

const StatusField = styled.div`
  flex: 1;
  min-width: 0;
`;

const SortField = styled.div`
  flex: 1;
  min-width: 0;
`;

const ListRegion = styled.div`
  position: relative;
  width: 100%;
`;

const SpinnerOverlay = styled.div`
  position: absolute;
  inset: 0;
  z-index: 10;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  pointer-events: none;
`;

const Dimmable = styled.div<{ $dimmed: boolean }>`
  opacity: ${({ $dimmed }) => ($dimmed ? 0.5 : 1)};
  transition: opacity 0.2s ease;
`;

const spin = keyframes`to { transform: rotate(360deg); }`;

const Spinner = styled.div`
  position: sticky;
  top: 1rem;
  width: 1.5rem;
  height: 1.5rem;
  border: 2px solid currentColor;
  border-top-color: transparent;
  border-radius: 50%;
  animation: ${spin} 0.6s linear infinite;
`;
