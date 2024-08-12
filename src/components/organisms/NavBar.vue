<template>
  <nav class="bg-blue-500 p-4 text-white flex justify-between items-center">
    <div class="container mx-auto flex justify-between">
      <a href="/" class="font-bold">Dashboard Masjid</a>
      <div class="flex space-x-4">
        <a href="/utilitas" class="hover:underline">Utilitas</a>
        <a href="/memo" class="hover:underline">Memo</a>
        <a href="/notifikasi" class="hover:underline">Notifikasi</a>
        <a href="/akun" class="hover:underline">Akun</a>
        <a href="/pengaturan" class="hover:underline">Pengaturan</a>
      </div>
    </div>
  </nav>
</template>

<script>
export default {
  name: 'Navbar',
};
</script>
