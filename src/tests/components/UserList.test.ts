import { describe, it, expect, vi, beforeEach } from "vitest";
import { mount } from "@vue/test-utils";
import UserList from "../../components/UserList.vue";
import { useUserStore } from "../../store/userStore";
import { useAuthStore } from "../../store/authStore";
import { createPinia, setActivePinia } from "pinia";
import { nextTick } from "vue";
import { createRouter, createWebHistory } from "vue-router";

// Mock the child components
vi.mock("@/components/ReusableUi/UserFilters.vue", () => ({
  default: {
    template: '<div class="mock-user-filters"></div>',
  },
}));

vi.mock("@/components/ReusableUi/UserTable.vue", () => ({
  default: {
    template: '<div class="mock-user-table"></div>',
  },
}));

vi.mock("@/components/ReusableUi/Pagination.vue", () => ({
  default: {
    template: '<div class="mock-pagination"></div>',
  },
}));

vi.mock("@/components/ReusableUi/Loading.vue", () => ({
  default: {
    template: '<div class="mock-loading"></div>',
  },
}));

// Mock the router
const router = createRouter({
  history: createWebHistory(),
  routes: [{ path: "/users/:id", component: { template: "<div></div>" } }],
});

describe("UserList.vue", () => {
  let wrapper: any;
  let userStore: any;
  let authStore: any;

  beforeEach(() => {
    setActivePinia(createPinia());
    userStore = useUserStore();
    authStore = useAuthStore();

    // Mock store methods
    userStore.loadUsers = vi.fn();
    userStore.loadRoles = vi.fn();
    userStore.removeUser = vi.fn();
    userStore.setPage = vi.fn();
    userStore.updateSorting = vi.fn();

    // Mock router
    router.push = vi.fn();

    wrapper = mount(UserList, {
      global: {
        plugins: [router],
        mocks: {
          $router: router,
        },
      },
    });
  });

  it("renders the component", () => {
    expect(wrapper.find(".user-list").exists()).toBe(true);
  });

  it("fetches users and roles on mount", () => {
    expect(userStore.loadUsers).toHaveBeenCalled();
    expect(userStore.loadRoles).toHaveBeenCalled();
  });

  it("displays error message when there is an error", async () => {
    userStore.error = "An error occurred";
    await nextTick();
    expect(wrapper.find(".error").text()).toBe("An error occurred");
  });

  it("calls editUser method and navigates to user edit page", async () => {
    const user = {
      id: 1,
      name: "John Doe",
      role: "Manager",
      status: "Active",
      dateJoined: "2023-01-01",
    };
    await wrapper.vm.editUser(user);
    expect(router.push).toHaveBeenCalledWith("/users/1");
  });

  it("calls deleteUser method and removes user", async () => {
    const userId = 1;
    await wrapper.vm.deleteUser(userId);
    expect(userStore.removeUser).toHaveBeenCalledWith(userId);
  });

//   it("checks role-based permissions for edit and delete", async () => {
//     authStore.isAdmin = true;
//     authStore.isManager = true;
//     await nextTick();
//     expect(wrapper.vm.canEditUsers).toBe(true);
//     expect(wrapper.vm.canDeleteUsers).toBe(true);

//     authStore.isAdmin = false;
//     authStore.isManager = true;
//     await nextTick();
//     expect(wrapper.vm.canEditUsers).toBe(true);
//     expect(wrapper.vm.canDeleteUsers).toBe(false);

//     authStore.isAdmin = false;
//     authStore.isManager = false;
//     await nextTick();
//     expect(wrapper.vm.canEditUsers).toBe(false);
//     expect(wrapper.vm.canDeleteUsers).toBe(false);
//   });
});
