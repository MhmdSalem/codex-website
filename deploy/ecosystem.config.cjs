/**
 * PM2 ecosystem file — production process definition.
 * Run from the project root:  pm2 start deploy/ecosystem.config.cjs --env production
 */
module.exports = {
  apps: [
    {
      name: "codex-web",
      cwd: __dirname + "/..",
      script: "node_modules/next/dist/bin/next",
      args: "start -p 3000",
      instances: 1, // Switch to "max" once you have >=2 vCPUs
      exec_mode: "fork", // Use "cluster" with instances:"max"
      autorestart: true,
      watch: false,
      max_memory_restart: "1G",
      kill_timeout: 5000,
      listen_timeout: 8000,
      env: {
        NODE_ENV: "production",
        PORT: 3000,
        NODE_OPTIONS: "--max-old-space-size=1024",
      },
      env_production: {
        NODE_ENV: "production",
        PORT: 3000,
        NODE_OPTIONS: "--max-old-space-size=1024",
      },
      error_file: "/var/log/codex/web-error.log",
      out_file: "/var/log/codex/web-out.log",
      merge_logs: true,
      time: true,
    },
  ],
};
