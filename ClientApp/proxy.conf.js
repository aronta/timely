const { env } = require("process");

//env.ASPNETCORE_URLS ? env.ASPNETCORE_URLS.split(';')[0] : 'http://localhost:23835';

const PROXY_CONFIG = [
  {
    context: ["/api"],
    target: "https://localhost:7094",
    secure: false,
    headers: {
      Connection: "Keep-Alive",
    },
    changeOrigin: true,
  },
];

module.exports = PROXY_CONFIG;
