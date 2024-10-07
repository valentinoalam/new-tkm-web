import { defineStore } from 'pinia';

export const useAuth = defineStore('credential', {
  state: () => ({
    accessToken: localStorage.getItem('tkm_at') || null, // Store the authentication token
    refreshToken: localStorage.getItem('tkm_rt') || null,
    userInfo: localStorage.getItem('userInfo')
      ? JSON.parse(localStorage.getItem('userInfo'))
      : {}, // Store the user information (e.g., name, email)
  }),

  actions: {
    // Action to set credentials after login
    setCredentials(tokens, user) {
      this.accessToken = tokens.access_token;
      this.refreshToken = tokens.refresh_token;
      this.userInfo = user;
      // Store the token in local storage
      localStorage.setItem('tkm_at', tokens.access_token);
      localStorage.setItem('userInfo', JSON.stringify(user));
    },

    // Action to clear credentials on logout
    clearCredentials() {
      this.accessToken = null;
      this.refreshToken = null;
      this.userInfo = null;
      localStorage.clear();
    },

    // Action to check if user is authenticated
    isAuthenticated() {
      return !!this.accessToken;
    },
  },

  // Optional: Add getters if needed
  getters: {
    getAccessToken: state => state.accessToken,
    getRefreshToken: state => state.refreshToken,
    getUserInfo: state => state.userInfo,
  },
});
