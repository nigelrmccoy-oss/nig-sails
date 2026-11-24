import { defineConfig, type Plugin } from 'vite';
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
const root = path.dirname(fileURLToPath(import.meta.url));

function cesiumPublic(): Plugin {
  const copy = () => {
    let src: string;
    try {
      const pkg = path.dirname(require.resolve('cesium/package.json'));
      const a = path.join(pkg, 'Build/Cesium');
      const b = path.join(pkg, 'Source');
      src = fs.existsSync(path.join(a, 'Cesium.js')) || fs.existsSync(path.join(a, 'index.js')) ? a : b;
      const workers = path.join(pkg, 'Build/Cesium');
      if (fs.existsSync(workers)) src = workers;
    } catch {
      return;
    }
    const dest = path.join(root, 'public/cesium');
    fs.mkdirSync(dest, { recursive: true });
    for (const dir of ['Workers', 'Assets', 'ThirdParty', 'Widgets', 'Cesium.js']) {
      const from = path.join(src, dir);
      if (!fs.existsSync(from)) continue;
      fs.cpSync(from, path.join(dest, dir), { recursive: true });
    }
  };
  return { name: 'copy-cesium-assets', buildStart: copy, configureServer: copy };
}

export default defineConfig({
  base: './',
  server: {
    port: 5190,
    host: '127.0.0.1',
    strictPort: true,
    proxy: {
      '/ais': {
        target: 'http://127.0.0.1:5191',
        ws: true,
        changeOrigin: false,
      },
    },
  },
  preview: { port: 5190, host: '127.0.0.1' },
  define: { CESIUM_BASE_URL: JSON.stringify('./cesium/') },
  plugins: [cesiumPublic()],
  build: { target: 'es2022', chunkSizeWarningLimit: 5000 },
});
