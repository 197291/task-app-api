#!/usr/bin/env node

'use strict';

// Load APM on production environment
const config = require('./config');
const App = require('./app');

const app = new App();

function handleError(err, ctx) {
  if (ctx == null) {
    console.error( err, '----Unhandled exception occured-----');
  }
}

async function terminate(signal) {
  try{
    await app.terminate();
  } finally {
    console.error(signal, '-------App is terminated------');
    process.kill(process.pid, signal);
  }
}

// Handle uncaught errors
app.on('error', handleError);

// Start server
if (!module.parent) {
  const server = app.listen(config.port, config.host, () => {
    console.log(`Server listen ${config.host} port ${config.port}`);
  });
  server.on('error', handleError);

  const errors = ['unhandledRejection', 'uncaughtException'];
  errors.map(error => {
    process.on(error, handleError);
  });

  const signals = ['SIGTERM', 'SIGINT', 'SIGUSR2'];
  signals.map(signal => {
    process.once(signal, () => terminate(signal));
  });
}

// Expose app
module.exports = app;