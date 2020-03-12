module.exports = {
    openapi: '3.0.2',
    // Like the one described here: https://swagger.io/specification/#infoObject
    info: {
      // API informations (required)
      title: 'Hybrid API', // Title (required)
      version: '1.0.0', // Version (required)
      description: 'Hybrid REST API Documentation' // Description (optional)
    },
    host: `localhost:3000`, // Host (optional)
    basePath: '/__/', // Base path (optional)
  // List of files to be processes. You can also set globs './routes/*.js'
  apis: ['./src/app/**/*.js']
}
