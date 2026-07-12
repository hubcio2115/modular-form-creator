import { useForm } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import { z } from "zod/mini";
import styled from "styled-components";
import { Check } from "lucide-react";
import { Button, CheckboxGroup, Input, Select } from "@components/design-system";
import type { SelectOption } from "@components/design-system";
import { Spinner } from "@components/Spinner";
import { queryClient } from "@lib/query-client";
import { resourceMutationOptions } from "~/lib/resource/resource.mutations";
import { resourceQueryOptions } from "~/lib/resource/resource.queries";
import { projectDetailsSchema, type Resource } from "~/lib/resource/resource";
import { Placeholder, Section, SectionTitle } from "../components/ResourceLayout";
import { useResource } from "../useResource";
import { useJustSaved } from "@lib/hooks/useJustSaved";

const categoryOptions: SelectOption[] = [
  { value: "", label: "Select category" },
  { value: "internal", label: "Internal" },
  { value: "external", label: "External" },
  { value: "vendor", label: "Vendor" },
];

// NOTE: There's no way of fetching member options from backend. Preferably there shuold be a GET /resources/project-details/member-options
// or something similar. Since I can't change the BE code this has to be hard coded here.
const teamMemberOptions = ["FE devs", "BE devs", "Designer", "Data Eng", "Product Owner"];

const p = projectDetailsSchema.shape;
const projectDetailsFormSchema = z.object({
  projectName: p.projectName.check(
    z.trim(),
    z.minLength(1, "Project name is required"),
    z.maxLength(255, "Project name must be at most 255 characters"),
    z.regex(/^[\p{L}0-9 -]+$/u, "Project name can contain only letters, numbers, spaces, and hyphens"),
  ),
  budget: p.budget.check(
    z.trim(),
    z.minLength(1, "Budget is required"),
    z.regex(/^\d+$/, "Budget must contain only integers"),
  ),
  category: p.category,
  options: p.options.check(z.minLength(1, "At least one team member is required")),
});

export default function ProjectDetailsPage() {
  const resource = useResource();

  const isDraft = resource.status === "draft";

  const [justSaved, markSaved] = useJustSaved();

  const { mutateAsync: patchProjectDetails } = useMutation({
    ...resourceMutationOptions.patchProjectDetails(),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [resourceQueryOptions.all] }),
  });

  const { mutateAsync: replaceResource } = useMutation({
    ...resourceMutationOptions.replace(),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [resourceQueryOptions.all] }),
  });

  const form = useForm({
    defaultValues: {
      projectName: resource.projectDetails.projectName,
      budget: resource.projectDetails.budget,
      category: resource.projectDetails.category,
      options: resource.projectDetails.options,
    },
    validators: { onSubmit: projectDetailsFormSchema },
    onSubmit: async ({ value }) => {
      const nextProjectDetails: Resource["projectDetails"] = {
        projectName: value.projectName.trim(),
        budget: value.budget.trim(),
        category: value.category,
        options: value.options,
      };

      if (isDraft) {
        await patchProjectDetails({ resourceId: resource.resourceId, projectDetails: nextProjectDetails });
      } else {
        await replaceResource({ ...resource, projectDetails: nextProjectDetails });
      }

      form.reset(value);
      markSaved();
    },
  });

  return (
    <Section>
      <SectionTitle>Project details</SectionTitle>

      {!isDraft && (
        <Placeholder>
          This resource is completed. Changes are kept locally until you submit and are lost on refresh.
        </Placeholder>
      )}

      <Form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          void form.handleSubmit();
        }}
      >
        <form.Field name="projectName">
          {(field) => (
            <Input
              label="Project name"
              name={field.name}
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
              error={field.state.meta.isTouched ? field.state.meta.errors[0]?.message : undefined}
            />
          )}
        </form.Field>

        <form.Field name="budget">
          {(field) => (
            <Input
              label="Budget"
              inputMode="numeric"
              name={field.name}
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
              error={field.state.meta.isTouched ? field.state.meta.errors[0]?.message : undefined}
            />
          )}
        </form.Field>

        <form.Field name="category">
          {(field) => (
            <Select
              label="Category"
              name={field.name}
              options={categoryOptions}
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value as Resource["projectDetails"]["category"])}
              error={field.state.meta.isTouched ? field.state.meta.errors[0]?.message : undefined}
            />
          )}
        </form.Field>

        <form.Field name="options">
          {(field) => (
            <CheckboxGroup
              label="Team members"
              options={teamMemberOptions}
              value={field.state.value}
              onChange={(next) => field.handleChange(next)}
              error={field.state.meta.isTouched ? field.state.meta.errors[0]?.message : undefined}
            />
          )}
        </form.Field>

        <form.Subscribe selector={(state) => [state.canSubmit, state.isSubmitting, state.isDirty] as const}>
          {([canSubmit, isSubmitting, isDirty]) => (
            <Button type="submit" fullWidth disabled={!canSubmit || !isDirty || justSaved}>
              {(() => {
                switch (true) {
                  case isSubmitting:
                    return (
                      <>
                        Saving... <ButtonSpinner />
                      </>
                    );

                  case justSaved:
                    return (
                      <>
                        Saved <CheckIcon />
                      </>
                    );

                  case isDraft:
                    return "Save project details";

                  default:
                    return "Submit chagnes";
                }
              })()}
            </Button>
          )}
        </form.Subscribe>
      </Form>
    </Section>
  );
}

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
`;

const ButtonSpinner = styled(Spinner)`
  width: 1rem;
  height: 1rem;
`;

const CheckIcon = styled(Check)`
  width: 1rem;
  height: 1rem;
`;
