<template>
  <div class="login-page">
    <h2>{{ $t("login") }}</h2>
    <form @submit.prevent="handleLogin">
      <input type="email" v-model="email" :placeholder="$t('email')" required />
      <input
        type="password"
        v-model="password"
        :placeholder="$t('password')"
        required
      />
      <button type="submit">{{ $t("login") }}</button>
    </form>
    <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useAuthStore } from "../store/authStore";

const authStore = useAuthStore();
const email = ref("");
const password = ref("");
const errorMessage = ref("");

const handleLogin = async () => {
  try {
    await authStore.login(email.value, password.value);
  } catch (error) {
    errorMessage.value = "Invalid email or password";
  }
};
</script>

<style scoped>
.login-page {
  max-width: 400px;
  margin: auto;
  text-align: center;
}
.login-page form{
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin-top: 20px;
}
.login-page button {
  margin-top: 20px;
}
  
.error {
  color: red;
}
</style>
