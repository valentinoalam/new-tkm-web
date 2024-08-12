import axios from 'axios';
import { defineStore } from 'pinia';
import { computed, ref } from 'vue';

export const useMainStore = defineStore('main', () => {
  const userName = ref('John Doe');
  const userEmail = ref('doe.doe.doe@example.com');

  const userAvatar = computed(
    () =>
      `https://api.dicebear.com/7.x/avataaars/svg?seed=${userEmail.value.replace(
        /[^a-z0-9]+/gi,
        '-'
      )}`
  );

  const isFieldFocusRegistered = ref(false);

  const clients = ref([]);
  const history = ref([]);

  function setUser(payload) {
    if (payload.name) {
      userName.value = payload.name;
    }
    if (payload.email) {
      userEmail.value = payload.email;
    }
  }

  function fetchSampleClients() {
    axios
      .get(`data-sources/clients.json?v=3`)
      .then(result => {
        clients.value = result?.data?.data;
      })
      .catch(error => {
        alert(error.message);
      });
  }

  function fetchSampleHistory() {
    axios
      .get(`data-sources/history.json`)
      .then(result => {
        history.value = result?.data?.data;
      })
      .catch(error => {
        alert(error.message);
      });
  }

  return {
    userName,
    userEmail,
    userAvatar,
    isFieldFocusRegistered,
    clients,
    history,
    setUser,
    fetchSampleClients,
    fetchSampleHistory,
  };
});

// export const useMainStore = defineStore('main', {
//   state: () => ({
//     inventoryHistory: [],
//     activities: [],
//     participants: [],
//     activityDocumentation: [],
//     qurbanAnimals: [],
//     qurbanParticipants: [],
//     qurbanDistribution: [],
//     qurbanHistory: [],
//     muzakki: [],
//     zakatReceipts: [],
//     zakatDistribution: [],
//     zakatReports: [],
//     cashFlow: [],
//     financialReports: [],
//     budgets: [],
//     users: [],
//     roles: [],
//     positions: [],
//     username: 'user123',
//     email: 'user@example.com',
//     theme: 'light',
//     language: 'en',
//   }),
//   actions: {
//     updateAccount({ username, email, password }) {
//       // Logic untuk memperbarui akun pengguna
//       this.username = username
//       this.email = email
//       if (password) {
//         // Update password jika ada
//       }
//       alert('Akun berhasil diperbarui')
//     },
//     updateSettings({ theme, language }) {
//       // Logic untuk memperbarui pengaturan aplikasi
//       this.theme = theme
//       this.language = language
//       alert('Pengaturan berhasil diperbarui')
//     },
//     backupData() {
//       // Logic untuk backup data
//       alert('Data berhasil di-backup')
//     },
//     restoreData() {
//       // Logic untuk restore data
//       alert('Data berhasil di-restore')
//     },
//   },
// })
