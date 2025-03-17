import { ref, computed } from "vue";

export function usePagination(totalItems = 0, defaultPageSize = 10) {
  const currentPage = ref(1);
  const pageSize = ref(defaultPageSize);
  const totalUsers = ref(totalItems);

  const totalPages = computed(() =>
    Math.ceil(totalUsers.value / pageSize.value)
  );

  function setPage(page: number) {
    if (page > 0 && page <= totalPages.value) {
      currentPage.value = page;
    }
  }

  function updateTotalItems(count: number) {
    totalUsers.value = count;
  }

  return {
    currentPage,
    pageSize,
    totalPages,
    totalUsers,
    setPage,
    updateTotalItems,
  };
}
