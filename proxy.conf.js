const PROXY_CONFIG = [
  {
    context: ['/api/v1'],
    target: 'http://punchlistapi-env.eba-5symj6wc.us-east-1.elasticbeanstalk.com/',
    // target: 'http://localhost:8080/',
    secure: false,
    logLevel: 'debug'
  }
];

module.exports = PROXY_CONFIG;
