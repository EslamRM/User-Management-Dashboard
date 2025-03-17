import { ref } from "vue";
import type { User } from "../types/User";

export function useSorting(
  defaultField: keyof User = "name",
  defaultOrder: "asc" | "desc" = "asc"
) {
  const sortBy = ref<keyof User>(defaultField);
  const sortOrder = ref<"asc" | "desc">(defaultOrder);

  function updateSorting(field: keyof User) {
    if (sortBy.value === field) {
      sortOrder.value = sortOrder.value === "asc" ? "desc" : "asc";
    } else {
      sortBy.value = field;
      sortOrder.value = "asc";
    }
  }

  return {
    sortBy,
    sortOrder,
    updateSorting,
  };
}
