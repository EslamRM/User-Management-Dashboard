<template>
  <div class="app-container">
    <header class="app-header">
      <div class="logo">
        <h1>{{ $t("title") }}</h1>
      </div>
      <div class="header-actions">
        <button class="theme-toggle" @click="toggleTheme">
          <span v-if="isDark">☀️</span>
          <span v-else>🌙</span>
        </button>
        <div class="lang-switcher">
          <button
            @click="changeLanguage('en')"
            :class="{ active: locale === 'en' }"
          >
            EN
          </button>
          <button
            @click="changeLanguage('ar')"
            :class="{ active: locale === 'ar' }"
          >
            AR
          </button>
        </div>
        <div class="user-menu" v-if="authStore.user">
          <span>{{ authStore.user?.name }}</span>
          <button @click="logout">{{ $t("logout") }}</button>
        </div>
        <div class="user-menu" v-else>
          <button @click="router.push('/login')">{{ $t("login") }}</button>
        </div>
      </div>
    </header>

    <div class="app-content">
      <main class="main-content">
        <router-view></router-view>
      </main>
    </div>

    <footer class="app-footer">
      <p>&copy; 2025 Dashboard App</p>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { useI18n } from "vue-i18n";
import { useAuthStore } from "./store/authStore";
import { useRouter } from "vue-router";
import { useTheme } from "./composables/useTheme";

const { locale } = useI18n();
const authStore = useAuthStore();
const router = useRouter();
const { isDark, toggleTheme, initTheme } = useTheme();

onMounted(() => {
  initTheme();
});

const changeLanguage = (lang: string) => {
  locale.value = lang;
};

const logout = () => {
  authStore.logout();
  router.push("/login");
};
</script>

<style>
@import "./assets/theme.css";

.app-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.app-header {
  background-color: var(--header-background);
  padding: 16px 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.logo {
  display: flex;
  align-items: center;
  gap: 12px;
}

.logo img {
  height: 32px;
}

.header-actions {
  display: flex;
  gap: 16px;
  align-items: center;
}

.theme-toggle {
  background: transparent;
  border: none;
  font-size: 1.2rem;
  padding: 4px 8px;
  cursor: pointer;
}

.lang-switcher {
  display: flex;
  gap: 4px;
}

.lang-switcher button {
  padding: 4px 8px;
  background-color: transparent;
  border: 1px solid var(--border-color);
  color: var(--text-color);
}

.lang-switcher button.active {
  background-color: var(--primary-color);
  color: white;
}

.user-menu {
  display: flex;
  align-items: center;
  gap: 8px;
}

.app-content {
  display: flex;
  flex: 1;
}

.sidebar {
  width: 200px;
  background-color: var(--card-background);
  padding: 16px 0;
  display: flex;
  flex-direction: column;
}

.sidebar a {
  padding: 12px 16px;
  color: var(--text-color);
  text-decoration: none;
  transition: background-color 0.3s;
}

.sidebar a:hover,
.sidebar a.router-link-active {
  background-color: var(--primary-color);
  color: white;
}

.main-content {
  flex: 1;
  padding: 24px;
}

.app-footer {
  background-color: var(--header-background);
  padding: 16px 24px;
  text-align: center;
}

/* RTL Support */
[dir="rtl"] .app-header,
[dir="rtl"] .header-actions,
[dir="rtl"] .logo,
[dir="rtl"] .user-menu {
  flex-direction: row-reverse;
}

/* Responsive design */
@media (max-width: 768px) {
  .app-content {
    flex-direction: column;
  }

  .sidebar {
    width: 100%;
    flex-direction: row;
    overflow-x: auto;
  }

  .sidebar a {
    padding: 8px 12px;
  }
}
</style>
