import type { User } from "../types/User";

const roles = ["Admin", "Manager", "Viewer"];

const users: User[] = Array.from({ length: 50 }, (_, i) => ({
  id: i + 1,
  name: `User ${i + 1}`,
  email: `user${i + 1}@example.com`,
  role: i % 3 === 0 ? "Admin" : i % 3 === 1 ? "Manager" : "Viewer",
  status: i % 2 === 0 ? "Active" : "Inactive",
  dateJoined: new Date(
    2023,
    Math.floor(Math.random() * 12),
    Math.floor(Math.random() * 28)
  ).toISOString(),
}));

export default users;

// Simulates realistic network delay (300-800ms)
const simulateLatency = () =>
  new Promise((resolve) => setTimeout(resolve, Math.random() * 500 + 300));

// Simulates random failures (10% chance of failure)
const shouldFail = () => Math.random() < 0.1;

//  /api/users - List users with pagination, filtering, sorting
export const getUsers = async (
  search = "",
  role = "",
  status = "",
  page = 1,
  pageSize = 10,
  sortBy: keyof User = "name",
  sortOrder: "asc" | "desc" = "asc"
) => {
  await simulateLatency();
  if (shouldFail()) throw new Error("Failed to fetch users");

  let filteredUsers = [...users];

  // Search by name or email
  if (search) {
    filteredUsers = filteredUsers.filter(
      (user) =>
        user.name.toLowerCase().includes(search.toLowerCase()) ||
        user.email.toLowerCase().includes(search.toLowerCase())
    );
  }

  // Filter by role
  if (role) filteredUsers = filteredUsers.filter((user) => user.role === role);

  // Filter by status
  if (status)
    filteredUsers = filteredUsers.filter((user) => user.status === status);

  // Sorting
  filteredUsers.sort((a, b) => {
    const valA = a[sortBy]?.toString().toLowerCase();
    const valB = b[sortBy]?.toString().toLowerCase();

    if (valA < valB) return sortOrder === "asc" ? -1 : 1;
    if (valA > valB) return sortOrder === "asc" ? 1 : -1;
    return 0;
  });

  // Pagination
  const totalUsers = filteredUsers.length;
  const paginatedUsers = filteredUsers.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  return { users: paginatedUsers, total: totalUsers };
};

//  /api/users/{id} - Get specific user
export const getUserById = async (id: number) => {
  await simulateLatency();
  if (shouldFail()) throw new Error("Failed to fetch user");

  return users.find((user) => user.id === id) || null;
};

//  /api/users - Create new user
export const createUser = async (newUser: Partial<User>) => {
  await simulateLatency();
  if (shouldFail()) throw new Error("Failed to create user");

  if (!newUser.name || !newUser.email || !newUser.role || !newUser.status) {
    throw new Error("Missing required user fields");
  }

  const id = users.length + 1;
  const user: User = {
    id,
    name: newUser.name,
    email: newUser.email,
    role: newUser.role,
    status: newUser.status,
    dateJoined: new Date().toISOString(),
  };

  users.push(user);
  return user;
};

//  /api/users/{id} - Update user
export const updateUser = async (id: number, updatedData: Partial<User>) => {
  await simulateLatency();
  if (shouldFail()) throw new Error("Failed to update user");

  const index = users.findIndex((user) => user.id === id);
  if (index === -1) throw new Error("User not found");

  users[index] = { ...users[index], ...updatedData };
  return users[index];
};

//  /api/users/{id} - Delete user
export const deleteUser = async (id: number) => {
  await simulateLatency();
  if (shouldFail()) throw new Error("Failed to delete user");

  const index = users.findIndex((user) => user.id === id);
  if (index === -1) throw new Error("User not found");

  users.splice(index, 1);
  return { success: true };
};

//  /api/roles - Get available roles
export const getRoles = async () => {
  await simulateLatency();
  return roles;
};
