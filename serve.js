import { createServer } from 'http-server';

const server = createServer({
  root: './dist',
  port: 43000,
  index: 'index.html',
});

server.listen(43000, () => {
  console.log('Server running on port 43000');
});
