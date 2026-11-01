/**
 * PM2 process file for running the site on a VPS (CloudPanel "Node.js Site").
 *
 *   npm ci && npm run build
 *   pm2 start ecosystem.config.cjs
 *   pm2 save
 *
 * The port must match the "App Port" chosen when the site was created in
 * CloudPanel; CloudPanel's nginx proxies the domain to it.
 */
module.exports = {
  apps: [
    {
      name: "codex-tech",
      cwd: __dirname,
      script: "node_modules/next/dist/bin/next",
      args: "start -p 3000",
      instances: 1,
      exec_mode: "fork",
      max_memory_restart: "1G",
      env: {
        NODE_ENV: "production",
      },
    },
  ],
};
