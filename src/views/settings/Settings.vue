<template>
  <div>
    <h1>Settings</h1>
    <router-link to="/settings/account">Pengaturan Akun</router-link>
    <router-link to="/settings/app">Pengaturan Aplikasi</router-link>
    <router-link to="/settings/backup">Backup & Restore</router-link>
  </div>
</template>

<script>
export default {
  name: 'Settings',
};
</script>
