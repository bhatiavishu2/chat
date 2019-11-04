module.exports = {
    apps : [{
      name       : "api-app",
      script     : "./server/index.js",
      instances  : 1,
      exec_mode  : "cluster"
    }]
  }