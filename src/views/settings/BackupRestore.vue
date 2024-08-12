<template>
  <div>
    <h1>Backup & Restore</h1>
    <!-- Tombol untuk backup dan restore data -->
    <button @click="backupData">Backup Data</button>
    <button @click="restoreData">Restore Data</button>
  </div>
</template>

<script>
import { useMainStore } from '@/stores/main';

export default {
  name: 'BackupRestore',
  setup() {
    const store = useMainStore();

    const backupData = () => {
      // Logic untuk backup data
      store.backupData();
    };

    const restoreData = () => {
      // Logic untuk restore data
      store.restoreData();
    };

    return { backupData, restoreData };
  },
};
</script>

2. **Tambahkan Tindakan di Pinia Store**: - **`stores/main.js`**: ```javascript
import { defineStore } from 'pinia' export const useMainStore =
defineStore('main', { state: () => ({ username: 'user123', email:
'user@example.com', theme: 'light', language: 'en', // Tambahkan state lainnya
sesuai kebutuhan }), actions: { updateAccount({ username, email, password }) {
// Logic untuk memperbarui akun pengguna this.username = username this.email =
email if (password) { // Update password jika ada } alert('Akun berhasil
diperbarui') }, updateSettings({ theme, language }) { // Logic untuk memperbarui
pengaturan aplikasi this.theme = theme this.language = language
alert('Pengaturan berhasil diperbarui') }, backupData() { // Logic untuk backup
data alert('Data berhasil di-backup') }, restoreData() { // Logic untuk restore
data alert('Data berhasil di-restore') } } }) ``` 3. **Tambahkan Route di
Router**: - **`router/index.js`**: ```javascript import { createRouter,
createWebHistory } from 'vue-router' import Dashboard from
'../views/Dashboard.vue' import Inventory from
'../views/inventory/Inventory.vue' import InventoryHistory from
'../views/inventory/InventoryHistory.vue' import Activities from
'../views/activities/Activities.vue' import RegisterActivity from
'../views/activities/RegisterActivity.vue' import ManageParticipants from
'../views/activities/ManageParticipants.vue' import DocumentActivity from
'../views/activities/DocumentActivity.vue' import Qurban from
'../views/qurban/Qurban.vue' import ManageQurban from
'../views/qurban/ManageQurban.vue' import RegisterQurban from
'../views/qurban/RegisterQurban.vue' import QurbanDistribution from
'../views/qurban/QurbanDistribution.vue' import QurbanHistory from
'../views/qurban/QurbanHistory.vue' import Zakat from '../views/zakat/Zakat.vue'
import ManageMuzakki from '../views/zakat/ManageMuzakki.vue' import ZakatReceipt
from '../views/zakat/ZakatReceipt.vue' import ZakatDistribution from
'../views/zakat/ZakatDistribution.vue'
