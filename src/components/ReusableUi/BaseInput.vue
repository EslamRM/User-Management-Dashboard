<template>
  <div class="input-group">
    <label v-if="label">{{ label }}</label>
    <div class="input-wrapper">
      <input
        v-focus
        :value="modelValue"
        @input="updateValue"
        :type="type"
        :required="required"
        :placeholder="placeholder"
        :class="{ 'has-error': error }"
      />
      <div v-if="error" class="error-text">{{ error }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import vFocus from "../../directives/vFocus";

defineProps({
  modelValue: String,
  label: String,
  type: { type: String, default: "text" },
  required: { type: Boolean, default: false },
  placeholder: { type: String, default: "" },
  error: { type: String, default: "" },
});

const emit = defineEmits(["update:modelValue"]);

const updateValue = (event: Event) => {
  emit("update:modelValue", (event.target as HTMLInputElement).value);
};
</script>

<style scoped>
.input-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 16px;
}

.input-group label {
  font-weight: 500;
  color: var(--text-secondary);
}

.input-wrapper {
  position: relative;
}

input {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  background-color: var(--input-background);
  color: var(--text-color);
  font-size: 1rem;
  transition: border-color 0.3s, box-shadow 0.3s;
}

input:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 2px rgba(52, 152, 219, 0.2);
}

input.has-error {
  border-color: var(--danger-color);
}

.error-text {
  color: var(--danger-color);
  font-size: 0.875rem;
  margin-top: 4px;
}

/* RTL Support */
[dir="rtl"] .input-group {
  text-align: right;
}
</style>
