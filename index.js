"use strict";

const http = require("http");
const url = require("url");

const { serveFile } = require("./controllers/fileController");
const { logRequest } = require("./utils/logger");

const PORT = process.env.PORT || 3000;

const server = http.createServer(async (req, res) => {
  logRequest(req);

  const parsed = url.parse(req.url, true);
  if (parsed.pathname === "/file" && parsed.query.name) {
    // /file?name=example.txt
    await serveFile(parsed.query.name, res);
  } else {
    res.statusCode = 404;
    res.setHeader("Content-Type", "text/plain; charset=utf-8");
    res.end("❌ Not Found\n");
  }
});

server.listen(PORT, () => {
  console.log(`🚀 Server listening on http://localhost:${PORT}/`);
});
    