<template>
  <div class="user-details-container">
    <div class="card">
      <div v-if="isLoading" class="loading-wrapper">
        <Loading />
      </div>

      <div v-else-if="errorMessage" class="error-message">
        {{ errorMessage }}
      </div>

      <div v-else-if="user" class="user-detail-content">
        <div class="card-header">
          <h2>{{ $t("userDetails") }}</h2>
          <div class="actions">
            <button
              v-if="!authStore.isViewer"
              @click="toggleEdit"
              :class="{ secondary: isEditing }"
            >
              {{ isEditing ? $t("cancel") : $t("edit") }}
            </button>
            <button v-if="isEditing" @click="saveChanges">
              {{ $t("save") }}
            </button>
            <button
              v-if="authStore.isAdmin"
              class="danger"
              @click="showConfirmDialog = true"
            >
              {{ $t("delete") }}
            </button>
          </div>
        </div>

        <div class="user-info">
          <div class="field-group">
            <label>{{ $t("name") }}</label>
            <BaseInput v-if="isEditing" v-model="user.name" required />
            <div v-else class="field-value">{{ user.name }}</div>
          </div>

          <div class="field-group">
            <label>{{ $t("email") }}</label>
            <BaseInput
              v-if="isEditing"
              v-model="user.email"
              type="email"
              required
            />
            <div v-else class="field-value">{{ user.email }}</div>
          </div>

          <div class="field-group">
            <label>{{ $t("role") }}</label>
            <BaseSelect v-if="isEditing" v-model="user.role" :options="roles" />
            <div v-else class="field-value">
              <span :class="['role-badge', user.role.toLowerCase()]">
                {{ user.role }}
              </span>
            </div>
          </div>

          <div class="field-group">
            <label>{{ $t("status") }}</label>
            <BaseSelect
              v-if="isEditing"
              v-model="user.status"
              :options="statuses"
            />
            <div v-else class="field-value">
              <span :class="['status-badge', user.status.toLowerCase()]">
                {{ user.status }}
              </span>
            </div>
          </div>

          <div class="field-group">
            <label>{{ $t("dateJoined") }}</label>
            <div class="field-value">
              {{ new Date(user.dateJoined).toLocaleDateString() }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <Dialog
      v-if="showConfirmDialog"
      :message="$t('deleteUserConfirmation')"
      @confirm="deleteUser"
      @cancel="showConfirmDialog = false"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useAuthStore } from "../store/authStore";
import { useUserStore } from "../store/userStore";
import { useI18n } from "vue-i18n";
import type { User } from "../types/User";
import BaseInput from "../components/ReusableUi/BaseInput.vue";
import BaseSelect from "../components/ReusableUi/BaseSelect.vue";
import Dialog from "../components/ReusableUi/Dialog.vue";
import Loading from "./ReusableUi/Loading.vue";

const { t } = useI18n();
const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();
const userStore = useUserStore();

const user = reactive<User>({
  id: 0,
  name: "",
  email: "",
  role: "Viewer",
  status: "Active",
  dateJoined: new Date().toISOString(),
});
const isLoading = ref(false);
const errorMessage = ref("");
const isEditing = ref(false);
const showConfirmDialog = ref(false);

const roles = ["Admin", "Manager", "Viewer"];
const statuses = ["Active", "Inactive"];

// Fetch user details
const fetchUser = async () => {
  try {
    isLoading.value = true;
    const userId = Number(route.params.id);
    const fetchedUser = await userStore.fetchUserById(userId);
    Object.assign(user, fetchedUser);
  } catch (error) {
    errorMessage.value = t("userLoadError");
  } finally {
    isLoading.value = false;
  }
};

onMounted(fetchUser);

// Toggle edit mode
const toggleEdit = () => {
  isEditing.value = !isEditing.value;
  errorMessage.value = ""; // Clear error messages when toggling edit mode
};

// Update user
const saveChanges = async () => {
  if (!user.name.trim() || !user.email.trim()) {
    errorMessage.value = t("emptyFieldsError");
    return;
  }

  try {
    isLoading.value = true;
    await userStore.editUser(user.id, user);
    isEditing.value = false;
  } catch (error) {
    errorMessage.value = t("updateError");
  } finally {
    isLoading.value = false;
  }
};

// Delete user
const deleteUser = async () => {
  showConfirmDialog.value = false;
  try {
    isLoading.value = true;
    await userStore.removeUser(user.id);
    router.push("/users");
  } catch (error) {
    errorMessage.value = t("deleteError");
  } finally {
    isLoading.value = false;
  }
};
</script>

<style scoped>
.user-details-container {
  max-width: 700px;
  margin: 0 auto;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid var(--border-color);
}

.actions {
  display: flex;
  gap: 8px;
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

.user-info {
  display: grid;
  grid-template-columns: 1fr;
  gap: 20px;
}

.field-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.field-group label {
  font-weight: 600;
  color: var(--text-secondary);
}

.field-value {
  font-size: 1rem;
  padding: 8px 0;
}

.role-badge,
.status-badge {
  display: inline-block;
  padding: 4px 12px;
  border-radius: 16px;
  font-size: 0.875rem;
  font-weight: 500;
}

.role-badge.admin {
  background-color: rgba(52, 152, 219, 0.2);
  color: #3498db;
}

.role-badge.manager {
  background-color: rgba(155, 89, 182, 0.2);
  color: #9b59b6;
}

.role-badge.viewer {
  background-color: rgba(46, 204, 113, 0.2);
  color: #2ecc71;
}

.status-badge.active {
  background-color: rgba(46, 204, 113, 0.2);
  color: #2ecc71;
}

.status-badge.inactive {
  background-color: rgba(149, 165, 166, 0.2);
  color: #95a5a6;
}

/* RTL Support */
[dir="rtl"] .card-header,
[dir="rtl"] .actions {
  flex-direction: row-reverse;
}

/* Responsive design */
@media (min-width: 768px) {
  .user-info {
    grid-template-columns: 1fr 1fr;
  }
}
</style>
