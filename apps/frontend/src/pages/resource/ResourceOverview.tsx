import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router";
import styled from "styled-components";
import { ChevronRight, Lock } from "lucide-react";
import { Badge, Button } from "@components/design-system";
import { Spinner } from "@components/Spinner";
import { queryClient } from "@lib/query-client";
import { resourceMutationOptions } from "~/lib/resource/resource.mutations";
import { resourceQueryOptions } from "~/lib/resource/resource.queries";
import { isBasicInfoComplete, isProjectDetailsComplete } from "~/lib/resource/resource";
import { Placeholder, Section, SectionTitle } from "./components/ResourceLayout";
import { useResource } from "./useResource";

export default function ResourceOverviewPage() {
  const resource = useResource();

  const isDraft = resource.status === "draft";

  const basicInfoComplete = isBasicInfoComplete(resource.basicInfo);
  const projectDetailsComplete = isProjectDetailsComplete(resource.projectDetails);

  const projectDetailsLocked = isDraft && !basicInfoComplete;
  const canProvision = isDraft && basicInfoComplete && projectDetailsComplete;

  const navigate = useNavigate();

  const [confirmingDelete, setConfirmingDelete] = useState(false);

  const { mutate: provision, isPending } = useMutation({
    ...resourceMutationOptions.provision(),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [resourceQueryOptions.all] }),
  });

  const { mutate: deleteResource, isPending: isDeleting } = useMutation({
    ...resourceMutationOptions.deleteById(),
    onSuccess: () => {
      navigate("/resources", { replace: true });
      queryClient.removeQueries({ queryKey: resourceQueryOptions.getById(resource.resourceId).queryKey });
      queryClient.invalidateQueries({ queryKey: [resourceQueryOptions.all] });
    },
  });

  return (
    <>
      <Section>
        <SectionTitle>Status</SectionTitle>

        <div>
          <Badge variant={isDraft ? "info" : "success"}>{resource.status}</Badge>
        </div>
      </Section>

      <Section>
        <SectionTitle>Modules</SectionTitle>

        <Modules>
          <ModuleLink to="basic-info">
            <ModuleName>Basic info</ModuleName>

            <ModuleMeta>
              <Badge variant={basicInfoComplete ? "success" : "neutral"}>
                {basicInfoComplete ? "Complete" : "Incomplete"}
              </Badge>
              <ChevronRight size={16} />
            </ModuleMeta>
          </ModuleLink>

          {projectDetailsLocked ? (
            <ModuleLocked aria-disabled title="Complete Basic info first">
              <ModuleName>Project details</ModuleName>

              <ModuleMeta>
                <Badge variant="neutral">Locked</Badge>
                <Lock size={16} />
              </ModuleMeta>
            </ModuleLocked>
          ) : (
            <ModuleLink to="project-details">
              <ModuleName>Project details</ModuleName>

              <ModuleMeta>
                <Badge variant={projectDetailsComplete ? "success" : "neutral"}>
                  {projectDetailsComplete ? "Complete" : "Incomplete"}
                </Badge>
                <ChevronRight size={16} />
              </ModuleMeta>
            </ModuleLink>
          )}
        </Modules>
      </Section>

      <Section>
        <SectionTitle>Actions</SectionTitle>

        {isDraft ? (
          <>
            <Button
              type="button"
              fullWidth
              disabled={!canProvision || isPending}
              onClick={() => provision(resource.resourceId)}
            >
              {isPending ? (
                <>
                  Provisioning... <ButtonSpinner />
                </>
              ) : (
                "Complete resource"
              )}
            </Button>

            {!canProvision && <Placeholder>Complete both modules to provision this resource.</Placeholder>}
          </>
        ) : (
          <Placeholder>This resource has been provisioned and is completed.</Placeholder>
        )}

        {confirmingDelete ? (
          <ConfirmDelete>
            <Placeholder>Delete this resource? This action cannot be undone.</Placeholder>

            <ConfirmActions>
              <Button variant="secondary" onClick={() => setConfirmingDelete(false)} disabled={isDeleting}>
                Cancel
              </Button>

              <Button variant="secondary" onClick={() => deleteResource(resource.resourceId)} disabled={isDeleting}>
                {isDeleting ? (
                  <>
                    Deleting... <ButtonSpinner />
                  </>
                ) : (
                  "Delete"
                )}
              </Button>
            </ConfirmActions>
          </ConfirmDelete>
        ) : (
          <Button variant="secondary" onClick={() => setConfirmingDelete(true)}>
            Delete resource
          </Button>
        )}
      </Section>
    </>
  );
}

const Modules = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
`;

const moduleRow = `
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
`;

const ModuleLink = styled(Link)`
  ${moduleRow}
  padding: ${({ theme }) => theme.spacing.sm};
  text-decoration: none;
  color: ${({ theme }) => theme.colors.ink};

  &:hover {
    background: ${({ theme }) => theme.colors.surfaceAlt};
  }
`;

const ModuleLocked = styled.div`
  ${moduleRow}
  padding: ${({ theme }) => theme.spacing.sm};
  color: ${({ theme }) => theme.colors.inkMuted};
  cursor: not-allowed;
`;

const ModuleName = styled.span`
  font-weight: 600;
`;

const ModuleMeta = styled.span`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  color: ${({ theme }) => theme.colors.inkMuted};
`;

const ButtonSpinner = styled(Spinner)`
  width: 1rem;
  height: 1rem;
`;

const ConfirmDelete = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const ConfirmActions = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};

  & > * {
    flex: 1;
  }
`;
