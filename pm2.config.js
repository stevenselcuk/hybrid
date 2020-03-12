module.exports = {
  apps: [
    {
      name: 'Hybrid Live',
      script: './dist/server.js',
      watch: false,
      env: {
        NODE_ENV: "development",
      },
      env_production: {
        NODE_ENV: "production",
      },
      // to calculate the max memory per process
      // max_memory_restart: '100M',
      // 4 instances
      instances: 'max',
      // cluster mode to load balance between each instances
      exec_mode: 'cluster',
      error_file: './logs/err.live.log',
      out_file: './logs/out.live.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss',
      merge_logs: true
    }
  ]
}
