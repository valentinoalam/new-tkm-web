import { defineStore } from 'pinia';

export const useAuth = defineStore('credential', {
  state: () => ({
    token: null, // Store the authentication token
    user: null, // Store the user information (e.g., name, email)
  }),

  actions: {
    // Action to set credentials after login
    setCredentials(token, user) {
      this.token = token;
      this.user = user;
    },

    // Action to clear credentials on logout
    clearCredentials() {
      this.token = null;
      this.user = null;
    },

    // Action to check if user is authenticated
    isAuthenticated() {
      return !!this.token;
    },
  },

  // Optional: Add getters if needed
  getters: {
    getToken: state => state.token,
    getUser: state => state.user,
  },
});
