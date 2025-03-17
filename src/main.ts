import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import { createPinia } from "pinia";
import i18n from "./i18n";

const app = createApp(App);
app.use(i18n);
app.use(router);
app.use(createPinia());

app.mount("#app");
