import { getUsers, getUserById, updateUser, deleteUser } from './mockApi';

(async () => {
  console.log(await getUsers('', 'Admin', '', 1, 5)); // Fetch first 5 Admin users
  console.log(await getUserById(2)); // Get user with ID 2
  console.log(await updateUser(2, { name: 'Updated User 2' })); // Update user
  console.log(await deleteUser(2)); // Delete user
})();
