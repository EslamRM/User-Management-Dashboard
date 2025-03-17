import { describe, it, expect } from "vitest";
import { usePagination } from "../../composables/usePagination";

describe("usePagination", () => {
  it("initializes with default values", () => {
    const pagination = usePagination();

    expect(pagination.currentPage.value).toBe(1);
    expect(pagination.pageSize.value).toBe(10);
    expect(pagination.totalUsers.value).toBe(0);
    expect(pagination.totalPages.value).toBe(0);
  });

  it("calculates total pages correctly", () => {
    const pagination = usePagination(100, 10); // 100 items, 10 per page

    expect(pagination.totalPages.value).toBe(10);
  });

  it("updates total items correctly", () => {
    const pagination = usePagination(50, 10);
    expect(pagination.totalPages.value).toBe(5);

    pagination.updateTotalItems(120);
    expect(pagination.totalPages.value).toBe(12);
  });

  it("sets current page correctly", () => {
    const pagination = usePagination(100, 10);

    pagination.setPage(5);
    expect(pagination.currentPage.value).toBe(5);

    pagination.setPage(15); // Out of range
    expect(pagination.currentPage.value).toBe(5); // Should not change

    pagination.setPage(0); // Invalid page
    expect(pagination.currentPage.value).toBe(5); // Should not change
  });
});
