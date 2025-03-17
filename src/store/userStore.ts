import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { useSorting } from "../composables/useSorting";
import { usePagination } from "../composables/usePagination";
import type { User } from "../types/User";
import {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  getRoles,
} from "../api/mockApi";

export const useUserStore = defineStore("user", () => {
  // 🌟 State
  const users = ref<User[]>([]);
  const totalUsers = ref(0);
  const roles = ref<string[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  const searchQuery = ref("");
  const selectedRole = ref("");
  const selectedStatus = ref("");

  // 🌟 Sorting (Using Composable)
  const { sortBy, sortOrder } = useSorting();

  // 🌟 Pagination (Using Composable)
  const { currentPage, pageSize, totalPages, updateTotalItems } =
    usePagination();

  // 🌟 API Calls
  // 🔹 Fetch users with filtering, sorting & pagination
  async function loadUsers() {
    loading.value = true;
    error.value = null;
    try {
      const response = await getUsers(
        searchQuery.value,
        selectedRole.value,
        selectedStatus.value,
        currentPage.value,
        pageSize.value,
        sortBy.value,
        sortOrder.value
      );
      users.value = response.users;
      updateTotalItems(response.total);
    } catch (err) {
      error.value = "Failed to load users";
    } finally {
      loading.value = false;
    }
  }

  // 🔹 Fetch available roles
  async function loadRoles() {
    loading.value = true;
    try {
      roles.value = await getRoles();
    } catch (err) {
      error.value = "Failed to load roles";
    } finally {
      loading.value = false;
    }
  }

  //  Fetch a user by ID
  async function fetchUserById(id: number) {
    loading.value = true;
    try {
      return await getUserById(id);
    } catch (err) {
      error.value = "Failed to fetch user details";
      return null;
    } finally {
      loading.value = false;
    }
  }

  //  Create a new user
  async function addUser(newUser: Partial<User>) {
    loading.value = true;
    try {
      const createdUser = await createUser(newUser);
      users.value.unshift(createdUser); // Optimistic UI update
    } catch (err) {
      error.value = "Failed to add user";
    } finally {
      loading.value = false;
    }
  }

  //  Optimistic update for user edit
  async function editUser(id: number, updatedData: Partial<User>) {
    const index = users.value.findIndex((user) => user.id === id);
    if (index === -1) return;

    const oldUser = { ...users.value[index] }; // Backup
    users.value[index] = { ...users.value[index], ...updatedData }; // Optimistic update

    try {
      await updateUser(id, updatedData);
    } catch (err) {
      users.value[index] = oldUser; // Rollback on failure
      error.value = "Failed to update user";
    }
  }

  //  Optimistic delete user
  async function removeUser(id: number) {
    const index = users.value.findIndex((user) => user.id === id);
    if (index === -1) return;

    const deletedUser = users.value[index]; // Backup
    users.value.splice(index, 1); // Optimistic removal

    try {
      await deleteUser(id);
    } catch (err) {
      users.value.splice(index, 0, deletedUser); // Rollback on failure
      error.value = "Failed to delete user";
    }
  }

  //  Update sorting preference & reload users
  function updateSorting(field: keyof User) {
    if (sortBy.value === field) {
      sortOrder.value = sortOrder.value === "asc" ? "desc" : "asc";
    } else {
      sortBy.value = field;
      sortOrder.value = "asc";
    }
    loadUsers();
  }

  //  Set the current page and reload users
  function setPage(page: number) {
    if (page > 0 && page <= totalPages.value) {
      currentPage.value = page;
      loadUsers();
    }
  }

  return {
    users,
    roles,
    loading,
    error,
    searchQuery,
    selectedRole,
    selectedStatus,
    currentPage,
    pageSize,
    totalPages,
    sortBy,
    sortOrder,
    setPage,
    loadUsers,
    loadRoles,
    fetchUserById,
    addUser,
    editUser,
    removeUser,
    updateSorting,
  };
});
