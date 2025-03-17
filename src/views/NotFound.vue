<template>
  <div class="not-found">
    <h1>404 - Page Not Found</h1>
    <p>The page you are looking for does not exist.</p>
    <RouterLink to="/">Go to Home</RouterLink>
  </div>
</template>

<script setup>
import { RouterLink } from "vue-router";
</script>

<style scoped>
.not-found {
  text-align: center;
  margin-top: 50px;
}

h1 {
  font-size: 2rem;
  color: #ff4d4d;
}

p {
  margin-bottom: 20px;
}

a {
  color: #007bff;
  text-decoration: none;
  font-weight: bold;
}
</style>
