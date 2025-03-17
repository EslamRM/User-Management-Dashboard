import { describe, it, expect } from "vitest";
import { useSorting } from "../../composables/useSorting";

describe("useSorting composable", () => {
  it("should have default sorting by name in ascending order", () => {
    const { sortBy, sortOrder } = useSorting();
    expect(sortBy.value).toBe("name");
    expect(sortOrder.value).toBe("asc");
  });

  it("should update sorting order when called with the same field", () => {
    const { sortBy, sortOrder, updateSorting } = useSorting();
    updateSorting("name");
    expect(sortBy.value).toBe("name");
    expect(sortOrder.value).toBe("desc");
  });

  it("should set sorting order to asc when a new field is provided", () => {
    const { sortBy, sortOrder, updateSorting } = useSorting();
    updateSorting("email");
    expect(sortBy.value).toBe("email");
    expect(sortOrder.value).toBe("asc");
  });
});
