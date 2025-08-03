"use strict";

/**
 * Simple console logger with timestamp.
 * @param {http.IncomingMessage} req
 */
function logRequest(req) {
  const now = new Date().toISOString();
  console.log(`[${now}] ${req.method} ${req.url}`);
}

module.exports = { logRequest };
