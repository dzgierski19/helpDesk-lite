const defaultTarget = 'http://127.0.0.1:8000';
const target = process.env.API_PROXY_TARGET || defaultTarget;

module.exports = {
  '/api': {
    target,
    secure: false,
    changeOrigin: true,
    logLevel: 'debug',
  },
};
