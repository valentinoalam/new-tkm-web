import { defineStore } from 'pinia';

// Define the type for the state
interface UserInfoState {
  userId: string;
  username: string;
  email: string;
  isAuthenticated: boolean;
}

export const useUserInfoStore = defineStore('userInfo', {
  state: (): UserInfoState => ({
    userId: '',
    username: '',
    email: '',
    isAuthenticated: false,
  }),
  getters: {
    getUserFullName(state): string {
      return state.username;
    },
  },
  actions: {
    setUserInfo(userId: string, username: string, email: string) {
      this.userId = userId;
      this.username = username;
      this.email = email;
      this.isAuthenticated = true;
    },
    clearUserInfo() {
      this.userId = '';
      this.username = '';
      this.email = '';
      this.isAuthenticated = false;
    },
  },
});
