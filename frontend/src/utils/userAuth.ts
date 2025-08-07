export interface User {
  id: string;
  name: string;
  username: string;
  email: string;
  password: string;
  createdAt: string;
}

// Mock data storage - in real app this would be handled by backend
let users: User[] = [];

// Initialize with admin user
const adminUser: User = {
  id: 'admin-001',
  name: 'Administrator',
  username: 'admin',
  email: 'admin@thegnan.com',
  password: 'thegnan01',
  createdAt: new Date().toISOString()
};

// Load users from localStorage on app start
export const loadUsers = (): User[] => {
  try {
    const storedUsers = localStorage.getItem('vteach_users');
    if (storedUsers) {
      users = JSON.parse(storedUsers);
      // Ensure admin user exists
      if (!users.find(u => u.username === 'admin')) {
        users.push(adminUser);
        saveUsers();
      }
    } else {
      users = [adminUser];
      saveUsers();
    }
    return users;
  } catch (error) {
    console.error('Error loading users:', error);
    users = [adminUser];
    saveUsers();
    return users;
  }
};

// Save users to localStorage
export const saveUsers = (): void => {
  try {
    localStorage.setItem('vteach_users', JSON.stringify(users));
  } catch (error) {
    console.error('Error saving users:', error);
  }
};

// Check if username exists
export const checkUsernameExists = (username: string): boolean => {
  loadUsers();
  return users.some(user => user.username.toLowerCase() === username.toLowerCase());
};

// Check if email exists
export const checkEmailExists = (email: string): boolean => {
  loadUsers();
  return users.some(user => user.email.toLowerCase() === email.toLowerCase());
};

// Register new user
export const registerUser = (userData: Omit<User, 'id' | 'createdAt'>): { success: boolean; message: string; user?: User } => {
  loadUsers();
  
  // Check if username already exists
  if (checkUsernameExists(userData.username)) {
    return { success: false, message: 'Username already exists. Please choose a different username.' };
  }
  
  // Check if email already exists
  if (checkEmailExists(userData.email)) {
    return { success: false, message: 'Email already exists. Please use a different email or sign in.' };
  }
  
  const newUser: User = {
    ...userData,
    id: `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    createdAt: new Date().toISOString()
  };
  
  users.push(newUser);
  saveUsers();
  
  return { success: true, message: 'Account created successfully!', user: newUser };
};

// Login user
export const loginUser = (usernameOrEmail: string, password: string): { success: boolean; message: string; user?: User; isAdmin?: boolean } => {
  loadUsers();
  
  // Find user by username or email
  const user = users.find(u => 
    u.username.toLowerCase() === usernameOrEmail.toLowerCase() || 
    u.email.toLowerCase() === usernameOrEmail.toLowerCase()
  );
  
  if (!user) {
    return { success: false, message: 'User not found. Please check your username/email or sign up for a new account.' };
  }
  
  if (user.password !== password) {
    return { success: false, message: 'Incorrect password. Please try again.' };
  }
  
  const isAdmin = user.username === 'admin';
  
  return { 
    success: true, 
    message: 'Login successful!', 
    user,
    isAdmin 
  };
};

// Get current user from localStorage
export const getCurrentUser = (): User | null => {
  try {
    const currentUser = localStorage.getItem('vteach_current_user');
    return currentUser ? JSON.parse(currentUser) : null;
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
};

// Set current user in localStorage
export const setCurrentUser = (user: User): void => {
  try {
    localStorage.setItem('vteach_current_user', JSON.stringify(user));
  } catch (error) {
    console.error('Error setting current user:', error);
  }
};

// Logout user
export const logoutUser = (): void => {
  localStorage.removeItem('vteach_current_user');
};

// Reset password
export const resetPassword = (email: string, newPassword: string): { success: boolean; message: string } => {
  loadUsers();
  
  const userIndex = users.findIndex(u => u.email.toLowerCase() === email.toLowerCase());
  
  if (userIndex === -1) {
    return { success: false, message: 'User not found.' };
  }
  
  // Update password
  users[userIndex].password = newPassword;
  saveUsers();
  
  return { success: true, message: 'Password reset successfully!' };
};

// Initialize users on module load
loadUsers();