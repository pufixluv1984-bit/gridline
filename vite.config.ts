import { defineConfig, type Plugin } from 'vite';
import fs from 'node:fs';
import path from 'node:path';
import react from '@vitejs/plugin-react';

function sharedStatePlugin(): Plugin {
  const file = path.resolve(process.cwd(), 'data.json');
  const read = () => fs.existsSync(file) ? fs.readFileSync(file, 'utf8') : JSON.stringify({});
  const write = (body:string) => { JSON.parse(body); fs.writeFileSync(file, `${JSON.stringify(JSON.parse(body), null, 2)}\n`, 'utf8'); };
  return {
    name: 'gridline-shared-state',
    configureServer(server) {
      server.middlewares.use('/api/state', (req, res, next) => {
        if (req.method === 'GET') { res.setHeader('Content-Type','application/json'); res.end(read()); return; }
        if (req.method === 'POST') {
          let body=''; req.on('data', chunk => { body += chunk; }); req.on('end', () => { try { write(body); res.statusCode=204; res.end(); } catch { res.statusCode=400; res.end('Invalid JSON'); } }); return;
        }
        next();
      });
    },
    generateBundle() { this.emitFile({ type:'asset', fileName:'data.json', source:read() }); }
  };
}

export default defineConfig({ base:'/gridline/', plugins:[sharedStatePlugin(), react()] });
