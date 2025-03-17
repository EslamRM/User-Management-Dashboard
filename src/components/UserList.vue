<template>
  <div class="user-list-container">
    <div class="card">
      <div class="card-header">
        <h2>{{ $t("title") }}</h2>
        <div class="export-actions">
          <button @click="exportCSV" class="secondary">
            <span class="icon">📊</span> {{ $t("csv") }}
          </button>
          <button @click="exportPDF" class="secondary">
            <span class="icon">📄</span> {{ $t("pdf") }}
          </button>
        </div>
      </div>

      <div class="card-body">
        <!-- Filters -->
        <UserFilters
          v-model:searchQuery="userStore.searchQuery"
          v-model:selectedRole="userStore.selectedRole"
          v-model:selectedStatus="userStore.selectedStatus"
        />

        <!-- Loading & Error Handling -->
        <div v-if="userStore.loading" class="loading-wrapper">
          <Loading />
        </div>
        <div v-if="userStore.error" class="error-message">
          {{ userStore.error }}
        </div>

        <!-- User Table -->
        <UserTable
          v-if="!userStore.loading && !userStore.error"
          :users="userStore.users"
          :canEditUsers="canEditUsers"
          :canDeleteUsers="canDeleteUsers"
          @edit="editUser"
          @delete="confirmDelete"
          @sort="userStore.updateSorting"
        />

        <!-- Pagination -->
        <Pagination
          v-if="!userStore.loading && !userStore.error"
          :currentPage="userStore.currentPage"
          :totalPages="userStore.totalPages"
          @pageChange="userStore.setPage"
        />
      </div>
    </div>

    <!-- Confirmation Dialog -->
    <Dialog
      v-if="showDeleteDialog"
      :message="$t('deleteConfirmation')"
      @confirm="deleteUser"
      @cancel="showDeleteDialog = false"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useI18n } from "vue-i18n";
import { useUserStore } from "../store/userStore";
import { useAuthStore } from "../store/authStore";
import { useRouter } from "vue-router";
import { useExport } from "../composables/useExport";
import type { User } from "../types/User";
import UserFilters from "../components/ReusableUi/UserFilters.vue";
import UserTable from "../components/ReusableUi/UserTable.vue";
import Pagination from "../components/ReusableUi/Pagination.vue";
import Loading from "./ReusableUi/Loading.vue";
import Dialog from "../components/ReusableUi/Dialog.vue";

const { t, locale } = useI18n();
const userStore = useUserStore();
const authStore = useAuthStore();
const router = useRouter();
const { exportToCSV, exportToPDF } = useExport();

// State for delete confirmation
const showDeleteDialog = ref(false);
const userToDelete = ref<number | null>(null);

onMounted(() => {
  userStore.loadUsers();
  userStore.loadRoles();
});

const canEditUsers = computed<boolean>(
  () => authStore.isAdmin || authStore.isManager
);
const canDeleteUsers = computed<boolean>(() => authStore.isAdmin);

const editUser = (user: User): void => {
  router.push(`/users/${user.id}`);
};

const confirmDelete = (id: number): void => {
  userToDelete.value = id;
  showDeleteDialog.value = true;
};

const deleteUser = async (): Promise<void> => {
  if (userToDelete.value) {
    await userStore.removeUser(userToDelete.value);
    showDeleteDialog.value = false;
    userToDelete.value = null;
  }
};

// Export Users to CSV
const exportCSV = () => {
  exportToCSV(userStore.users, "users.csv");
};

// Export Users to PDF
const exportPDF = () => {
  const columns = ["ID", "Name", "Email", "Role", "Status"];
  const data = userStore.users.map((user) => ({
    ID: user.id,
    Name: user.name,
    Email: user.email,
    Role: user.role,
    Status: user.status,
  }));
  exportToPDF(data, columns, "users.pdf");
};
</script>

<style scoped>
.user-list-container {
  max-width: 1200px;
  margin: 0 auto;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  padding-bottom: 16px;
  border-bottom: 1px solid var(--border-color);
}

.export-actions {
  display: flex;
  gap: 8px;
}

.icon {
  margin-right: 4px;
}

.loading-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 200px;
}

.error-message {
  background-color: rgba(220, 53, 69, 0.1);
  color: var(--danger-color);
  padding: 12px;
  border-radius: 4px;
  margin: 16px 0;
  text-align: center;
}

/* RTL Support */
[dir="rtl"] .card-header,
[dir="rtl"] .export-actions {
  flex-direction: row-reverse;
}

[dir="rtl"] .icon {
  margin-right: 0;
  margin-left: 4px;
}
</style>
