# User Management Dashboard

This is a **Vue 3 + TypeScript** user management dashboard that includes multi-language support (**i18n**), export functionality (CSV/PDF), and comprehensive testing coverage.

## 📌 Features

- **User Management**: Add, edit, delete, and filter users.
- **Role-Based Access Control (RBAC)**: Admin, Manager, and Viewer roles.
- **Multi-language Support**: English and Arabic using Vue I18n.
- **Export to CSV/PDF**: Download user data in CSV and PDF formats.
- **Pagination & Sorting**: Navigate users efficiently.
- **Dark Mode Support**
- **Unit & E2E Testing**: Implemented with Vitest and Cypress.

---

## 🚀 Setup & Run Instructions

### 1️⃣ Prerequisites

- **Node.js** (v16+ recommended)
- **npm** or **yarn**

### 2️⃣ Installation

```sh
git clone <your-repository-url>
cd user-management-dashboard
npm install
```

### 3️⃣ Run the Development Server

```sh
npm run dev
```

### 4️⃣ Run Tests

```sh
# Run unit tests (Vitest/Jest)
npm run test

# Run E2E tests (Cypress)
npx cypress open --e2e
```

---

# Architectural Decisions and Approach

## 1. Component-Based Architecture

The project follows a modular Vue component structure, ensuring UI elements are separated into reusable components (e.g., `BaseInput.vue`, `BaseSelect.vue`, `Dialog.vue`).  
Common UI elements are placed inside the `ReusableUi` folder for easy access and reusability.

---

## 2. State Management with Pinia

Pinia is used as a lightweight and reactive state management solution instead of Vuex.  
The app includes:

- `authStore` for authentication logic.
- `userStore` for user-related data.

---

## 3. API Communication

- **Axios** is used for API calls.
- Interceptors are implemented for:
  - Handling errors.
  - Managing authentication tokens.

---

## 4. i18n (Internationalization) Support

- **Vue I18n** is implemented to support English and Arabic translations.
- Language toggle functionality is available using the `$t()` function for translations.

---

## 5. TypeScript for Safety & Maintainability

- TypeScript ensures type safety and improves code maintainability.
- API responses have defined interfaces for better clarity and error prevention.

---

# Implemented Features

## 1. User Management

- View, edit, and delete users.
- Role-based permissions (Admin, Manager, Viewer).
- Form validation with error handling.

## 2. Authentication & Authorization

- Login system with authentication logic in `authStore.ts`.
- Role-based access control (RBAC) with different UI elements based on user roles.

## 3. Internationalization (i18n)

- Supports English and Arabic.
- Language toggle with `$t()` function for translations.

## 4. API Calls & Error Handling

- All API interactions are handled through Axios.
- Error messages are displayed when API calls fail.

## 5. Responsive Design

- Built with **CSS Flexbox** and **Grid** for full responsiveness.

---

# Test Coverage and Running Tests

## Testing Strategy

- **Unit Tests**: Critical components (e.g., `BaseInput`, `BaseSelect`, `UserList`).
- **Integration Tests**: Pinia stores and API interactions.
- **End-to-End (E2E) Tests**: Cypress or Playwright for full workflow testing.

## Running Tests

```sh
npm run test       # Run unit tests (Vitest)
npx cypress open --e2e   # Run E2E tests (Cypress)
```
# Architecture Questions

## 1. How would you optimize API calls in this application for performance?
- **Debounce API requests** (e.g., for search filters).
- Use **client-side caching** with Pinia or Vue Query.
- **Batch requests** where possible.
- **Paginate results** to reduce load.

## 2. Describe your approach to handling shared logic between components.
- **Composable Functions** (`useAuth.ts`, `useFetch.ts`) for reusable logic.
- **Mixins or Pinia Stores** for shared state management.
- **Custom directives** for UI logic (e.g., input validation).

## 3. How would you implement client-side data caching for this dashboard?
- **Pinia store caching**: Store user data locally for faster re-renders.
- **LocalStorage or IndexedDB**: Persist frequently accessed data.
- **Vue Query or SWR**: Enable automatic background updates.

## 4. What strategy would you use to scale this application if it needed to support hundreds of different user permission types?
- **Dynamic Role-Based Access Control (RBAC)**: Define permissions in a database instead of hardcoded roles.
- **Middleware Authorization Checks**: Centralize role-checking logic.
- **Lazy Load Components**: Load only necessary UI elements based on roles.

## 5. Explain your testing strategy and how you decided what to test.
- **Unit tests** for reusable components and composables.
- **Integration tests** for Pinia stores (state management).
- **E2E tests** for user flows (login, CRUD operations).

## 6. How would you handle offline capabilities in this application?
- **Service Workers**: Cache API responses for offline usage.
- **IndexedDB**: Store critical data locally.
- **Fallback UI**: Display cached data instead of an error when offline.

## 📜 License
This project is licensed under the **MIT License**.

