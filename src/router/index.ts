import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "../store/authStore";
import Login from "../views/Login.vue";
import UserListView from "../views/UserListView.vue";
import UserDetailView from "../views/UserDetailView.vue";
import NotFound from "../views/NotFound.vue";


const routes = [
  { path: "/login", component: Login },
  {
    path: "/users",
    component: UserListView,
    meta: { requiresAuth: true, roles: ["Admin", "Manager"] },
  },
  {
    path: "/users/:id",
    component: UserDetailView,
    meta: { requiresAuth: true, roles: ["Admin", "Manager", "Viewer"] },
  },
  { path: "/:pathMatch(.*)*", component: NotFound },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

Navigation Guards
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next("/login");
  } else if (
    to.meta.roles &&
    Array.isArray(to.meta.roles) &&
    !to.meta.roles.includes(authStore.user?.role)
  ) {
    next("/users"); // Redirect unauthorized users
  } else {
    next();
  }
});

export default router;
