// stores/useModalStore.js
import { defineStore } from 'pinia';

export const useModalStore = defineStore('modal', {
  state: () => ({
    isVisible: false,
    currentContent: null,
    selectedId: null,
    selectedCategory: null,
    categoryColor: '',
    categoryName: '',
  }),
  actions: {
    openModal(content, transaction = null, category = null) {
      this.isVisible = true;
      this.currentContent = content;
      this.selectedTransaction = transaction;
      this.selectedCategory = category;
    },
    closeModal() {
      this.isVisible = false;
      this.currentContent = null;
      this.selectedTransaction = null;
      this.selectedCategory = null;
      this.categoryColor = '';
      this.categoryName = '';
    },
  },
});
