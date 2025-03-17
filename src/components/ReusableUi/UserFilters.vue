<template>
  <div class="filters-container">
    <div class="search-wrapper">
      <input
        :value="searchQuery"
        @input="
          $emit('update:searchQuery', ($event.target as HTMLInputElement).value)
        "
        :placeholder="$t('searchPlaceholder')"
        class="search-input"
      />
      <span class="search-icon">🔍</span>
    </div>

    <div class="filter-selects">
      <div class="select-wrapper">
        <select
          :value="selectedRole"
          @change="
            $emit(
              'update:selectedRole',
              ($event.target as HTMLSelectElement).value
            )
          "
        >
          <option value="">{{ $t("AllRoles") }}</option>
          <option value="Admin">{{ $t("admin") }}</option>
          <option value="Manager">{{ $t("manager") }}</option>
          <option value="Viewer">{{ $t("viewer") }}</option>
        </select>
        <div class="select-arrow">▼</div>
      </div>

      <div class="select-wrapper">
        <select
          :value="selectedStatus"
          @change="
            $emit(
              'update:selectedStatus',
              ($event.target as HTMLSelectElement).value
            )
          "
        >
          <option value="">{{ $t("AllStatus") }}</option>
          <option value="Active">{{ $t("active") }}</option>
          <option value="Inactive">{{ $t("inactive") }}</option>
        </select>
        <div class="select-arrow">▼</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  searchQuery: string;
  selectedRole: string;
  selectedStatus: string;
}>();

defineEmits([
  "update:searchQuery",
  "update:selectedRole",
  "update:selectedStatus",
]);
</script>

<style scoped>
.filters-container {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  margin-bottom: 24px;
}

.search-wrapper {
  position: relative;
  flex: 1;
  min-width: 200px;
}

.search-input {
  width: 100%;
  padding: 10px 16px;
  padding-left: 36px;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  background-color: var(--input-background);
  color: var(--text-color);
}

.search-icon {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--text-secondary);
  pointer-events: none;
}

.filter-selects {
  display: flex;
  gap: 16px;
}

.select-wrapper {
  position: relative;
  min-width: 150px;
}

select {
  width: 100%;
  padding: 10px 16px;
  padding-right: 30px;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  background-color: var(--input-background);
  color: var(--text-color);
  appearance: none;
}

.select-arrow {
  position: absolute;
  top: 50%;
  right: 12px;
  transform: translateY(-50%);
  pointer-events: none;
  font-size: 0.75rem;
  color: var(--text-secondary);
}

/* RTL Support */
[dir="rtl"] .search-input {
  padding-left: 16px;
  padding-right: 36px;
}

[dir="rtl"] .search-icon {
  left: auto;
  right: 12px;
}

[dir="rtl"] select {
  padding-right: 16px;
  padding-left: 30px;
}

[dir="rtl"] .select-arrow {
  right: auto;
  left: 12px;
}

/* Responsive */
@media (max-width: 768px) {
  .filters-container {
    flex-direction: column;
  }

  .filter-selects {
    width: 100%;
  }
}
</style>
