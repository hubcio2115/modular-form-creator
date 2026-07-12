import { useForm } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import { z } from "zod/mini";
import styled from "styled-components";
import { Check } from "lucide-react";
import { Button, Input, Select } from "@components/design-system";
import type { SelectOption } from "@components/design-system";
import { Spinner } from "@components/Spinner";
import { queryClient } from "@lib/query-client";
import { resourceMutationOptions } from "~/lib/resource/resource.mutations";
import { resourceQueryOptions } from "~/lib/resource/resource.queries";
import { basicInfoSchema, type Resource } from "~/lib/resource/resource";
import { Placeholder, Section, SectionTitle } from "./components/ResourceLayout";
import { useResource } from "./useResource";
import { useJustSaved } from "@lib/hooks/useJustSaved";

const priorityOptions: SelectOption[] = [
  { value: "", label: "Select priority" },
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
];

const b = basicInfoSchema.shape;
const basicInfoFormSchema = z.object({
  owner: b.owner.check(
    z.trim(),
    z.minLength(1, "Owner is required"),
    z.maxLength(255, "Owner must be at most 255 characters"),
    z.regex(/^[\p{L} ]+$/u, "Owner can contain only letters and spaces"),
  ),
  email: b.email.check(z.trim(), z.minLength(1, "Email is required"), z.email("Enter a valid email address")),
  description: b.description.check(z.trim(), z.minLength(1, "Description is required")),
  priority: b.priority,
});

export default function BasicInfoPage() {
  const resource = useResource();

  const isDraft = resource.status === "draft";

  const [justSaved, markSaved] = useJustSaved();

  const { mutateAsync: patchBasicInfo } = useMutation({
    ...resourceMutationOptions.patchBasicInfo(),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [resourceQueryOptions.all] }),
  });

  const { mutateAsync: replaceResource } = useMutation({
    ...resourceMutationOptions.replace(),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [resourceQueryOptions.all] }),
  });

  const form = useForm({
    defaultValues: {
      owner: resource.basicInfo.owner,
      email: resource.basicInfo.email,
      description: resource.basicInfo.description,
      priority: resource.basicInfo.priority,
    },
    validators: { onSubmit: basicInfoFormSchema },
    onSubmit: async ({ value }) => {
      const nextBasicInfo: Resource["basicInfo"] = {
        resourceName: resource.basicInfo.resourceName,
        owner: value.owner.trim(),
        email: value.email.trim(),
        description: value.description.trim(),
        priority: value.priority,
      };

      if (isDraft) {
        await patchBasicInfo({ resourceId: resource.resourceId, basicInfo: nextBasicInfo });
      } else {
        await replaceResource({ ...resource, basicInfo: nextBasicInfo });
      }

      form.reset(value);
      markSaved();
    },
  });

  return (
    <Section>
      <SectionTitle>Basic info</SectionTitle>

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
        <Input
          label="Resource name"
          tooltip="The resource name is set on creation and cannot be changed."
          value={resource.basicInfo.resourceName || resource.name}
          state="locked"
          readOnly
        />

        <form.Field name="owner">
          {(field) => (
            <Input
              label="Owner"
              name={field.name}
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
              error={field.state.meta.isTouched ? field.state.meta.errors[0]?.message : undefined}
            />
          )}
        </form.Field>

        <form.Field name="email">
          {(field) => (
            <Input
              label="Email"
              type="email"
              name={field.name}
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
              error={field.state.meta.isTouched ? field.state.meta.errors[0]?.message : undefined}
            />
          )}
        </form.Field>

        <form.Field name="priority">
          {(field) => (
            <Select
              label="Priority"
              name={field.name}
              options={priorityOptions}
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value as Resource["basicInfo"]["priority"])}
              error={field.state.meta.isTouched ? field.state.meta.errors[0]?.message : undefined}
            />
          )}
        </form.Field>

        <form.Field name="description">
          {(field) => (
            <Input
              label="Description"
              multiline
              rows={4}
              name={field.name}
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
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
                    return "Save basic info";

                  default:
                    return "Submit changes";
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
