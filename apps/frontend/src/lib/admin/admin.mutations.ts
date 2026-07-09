import { mutationOptions } from "@tanstack/react-query";
import { $fetch } from "../$fetch";

export const adminMutationOptions = {
  all: "admin",

  dumpDatabase: () =>
    mutationOptions({
      mutationFn: () => {
        return $fetch("/api/admin/database", {
          method: "DELETE",
        });
      },
    }),
};
