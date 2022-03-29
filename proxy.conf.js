const PROXY_CONFIG = [
  {
    context: ['/v1'],
    target: 'http://localhost:8080/api/',
    secure: false,
    logLevel: 'debug'
  }
];

module.exports = PROXY_CONFIG;
