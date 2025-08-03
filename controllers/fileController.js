"use strict";

const fs = require("fs");
const path = require("path");

/**
 * Stream a file from the `public/` folder to the HTTP response.
 * @param {string} filename  Name of the file in ./public
 * @param {http.ServerResponse} res
 */
async function serveFile(filename, res) {
  const safeName = path.basename(filename);
  const filePath = path.join(__dirname, "../public", safeName);

  try {
    // Check existence and get size
    const stat = await fs.promises.stat(filePath);
    if (!stat.isFile()) throw new Error("Not a file");

    res.statusCode = 200;
    res.setHeader("Content-Type", getMimeType(filePath));
    res.setHeader("Content-Length", stat.size);

    // Pipe the file stream directly to the response
    const readStream = fs.createReadStream(filePath);
    readStream.pipe(res);

    readStream.on("error", (err) => {
      console.error("Stream error:", err);
      if (!res.headersSent) res.writeHead(500).end("Internal Server Error");
    });
  } catch (err) {
    res.statusCode = 404;
    res.setHeader("Content-Type", "text/plain; charset=utf-8");
    res.end(`❌ File not found: ${safeName}\n`);
  }
}

/**
 * Simple helper to map file extensions to MIME types.
 */
function getMimeType(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  switch (ext) {
    case ".html":
      return "text/html; charset=utf-8";
    case ".css":
      return "text/css; charset=utf-8";
    case ".js":
      return "application/javascript; charset=utf-8";
    case ".json":
      return "application/json; charset=utf-8";
    case ".png":
      return "image/png";
    case ".jpg":
    case ".jpeg":
      return "image/jpeg";
    default:
      return "application/octet-stream";
  }
}

module.exports = { serveFile };
