import { useForm } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import { z } from "zod";
import styled from "styled-components";
import { Button, Input } from "@components/design-system";
import { Spinner } from "@components/Spinner";
import { queryClient } from "@lib/query-client";
import { resourceMutationOptions } from "./resource.mutations";
import { resourceQueryOptions } from "./resource.queries";

const createResourceSchema = z.object({
  resourceName: z.string().trim().min(1, "Resource name is required"),
});

interface CreateResourceFormProps {
  onSuccess?: () => void;
}

export default function CreateResourceForm({ onSuccess }: CreateResourceFormProps) {
  const { mutateAsync } = useMutation({
    ...resourceMutationOptions.create(),
    onSuccess: () => {
      return queryClient.invalidateQueries({ queryKey: [resourceQueryOptions.all] });
    },
  });

  const form = useForm({
    defaultValues: { resourceName: "" },
    validators: { onChange: createResourceSchema },
    onSubmit: async ({ value }) => {
      await mutateAsync(value.resourceName.trim());
      form.reset();
      onSuccess?.();
    },
  });

  return (
    <FormLayout
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        void form.handleSubmit();
      }}
    >
      <form.Field name="resourceName">
        {(field) => (
          <Input
            label="Resource name"
            name={field.name}
            value={field.state.value}
            onBlur={field.handleBlur}
            onChange={(e) => field.handleChange(e.target.value)}
            error={field.state.meta.isTouched ? field.state.meta.errors[0]?.message : undefined}
          />
        )}
      </form.Field>

      <form.Subscribe selector={(state) => [state.canSubmit, state.isSubmitting] as const}>
        {([canSubmit, isSubmitting]) => (
          <Button type="submit" fullWidth disabled={!canSubmit}>
            {isSubmitting ? (
              <>
                Creating... <ButtonSpinner />
              </>
            ) : (
              "Create"
            )}
          </Button>
        )}
      </form.Subscribe>
    </FormLayout>
  );
}

const FormLayout = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  width: 100%;
`;

const ButtonSpinner = styled(Spinner)`
  width: 1rem;
  height: 1rem;
`;
