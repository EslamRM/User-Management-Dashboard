<template>
  <div class="pagination">
    <button
      :disabled="currentPage === 1"
      @click="$emit('pageChange', currentPage - 1)"
    >
      {{ $t("prev") }}
    </button>
    <span>Page {{ currentPage }} of {{ totalPages }}</span>
    <button
      :disabled="currentPage >= totalPages"
      @click="$emit('pageChange', currentPage + 1)"
    >
      {{ $t("next") }}
    </button>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  currentPage: number;
  totalPages: number;
}>();

defineEmits(["pageChange"]);
</script>

<style scoped>
.pagination {
  margin-top: 10px;
  display: flex;
  justify-content: center;
  gap: 10px;
}
</style>
