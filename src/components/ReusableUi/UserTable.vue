<template>
  <div class="table-container">
    <div class="table-header">
      <slot name="header"></slot>
    </div>

    <table>
      <thead>
        <tr>
          <th @click="sortBy('name')">
            {{ $t("name") }}
            <span class="sort-icon" v-if="sortKey === 'name'">{{
              sortOrder === "asc" ? "▲" : "▼"
            }}</span>
          </th>
          <th>
            {{ $t("email") }}
          </th>
          <th @click="sortBy('role')">
            {{ $t("role") }}
            <span class="sort-icon">{{ "▼" }}</span>
          </th>
          <th @click="sortBy('status')">
            {{ $t("status") }}
            <span class="sort-icon">{{ "▼" }}</span>
          </th>
          <th @click="sortBy('dateJoined')">
            {{ $t("dateJoined") }}
            <span class="sort-icon">{{ "▼" }}</span>
          </th>
          <th v-if="canEditUsers || canDeleteUsers" class="actions-column">
            {{ $t("actions") }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="user in users" :key="user.id" class="user-row">
          <td>
            <div class="user-name">
              {{ user.name }}
            </div>
          </td>
          <td>{{ user.email }}</td>
          <td>
            <span
              class="badge role-badge"
              :class="'role-' + user.role.toLowerCase()"
            >
              {{ user.role }}
            </span>
          </td>
          <td>
            <span
              class="badge status-badge"
              :class="'status-' + user.status.toLowerCase()"
            >
              {{ user.status }}
            </span>
          </td>
          <td>{{ formatDate(user.dateJoined) }}</td>
          <td v-if="canEditUsers || canDeleteUsers" class="actions-cell">
            <div class="action-buttons">
              <button
                v-if="canEditUsers && user.role !== 'Admin'"
                class="action-button secondary"
                @click="$emit('edit', user)"
                :title="$t('edit')"
              >
                <span class="icon">✏️</span>
                <span class="button-text">{{ $t("edit") }}</span>
              </button>
              <button
                v-if="canDeleteUsers"
                class="action-button danger"
                @click="confirmDelete(user)"
                :title="$t('delete')"
              >
                <span class="icon">🗑️</span>
                <span class="button-text">{{ $t("delete") }}</span>
              </button>
            </div>
          </td>
        </tr>
        <tr v-if="users.length === 0">
          <td
            :colspan="canEditUsers || canDeleteUsers ? 6 : 5"
            class="empty-state"
          >
            {{ $t("no_users_found") }}
          </td>
        </tr>
      </tbody>
    </table>

    <div class="table-footer">
      <slot name="footer"></slot>
    </div>

    <!-- Delete confirmation modal -->
    <div v-if="showDeleteModal" class="modal-overlay" @click="cancelDelete">
      <div class="modal-content" @click.stop>
        <h3>{{ $t("confirm_delete") }}</h3>
        <p>
          {{ $t("delete_user_confirmation", { name: userToDelete?.name }) }}
        </p>
        <div class="modal-actions">
          <button class="secondary" @click="cancelDelete">
            {{ $t("cancel") }}
          </button>
          <button class="danger" @click="confirmDeleteAction">
            {{ $t("delete") }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import type { User } from "../../types/User";

const props = defineProps<{
  users: User[];
  canEditUsers: boolean;
  canDeleteUsers: boolean;
}>();

const emit = defineEmits(["edit", "delete", "sort"]);

const sortKey = ref<keyof User | null>(null);
const sortOrder = ref<"asc" | "desc">("asc");
const showDeleteModal = ref(false);
const userToDelete = ref<User | null>(null);

const sortBy = (key: keyof User) => {
  if (sortKey.value === key) {
    // Toggle sort order if clicking the same column
    sortOrder.value = sortOrder.value === "asc" ? "desc" : "asc";
  } else {
    // Set new sort key and default to ascending
    sortKey.value = key;
    sortOrder.value = "asc";
  }
  emit("sort", { key, order: sortOrder.value });
};

const formatDate = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(date);
  } catch (error) {
    return dateString;
  }
};

const getUserInitials = (name: string): string => {
  return name
    .split(" ")
    .map((part) => part.charAt(0))
    .join("")
    .toUpperCase()
    .substring(0, 2);
};

const confirmDelete = (user: User) => {
  userToDelete.value = user;
  showDeleteModal.value = true;
};

const cancelDelete = () => {
  showDeleteModal.value = false;
  userToDelete.value = null;
};

const confirmDeleteAction = () => {
  if (userToDelete.value) {
    emit("delete", userToDelete.value.id);
    showDeleteModal.value = false;
    userToDelete.value = null;
  }
};
</script>

<style scoped>
.table-container {
  width: 100%;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: var(--box-shadow);
  background-color: var(--card-background);
  margin-bottom: 20px;
}

.table-header,
.table-footer {
  padding: 16px;
  background-color: var(--card-background);
}

table {
  width: 100%;
  border-collapse: collapse;
  margin: 0;
}

th {
  background-color: var(--table-header-bg);
  padding: 12px 16px;
  text-align: left;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s;
  white-space: nowrap;
  position: relative;
}

th:hover {
  background-color: var(--table-hover-bg);
}

.sort-icon {
  margin-left: 4px;
  font-size: 10px;
  opacity: 0.7;
}

tr:nth-child(even) {
  background-color: var(--table-stripe-bg);
}

tr:hover {
  background-color: var(--table-hover-bg);
}

td {
  padding: 12px 16px;
  border-top: 1px solid var(--border-color);
  vertical-align: middle;
}

.user-row {
  transition: background-color 0.2s;
}

.user-name {
  display: flex;
  align-items: center;
  gap: 8px;
}

.avatar,
.avatar-placeholder {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 12px;
  color: white;
  background-color: var(--primary-color);
}

.avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.badge {
  display: inline-block;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
}

.role-badge {
  background-color: rgba(var(--primary-color-rgb, 52, 152, 219), 0.1);
  color: var(--primary-color);
}

.role-admin {
  background-color: rgba(156, 39, 176, 0.1);
  color: #9c27b0;
}

.role-user {
  background-color: rgba(33, 150, 243, 0.1);
  color: #2196f3;
}

.role-editor {
  background-color: rgba(76, 175, 80, 0.1);
  color: #4caf50;
}

.status-badge {
  background-color: rgba(var(--secondary-color-rgb, 40, 167, 69), 0.1);
  color: var(--secondary-color);
}

.status-active {
  background-color: rgba(76, 175, 80, 0.1);
  color: #4caf50;
}

.status-inactive {
  background-color: rgba(158, 158, 158, 0.1);
  color: #9e9e9e;
}

.status-pending {
  background-color: rgba(255, 152, 0, 0.1);
  color: #ff9800;
}

.status-suspended {
  background-color: rgba(244, 67, 54, 0.1);
  color: #f44336;
}

.actions-column {
  text-align: center;
  width: 150px;
}

.actions-cell {
  padding: 8px;
}

.action-buttons {
  display: flex;
  justify-content: center;
  gap: 8px;
}

.action-button {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  padding: 6px 12px;
  border-radius: 4px;
  font-size: 12px;
  transition: background-color 0.3s, transform 0.1s;
}

.action-button:hover {
  transform: translateY(-1px);
}

.action-button:active {
  transform: translateY(0);
}

.action-button .icon {
  font-size: 14px;
}

.empty-state {
  text-align: center;
  padding: 24px;
  color: var(--text-secondary);
}

/* Modal styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: var(--modal-overlay);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background-color: var(--card-background);
  border-radius: 8px;
  padding: 24px;
  width: 400px;
  max-width: 90%;
  box-shadow: var(--box-shadow);
}

.modal-content h3 {
  margin-top: 0;
  color: var(--text-color);
}

.modal-content p {
  color: var(--text-secondary);
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 20px;
}

/* RTL Support */
[dir="rtl"] th,
[dir="rtl"] td {
  text-align: right;
}

[dir="rtl"] .user-name {
  flex-direction: row-reverse;
}

[dir="rtl"] .sort-icon {
  margin-left: 0;
  margin-right: 4px;
}

[dir="rtl"] .action-buttons {
  flex-direction: row-reverse;
}

/* Responsive design */
@media (max-width: 768px) {
  table {
    display: block;
    overflow-x: auto;
  }

  .button-text {
    display: none;
  }

  .action-button {
    padding: 8px;
  }

  .action-button .icon {
    font-size: 16px;
  }

  .actions-column {
    width: 100px;
  }
}
</style>
