import { defineStore } from "pinia";
import { ref, computed, watch } from "vue";
import { useRouter } from "vue-router";
import type { User } from "../types/User";

export const useAuthStore = defineStore("auth", () => {
  const router = useRouter();
  const user = ref<User | null>(null);
  const token = ref<string | null>(null);
  const sessionExpiry = ref<number | null>(null);

  let logoutTimer: ReturnType<typeof setTimeout>;

  // Start session timer with auto logout
  const startSessionTimer = () => {
    if (!sessionExpiry.value) return;

    const remainingTime = sessionExpiry.value - Date.now();
    if (remainingTime <= 0) {
      logout();
      return;
    }

    clearTimeout(logoutTimer);
    logoutTimer = setTimeout(() => {
      logout();
      alert("Session expired. Please log in again.");
    }, remainingTime);
  };

  // Save session to localStorage
  const saveSession = () => {
    localStorage.setItem("user", JSON.stringify(user.value));
    localStorage.setItem("token", token.value || "");
    localStorage.setItem(
      "sessionExpiry",
      sessionExpiry.value?.toString() || ""
    );
  };

  // Restore session from localStorage
  const restoreSession = () => {
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token");
    const storedExpiry = localStorage.getItem("sessionExpiry");

    if (storedUser && storedToken && storedExpiry) {
      user.value = JSON.parse(storedUser);
      token.value = storedToken;
      sessionExpiry.value = parseInt(storedExpiry, 10);

      startSessionTimer(); // Restart session countdown
    }
  };

  // Login function (mock)
  const login = async (email: string, password: string) => {
    const users: {
      id: number;
      name: string;
      email: string;
      role: "Admin" | "Manager" | "Viewer";
    }[] = [
      { id: 1, name: "Admin User", email: "admin@example.com", role: "Admin" },
      {
        id: 2,
        name: "Manager User",
        email: "manager@example.com",
        role: "Manager",
      },
      {
        id: 3,
        name: "Viewer User",
        email: "viewer@example.com",
        role: "Viewer",
      },
    ];

    const validUser = users.find((u) => u.email === email);

    if (validUser && password === "password") {
      user.value = {
        id: validUser.id,
        name: validUser.name,
        email: validUser.email,
        status: "Active" as const, // Ensuring "Active" matches the expected type
        dateJoined: new Date().toISOString(),
        role: validUser.role as "Admin" | "Manager" | "Viewer", // Explicit type assertion
      };

      token.value = "mock_token_123"; // Normally, you'd get a JWT from an API
      sessionExpiry.value = Date.now() + 30 * 60 * 1000; // 30 min expiry

      saveSession();
      startSessionTimer();
      router.push("/users");
    } else {
      throw new Error("Invalid credentials");
    }
  };

  // Logout function
  const logout = () => {
    user.value = null;
    token.value = null;
    sessionExpiry.value = null;

    clearTimeout(logoutTimer);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    localStorage.removeItem("sessionExpiry");

    router.push("/login");
  };

  // Check authentication state
  const isAuthenticated = computed(
    () =>
      !!user.value &&
      !!token.value &&
      sessionExpiry.value &&
      sessionExpiry.value > Date.now()
  );

  // Role-based permissions
  const isAdmin = computed(() => user.value?.role === "Admin");
  const isManager = computed(() => user.value?.role === "Manager");
  const isViewer = computed(() => user.value?.role === "Viewer");

  // Auto restore session on store creation
  restoreSession();

  // Watch for authentication changes & update localStorage
  watch([user, token, sessionExpiry], saveSession, { deep: true });

  return {
    user,
    token,
    login,
    logout,
    restoreSession,
    isAuthenticated,
    isAdmin,
    isManager,
    isViewer,
  };
});
