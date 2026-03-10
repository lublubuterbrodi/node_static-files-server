'use strict';

const http = require('http');
const fs = require('fs');
const path = require('path');

function createServer() {
  return http.createServer((req, res) => {
    const publicDir = path.resolve(__dirname, '../public');
    const requestUrl = req.url || '';

    if (requestUrl === '/file') {
      res.writeHead(200, {
        'Content-Type': 'text/plain',
      });
      res.end('Use /file/<path-to-file> to load files from public folder');

      return;
    }

    if (!requestUrl.startsWith('/file/')) {
      res.writeHead(400, {
        'Content-Type': 'text/plain',
      });
      res.end('Bad request');

      return;
    }

    const requestedPath = requestUrl.slice('/file/'.length);

    if (requestedPath.includes('//')) {
      res.writeHead(404, {
        'Content-Type': 'text/plain',
      });
      res.end('File not found');

      return;
    }

    if (requestedPath.includes('..')) {
      res.writeHead(400, {
        'Content-Type': 'text/plain',
      });
      res.end('Bad request');

      return;
    }

    const fileRelativePath =
      requestedPath === '' ? 'index.html' : requestedPath;
    const filePath = path.resolve(publicDir, fileRelativePath);

    if (!filePath.startsWith(publicDir)) {
      res.writeHead(400, {
        'Content-Type': 'text/plain',
      });
      res.end('Bad request');

      return;
    }

    fs.readFile(filePath, (error, data) => {
      if (error) {
        res.writeHead(404, {
          'Content-Type': 'text/plain',
        });
        res.end('File not found');

        return;
      }

      res.writeHead(200);
      res.end(data);
    });
  });
}

module.exports = {
  createServer,
};
