import { useSuspenseQuery } from "@tanstack/react-query";
import { useLocation, useNavigate, useParams } from "react-router";
import styled from "styled-components";
import { Suspense, type PropsWithChildren } from "react";
import { Badge, Card, IconButton } from "@components/design-system";
import { Skeleton } from "@components/Skeleton";
import { resourceQueryOptions } from "~/lib/resource/resource.queries";
import { ChevronLeft } from "lucide-react";
import type { Resource } from "~/lib/resource/resource";
import { formatDate } from "@lib/formatDate";
import { formatCurrency } from "@lib/formatCurrency";
import type { BadgeVariant } from "@components/design-system";

const priorityVariant: Record<Exclude<Resource["basicInfo"]["priority"], "">, BadgeVariant> = {
  low: "neutral",
  medium: "info",
  high: "warning",
};

function BackButton() {
  const navigate = useNavigate();
  const location = useLocation();

  // `location.key` is "default" only for the very first entry in the history
  // stack, i.e. when the user landed here directly without navigating in-app.
  const canGoBack = location.key !== "default";

  function handleClick() {
    if (canGoBack) {
      navigate(-1);
    } else {
      navigate("/");
    }
  }

  return (
    <IconButton variant="ghost" aria-label="Go back" onClick={handleClick}>
      <ChevronLeft />
    </IconButton>
  );
}

export default function ResourceDetailsPage() {
  const { resourceId } = useParams();

  return (
    <Page>
      <Suspense fallback={<ResourceDetailsSkeleton />}>
        <ResourceDetails resourceId={+resourceId!} />
      </Suspense>
    </Page>
  );
}

function ResourceDetails({ resourceId }: Pick<Resource, "resourceId">) {
  const { data: resource } = useSuspenseQuery(resourceQueryOptions.getById(resourceId));
  const { basicInfo, projectDetails } = resource;

  return (
    <DetailsCard>
      <Header>
        <BackButton />

        <Heading>{resource.name}</Heading>

        <Badge variant={resource.status === "completed" ? "success" : "info"}>{resource.status}</Badge>
      </Header>

      <Section>
        <SectionTitle>Basic info</SectionTitle>

        <Fields>
          <Field label="Owner">{basicInfo.owner}</Field>

          <Field label="Email">{basicInfo.email}</Field>

          <Field label="Priority">
            {basicInfo.priority ? (
              <Badge variant={priorityVariant[basicInfo.priority]}>{basicInfo.priority}</Badge>
            ) : (
              "-"
            )}
          </Field>

          <Field label="Description">{basicInfo.description}</Field>
        </Fields>
      </Section>

      <Section>
        <SectionTitle>Project details</SectionTitle>

        <Fields>
          <Field label="Project name">{projectDetails.projectName}</Field>

          <Field label="Budget">{formatCurrency(projectDetails.budget)}</Field>

          <Field label="Category">{projectDetails.category}</Field>

          <Field label="Options">
            {projectDetails.options.length > 0 ? (
              <Options>
                {projectDetails.options.map((option) => (
                  <Badge key={option} variant="info">
                    {option}
                  </Badge>
                ))}
              </Options>
            ) : (
              "-"
            )}
          </Field>
        </Fields>
      </Section>

      <Section>
        <SectionTitle>Metadata</SectionTitle>
        <Fields>
          <Field label="Resource ID">{resource.resourceId}</Field>

          <Field label="Created">{formatDate(resource.createdAt)}</Field>

          <Field label="Updated">{formatDate(resource.updatedAt)}</Field>
        </Fields>
      </Section>
    </DetailsCard>
  );
}

const skeletonSections = [
  { title: "Basic info", fields: ["Owner", "Email", "Priority", "Description"] },
  { title: "Project details", fields: ["Project name", "Budget", "Category", "Options"] },
  { title: "Metadata", fields: ["Resource ID", "Created", "Updated"] },
];

function ResourceDetailsSkeleton() {
  return (
    <DetailsCard aria-busy="true" aria-live="polite" style={{ width: "640px", height: "496px" }}>
      <Header>
        <BackButton />

        <Heading>
          <Skeleton $height="1.5rem" $width="60%" />
        </Heading>

        <BadgeSkeleton $height="1.5rem" $width="3rem" />
      </Header>

      {skeletonSections.map((section) => (
        <Section key={section.title}>
          <SectionTitle>{section.title}</SectionTitle>

          <Fields>
            {section.fields.map((label) => (
              <Field key={label} label={label}>
                <Skeleton $width="70%" />
              </Field>
            ))}
          </Fields>
        </Section>
      ))}
    </DetailsCard>
  );
}

interface FieldProps extends PropsWithChildren {
  label: string;
}

function Field({ label, children }: FieldProps) {
  return (
    <FieldRow>
      <FieldLabel>{label}</FieldLabel>

      <FieldValue>{children}</FieldValue>
    </FieldRow>
  );
}

const Page = styled.div`
  min-height: 100vh;
  display: flex;
  justify-content: center;
  padding: ${({ theme }) => `${theme.spacing.xl} ${theme.spacing.md}`};
`;

const DetailsCard = styled(Card)`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg};
  width: 100%;
  max-width: 640px;
  height: max-content;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
`;

const Heading = styled.h1`
  flex: 1;
  min-width: 0;
  margin: 0;
  font-family: ${({ theme }) => theme.typography.heading};
  font-size: 1.5rem;
  color: ${({ theme }) => theme.colors.inkStrong};
  word-break: break-word;
`;

const Section = styled.section`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const SectionTitle = styled.h2`
  margin: 0;
  font-family: ${({ theme }) => theme.typography.heading};
  font-size: 0.875rem;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: ${({ theme }) => theme.colors.inkMuted};
`;

const Fields = styled.dl`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
  margin: 0;
`;

const FieldRow = styled.div`
  display: grid;
  grid-template-columns: 140px 1fr;
  gap: ${({ theme }) => theme.spacing.md};

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
    gap: ${({ theme }) => theme.spacing.xs};
  }
`;

const FieldLabel = styled.dt`
  color: ${({ theme }) => theme.colors.inkMuted};
`;

const FieldValue = styled.dd`
  margin: 0;
  color: ${({ theme }) => theme.colors.ink};
  word-break: break-word;
`;

const Options = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.xs};
`;

const BadgeSkeleton = styled(Skeleton)`
  border-radius: ${({ theme }) => theme.radii.pill};
`;
