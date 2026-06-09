// Production entry point for running the Next.js app on cPanel's
// "Setup Node.js App" (which launches a startup FILE, not the `next start` CLI).
//
// cPanel sets PORT; we bind to it. Run `npm run build` first so `.next` exists.
const next = require('next');

const dev = false; // always production on the server
const port = parseInt(process.env.PORT || '3000', 10);
const hostname = '0.0.0.0';

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();
const { createServer } = require('http');

app.prepare().then(() => {
  createServer((req, res) => handle(req, res)).listen(port, hostname, (err) => {
    if (err) throw err;
    // eslint-disable-next-line no-console
    console.log(`Frontend ready on http://${hostname}:${port}`);
  });
});
