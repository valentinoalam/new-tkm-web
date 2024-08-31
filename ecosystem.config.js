export const apps = [
  {
    name: 'kelolamasjid-web', // Replace with a descriptive name
    script: 'node',
    args: 'serve.js',
    watch: false, // Set to true if you want PM2 to restart the app on file changes
    env: {
      NODE_ENV: 'production',
    },
  },
];
