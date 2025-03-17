import { describe, it, expect, beforeEach, vi, afterEach } from "vitest";
import { mount, flushPromises } from "@vue/test-utils";
import { createTestingPinia } from "@pinia/testing";
import UserDetail from "../../components/UserDetails.vue"; // Adjust the path to your actual component
import { useAuthStore } from "../../store/authStore";
import { useUserStore } from "../../store/userStore";
import { nextTick } from "vue";

// Mock vue-router modules at the top level
const mockRouter = {
  push: vi.fn(),
};

const mockRoute = {
  params: { id: "123" },
};

// Mock the entire vue-router module
vi.mock("vue-router", () => ({
  useRoute: () => mockRoute,
  useRouter: () => mockRouter,
}));

describe("UserDetail Component", () => {
  let wrapper;
  let authStore;
  let userStore;

  const mockUser = {
    id: 123,
    name: "Test User",
    email: "test@example.com",
    role: "Manager",
    status: "Active",
    dateJoined: "2023-01-01T00:00:00.000Z",
  };

  beforeEach(() => {
    // Reset mocks
    vi.clearAllMocks();

    // Create a fresh pinia instance for each test
    const pinia = createTestingPinia({
      createSpy: vi.fn,
      stubActions: false,
    });

    // Create the stores
    authStore = useAuthStore(pinia);
    userStore = useUserStore(pinia);

    // Mock the fetchUserById method
    userStore.fetchUserById = vi.fn().mockResolvedValue(mockUser);

    // Set up the component
    wrapper = mount(UserDetail, {
      global: {
        plugins: [pinia],
        stubs: {
          BaseInput: true,
          BaseSelect: true,
          Dialog: true,
          Loading: true,
        },
      },
    });
  });

  afterEach(() => {
    if (wrapper) {
      wrapper.unmount();
    }
  });

  it("should fetch and display user details on mount", async () => {
    // Wait for the component to finish mounting and data to be fetched
    await flushPromises();

    // Check if the fetchUserById was called
    expect(userStore.fetchUserById).toHaveBeenCalledWith(123);

    // Check if user details are displayed
    expect(wrapper.text()).toContain("Test User");
    expect(wrapper.text()).toContain("test@example.com");
    expect(wrapper.text()).toContain("Manager");
    expect(wrapper.text()).toContain("Active");
  });


  it("should not show edit button for viewers", async () => {
    // Set authStore.isViewer to true
    authStore.isViewer = true;

    await flushPromises();

    // Check if the edit button is not present
    const editButton = wrapper.find("button:not(.danger)");
    expect(editButton.exists()).toBe(false);
  });

  it("should show edit button for non-viewers", async () => {
    // Set authStore.isViewer to false
    authStore.isViewer = false;

    await flushPromises();

    // Check if the edit button is present
    const editButton = wrapper.find("button:not(.danger)");
    expect(editButton.exists()).toBe(true);
    expect(editButton.text()).toContain("Edit");
  });

  it("should show delete button only for admins", async () => {
    // Test when user is not admin
    authStore.isAdmin = false;
    await flushPromises();

    // Check if delete button is not present
    let deleteButton = wrapper.find("button.danger");
    expect(deleteButton.exists()).toBe(false);

    // Test when user is admin
    authStore.isAdmin = true;
    await nextTick();

    // Check if delete button is present
    deleteButton = wrapper.find("button.danger");
    expect(deleteButton.exists()).toBe(true);
    expect(deleteButton.text()).toContain("Delete");
  });

  it("should toggle edit mode when edit button is clicked", async () => {
    // Make sure edit button is visible
    authStore.isViewer = false;
    await flushPromises();

    // Initially not in edit mode
    expect(wrapper.findAllComponents({ name: "BaseInput" }).length).toBe(0);

    // Click edit button
    const editButton = wrapper.find("button:not(.danger)");
    await editButton.trigger("click");

    // Now it should be in edit mode - look for any BaseInput components
    expect(
      wrapper.findAllComponents({ name: "BaseInput" }).length
    ).toBeGreaterThan(0);
    expect(editButton.text()).toContain("Cancel");

    // Click cancel button
    await editButton.trigger("click");

    // Back to view mode
    expect(wrapper.findAllComponents({ name: "BaseInput" }).length).toBe(0);
    expect(editButton.text()).toContain("Edit");
  });

  it("should save changes when save button is clicked", async () => {
    // Setup
    authStore.isViewer = false;
    userStore.editUser = vi.fn().mockResolvedValue(mockUser);

    await flushPromises();

    // Enter edit mode
    const editButton = wrapper.find("button:not(.danger)");
    await editButton.trigger("click");

    // Find save button and click it
    const saveButton = wrapper.find("button:nth-child(2)");
    expect(saveButton.text()).toContain("Save");
    await saveButton.trigger("click");

    // Check if editUser was called
    expect(userStore.editUser).toHaveBeenCalledWith(
      123,
      expect.objectContaining({
        id: 123,
        name: "Test User",
        email: "test@example.com",
      })
    );

    // Should be back in view mode
    await flushPromises();
    expect(wrapper.findAllComponents({ name: "BaseInput" }).length).toBe(0);
  });

  it("should show error message when save fails", async () => {
    // Setup
    authStore.isViewer = false;
    userStore.editUser = vi.fn().mockRejectedValue(new Error("Update failed"));

    await flushPromises();

    // Enter edit mode
    const editButton = wrapper.find("button:not(.danger)");
    await editButton.trigger("click");

    // Find save button and click it
    const saveButton = wrapper.find("button:nth-child(2)");
    await saveButton.trigger("click");

    // Check if error message is displayed
    await flushPromises();
    expect(wrapper.find(".error-message").exists()).toBe(true);
    expect(wrapper.find(".error-message").text()).toContain(
      "Failed to update user"
    );
  });

  it("should validate required fields before saving", async () => {
    // Setup
    authStore.isViewer = false;
    userStore.editUser = vi.fn().mockResolvedValue(mockUser);

    await flushPromises();

    // Enter edit mode
    const editButton = wrapper.find("button:not(.danger)");
    await editButton.trigger("click");

    // Set the reactive user object properties directly
    wrapper.vm.user.name = "";
    wrapper.vm.user.email = "";
    await nextTick();

    // Find save button and click it
    const saveButton = wrapper.find("button:nth-child(2)");
    await saveButton.trigger("click");

    // Check if error message is displayed
    expect(wrapper.find(".error-message").exists()).toBe(true);
    expect(wrapper.find(".error-message").text()).toContain(
      "Name and email cannot be empty"
    );

    // Check that editUser was not called
    expect(userStore.editUser).not.toHaveBeenCalled();
  });

  it("should show confirm dialog when delete button is clicked", async () => {
    // Setup
    authStore.isAdmin = true;
    await flushPromises();

    // Initially dialog should not be visible
    expect(wrapper.findComponent({ name: "Dialog" }).exists()).toBe(false);

    // Click delete button
    const deleteButton = wrapper.find("button.danger");
    await deleteButton.trigger("click");

    // Now dialog should be visible
    expect(wrapper.findComponent({ name: "Dialog" }).exists()).toBe(true);
  });

  it("should delete user and redirect when confirmed", async () => {
    // Setup
    authStore.isAdmin = true;
    userStore.removeUser = vi.fn().mockResolvedValue(undefined);

    await flushPromises();

    // Show confirm dialog
    const deleteButton = wrapper.find("button.danger");
    await deleteButton.trigger("click");

    // Manually call deleteUser method
    await wrapper.vm.deleteUser();

    // Check if removeUser was called
    expect(userStore.removeUser).toHaveBeenCalledWith(123);

    // Wait for the delete to complete
    await flushPromises();

    // Check if router.push was called to redirect
    expect(mockRouter.push).toHaveBeenCalledWith("/users");
  });

  it("should show error message when delete fails", async () => {
    // Setup
    authStore.isAdmin = true;
    userStore.removeUser = vi
      .fn()
      .mockRejectedValue(new Error("Delete failed"));

    await flushPromises();

    // Show confirm dialog
    const deleteButton = wrapper.find("button.danger");
    await deleteButton.trigger("click");

    // Manually call deleteUser method
    await wrapper.vm.deleteUser();

    // Wait for the delete to fail
    await flushPromises();

    // Check if error message is displayed
    expect(wrapper.find(".error-message").exists()).toBe(true);
    expect(wrapper.find(".error-message").text()).toContain(
      "Failed to delete user"
    );
  });
});
