// tests/store/userStore.spec.ts
import { setActivePinia, createPinia } from 'pinia';
import { useUserStore } from '../../store/userStore';
import * as mockApi from '../../api/mockApi';
import { vi, describe, beforeEach, it, expect } from 'vitest';
import type { User } from '../../types/User';

// Define proper User type that matches the interface from the source code
type UserRole = 'Admin' | 'Manager' | 'Viewer';
type UserStatus = 'Active' | 'Inactive';

// Mock the API calls correctly
vi.mock('../../api/mockApi', () => {
  return {
    getUsers: vi.fn(),
    getUserById: vi.fn(),
    createUser: vi.fn(),
    updateUser: vi.fn(),
    deleteUser: vi.fn(),
    getRoles: vi.fn()
  };
});

describe('User Store', () => {
  let store: ReturnType<typeof useUserStore>;

  beforeEach(() => {
    // Create a fresh pinia and store before each test
    setActivePinia(createPinia());
    store = useUserStore();
    
    // Reset mock calls
    vi.clearAllMocks();
  });

  describe('loadUsers', () => {
    it('should load users successfully', async () => {
      const mockUsers: User[] = [
        { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Admin' as UserRole, status: 'Active' as UserStatus, dateJoined: '2023-01-01' },
        { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'Manager' as UserRole, status: 'Active' as UserStatus, dateJoined: '2023-02-01' }
      ];
      
      // Mock the API response
      vi.mocked(mockApi.getUsers).mockResolvedValue({
        users: mockUsers,
        total: 2
      });

      // Call the method
      await store.loadUsers();

      // Verify the state was updated correctly
      expect(store.users).toEqual(mockUsers);
      expect(store.loading).toBe(false);
      expect(store.error).toBe(null);
    });

    it('should handle errors when loading users', async () => {
      // Mock the API to throw an error
      vi.mocked(mockApi.getUsers).mockRejectedValue(new Error('API Error'));

      // Call the method
      await store.loadUsers();

      // Verify the state was updated correctly
      expect(store.users).toEqual([]);
      expect(store.loading).toBe(false);
      expect(store.error).toBe('Failed to load users');
    });
  });

  describe('loadRoles', () => {
    it('should load roles successfully', async () => {
      const mockRoles = ['Admin', 'Manager', 'Viewer'];
      
      // Mock the API response
      vi.mocked(mockApi.getRoles).mockResolvedValue(mockRoles);

      // Call the method
      await store.loadRoles();

      // Verify the API was called
      expect(mockApi.getRoles).toHaveBeenCalled();

      // Verify the state was updated correctly
      expect(store.roles).toEqual(mockRoles);
      expect(store.loading).toBe(false);
      expect(store.error).toBe(null);
    });

    it('should handle errors when loading roles', async () => {
      // Mock the API to throw an error
      vi.mocked(mockApi.getRoles).mockRejectedValue(new Error('API Error'));

      // Call the method
      await store.loadRoles();

      // Verify the state was updated correctly
      expect(store.roles).toEqual([]);
      expect(store.loading).toBe(false);
      expect(store.error).toBe('Failed to load roles');
    });
  });

  describe('fetchUserById', () => {
    it('should fetch a user by ID successfully', async () => {
      const mockUser: User = { 
        id: 1, 
        name: 'John Doe', 
        email: 'john@example.com', 
        role: 'Admin' as UserRole, 
        status: 'Active' as UserStatus, 
        dateJoined: '2023-01-01' 
      };
      
      // Mock the API response
      vi.mocked(mockApi.getUserById).mockResolvedValue(mockUser);

      // Call the method
      const result = await store.fetchUserById(1);

      // Verify the API was called with correct parameters
      expect(mockApi.getUserById).toHaveBeenCalledWith(1);

      // Verify the returned value
      expect(result).toEqual(mockUser);
      expect(store.loading).toBe(false);
      expect(store.error).toBe(null);
    });

    it('should handle errors when fetching a user', async () => {
      // Mock the API to throw an error
      vi.mocked(mockApi.getUserById).mockRejectedValue(new Error('API Error'));

      // Call the method
      const result = await store.fetchUserById(1);

      // Verify the state was updated correctly
      expect(result).toBe(null);
      expect(store.loading).toBe(false);
      expect(store.error).toBe('Failed to fetch user details');
    });
  });

  describe('addUser', () => {
    it('should add a user successfully', async () => {
      const newUser = { name: 'New User', email: 'new@example.com', role: 'Viewer' as UserRole };
      const createdUser: User = { 
        id: 3, 
        ...newUser, 
        status: 'Active' as UserStatus, 
        dateJoined: '2023-03-01' 
      };
      
      // Mock the API response
      vi.mocked(mockApi.createUser).mockResolvedValue(createdUser);

      // Call the method
      await store.addUser(newUser);

      // Verify the API was called with correct parameters
      expect(mockApi.createUser).toHaveBeenCalledWith(newUser);

      // Verify the state was updated correctly
      expect(store.users[0]).toEqual(createdUser);
      expect(store.loading).toBe(false);
      expect(store.error).toBe(null);
    });

    it('should handle errors when adding a user', async () => {
      const newUser = { name: 'New User', email: 'new@example.com', role: 'Viewer' as UserRole };
      
      // Mock the API to throw an error
      vi.mocked(mockApi.createUser).mockRejectedValue(new Error('API Error'));

      // Call the method
      await store.addUser(newUser);

      // Verify the state was updated correctly
      expect(store.loading).toBe(false);
      expect(store.error).toBe('Failed to add user');
    });
  });

  describe('editUser', () => {
    it('should update a user successfully', async () => {
      // Set up initial state
      store.users = [
        { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Admin' as UserRole, status: 'Active' as UserStatus, dateJoined: '2023-01-01' }
      ];
      
      const updatedData = { name: 'John Updated' };
      
      // Mock the API response
      vi.mocked(mockApi.updateUser).mockResolvedValue({ 
        id: 1, 
        name: 'John Updated', 
        email: 'john@example.com', 
        role: 'Admin' as UserRole, 
        status: 'Active' as UserStatus, 
        dateJoined: '2023-01-01' 
      });

      // Call the method
      await store.editUser(1, updatedData);

      // Verify the API was called with correct parameters
      expect(mockApi.updateUser).toHaveBeenCalledWith(1, updatedData);

      // Verify the state was updated correctly
      expect(store.users[0].name).toBe('John Updated');
      expect(store.error).toBe(null);
    });

    it('should handle errors and roll back when updating a user fails', async () => {
      // Set up initial state
      const originalUser: User = { 
        id: 1, 
        name: 'John Doe', 
        email: 'john@example.com', 
        role: 'Admin' as UserRole, 
        status: 'Active' as UserStatus, 
        dateJoined: '2023-01-01' 
      };
      store.users = [originalUser];
      
      const updatedData = { name: 'John Updated' };
      
      // Mock the API to throw an error
      vi.mocked(mockApi.updateUser).mockRejectedValue(new Error('API Error'));

      // Call the method
      await store.editUser(1, updatedData);

      // Verify the state was rolled back
      expect(store.users[0]).toEqual(originalUser);
      expect(store.error).toBe('Failed to update user');
    });

    it('should do nothing if user ID is not found', async () => {
      // Set up initial state
      store.users = [
        { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Admin' as UserRole, status: 'Active' as UserStatus, dateJoined: '2023-01-01' }
      ];
      
      const updatedData = { name: 'Jane Updated' };
      
      // Spy on the updateUser method
      const updateUserSpy = vi.spyOn(mockApi, 'updateUser');
      
      // Call the method with a non-existent ID
      await store.editUser(999, updatedData);

      // Verify the API was not called
      expect(updateUserSpy).not.toHaveBeenCalled();
      
      // Verify state remains unchanged
      expect(store.users).toHaveLength(1);
      expect(store.users[0].name).toBe('John Doe');
    });
  });

  describe('removeUser', () => {
    it('should remove a user successfully', async () => {
      // Set up initial state
      store.users = [
        { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Admin' as UserRole, status: 'Active' as UserStatus, dateJoined: '2023-01-01' },
        { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'Manager' as UserRole, status: 'Active' as UserStatus, dateJoined: '2023-02-01' }
      ];
      
      // Mock the API response
      vi.mocked(mockApi.deleteUser).mockResolvedValue(undefined);

      // Call the method
      await store.removeUser(1);

      // Verify the API was called with correct parameters
      expect(mockApi.deleteUser).toHaveBeenCalledWith(1);

      // Verify the state was updated correctly
      expect(store.users).toHaveLength(1);
      expect(store.users[0].id).toBe(2);
      expect(store.error).toBe(null);
    });

    it('should handle errors and roll back when removing a user fails', async () => {
      // Set up initial state
      store.users = [
        { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Admin' as UserRole, status: 'Active' as UserStatus, dateJoined: '2023-01-01' },
        { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'Manager' as UserRole, status: 'Active' as UserStatus, dateJoined: '2023-02-01' }
      ];
      
      // Mock the API to throw an error
      vi.mocked(mockApi.deleteUser).mockRejectedValue(new Error('API Error'));

      // Call the method
      await store.removeUser(1);

      // Verify the state was rolled back
      expect(store.users).toHaveLength(2);
      expect(store.users[0].id).toBe(1);
      expect(store.error).toBe('Failed to delete user');
    });

    it('should do nothing if user ID is not found', async () => {
      // Set up initial state
      store.users = [
        { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Admin' as UserRole, status: 'Active' as UserStatus, dateJoined: '2023-01-01' }
      ];
      
      // Spy on the deleteUser method
      const deleteUserSpy = vi.spyOn(mockApi, 'deleteUser');
      
      // Call the method with a non-existent ID
      await store.removeUser(999);

      // Verify the API was not called
      expect(deleteUserSpy).not.toHaveBeenCalled();
      
      // Verify state remains unchanged
      expect(store.users).toHaveLength(1);
    });
  });

  describe('updateSorting', () => {
    it('should toggle sort order when same field is selected', async () => {
      // Set initial state
      store.sortBy = 'name';
      store.sortOrder = 'asc';
      
      // Mock loadUsers
      vi.spyOn(store, 'loadUsers').mockImplementation(async () => {});

      // Call the method with the same field
      store.updateSorting('name');

      // Verify the state was updated correctly
      expect(store.sortBy).toBe('name');
      expect(store.sortOrder).toBe('desc');
    });

    it('should set sort order to asc when a new field is selected', async () => {
      // Set initial state
      store.sortBy = 'name';
      store.sortOrder = 'asc';
      
      // Mock loadUsers
      vi.spyOn(store, 'loadUsers').mockImplementation(async () => {});

      // Call the method with a new field
      store.updateSorting('email');

      // Verify the state was updated correctly
      expect(store.sortBy).toBe('email');
      expect(store.sortOrder).toBe('asc');
    });
  });
});