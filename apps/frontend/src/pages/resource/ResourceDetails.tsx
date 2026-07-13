import { Badge } from "@components/design-system";
import type { Resource } from "~/lib/resource/resource";
import { formatDate } from "@lib/formatDate";
import { formatCurrency } from "@lib/formatCurrency";
import type { BadgeVariant } from "@components/design-system";
import { Field } from "./components/ResourceControls";
import { Fields, Options, Section, SectionTitle } from "./components/ResourceLayout";
import { useOutletContext } from "react-router";

const priorityVariant: Record<Exclude<Resource["basicInfo"]["priority"], "">, BadgeVariant> = {
  low: "neutral",
  medium: "info",
  high: "warning",
};

export default function ResourceDetailsPage() {
  const resource = useOutletContext<Resource>();
  const { basicInfo, projectDetails } = resource;

  return (
    <>
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
    </>
  );
}
