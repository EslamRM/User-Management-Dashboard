<template>
  <div class="select-group">
    <label v-if="label">{{ label }}</label>
    <div class="select-wrapper">
      <select
        v-focus
        :value="modelValue"
        @change="updateValue"
        :class="{ 'has-error': error }"
      >
        <option v-for="option in options" :key="option" :value="option">
          {{ option }}
        </option>
      </select>
      <div class="select-arrow">▼</div>
      <div v-if="error" class="error-text">{{ error }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import vFocus from "../../directives/vFocus";

defineProps({
  modelValue: String,
  label: String,
  options: Array as () => string[],
  error: { type: String, default: "" },
});

const emit = defineEmits(["update:modelValue"]);

const updateValue = (event: Event) => {
  emit("update:modelValue", (event.target as HTMLSelectElement).value);
};
</script>

<style scoped>
.select-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 16px;
}

.select-group label {
  font-weight: 500;
  color: var(--text-secondary);
}

.select-wrapper {
  position: relative;
}

select {
  width: 100%;
  padding: 10px 12px;
  padding-right: 30px; /* Space for arrow */
  border: 1px solid var(--border-color);
  border-radius: 4px;
  background-color: var(--input-background);
  color: var(--text-color);
  font-size: 1rem;
  appearance: none;
  transition: border-color 0.3s, box-shadow 0.3s;
}

select:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 2px rgba(52, 152, 219, 0.2);
}

select.has-error {
  border-color: var(--danger-color);
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

.error-text {
  color: var(--danger-color);
  font-size: 0.875rem;
  margin-top: 4px;
}

/* RTL Support */
[dir="rtl"] .select-group {
  text-align: right;
}

[dir="rtl"] .select-arrow {
  right: auto;
  left: 12px;
}

[dir="rtl"] select {
  padding-right: 12px;
  padding-left: 30px; /* Space for arrow */
}
</style>
