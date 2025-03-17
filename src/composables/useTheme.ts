import { ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';

export function useTheme() {
  const isDark = ref(localStorage.getItem('theme') === 'dark');
  const { locale } = useI18n();
  const isRtl = ref(locale.value === 'ar');

  // Update theme in localStorage and DOM
  const toggleTheme = () => {
    isDark.value = !isDark.value;
    localStorage.setItem('theme', isDark.value ? 'dark' : 'light');
    updateDocumentTheme();
  };

  // Update document direction based on language
  watch(locale, (newLocale) => {
    isRtl.value = newLocale === 'ar';
    document.documentElement.dir = isRtl.value ? 'rtl' : 'ltr';
  });

  // Apply theme to document
  const updateDocumentTheme = () => {
    if (isDark.value) {
      document.documentElement.classList.add('dark-theme');
    } else {
      document.documentElement.classList.remove('dark-theme');
    }
  };

  // Initialize theme and direction
  const initTheme = () => {
    updateDocumentTheme();
    document.documentElement.dir = isRtl.value ? 'rtl' : 'ltr';
  };

  return {
    isDark,
    isRtl,
    toggleTheme,
    initTheme
  };
}