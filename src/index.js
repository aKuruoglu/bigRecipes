import { Module } from 'module';

process.env.NODE_PATH = [
  process.env.NODE_PATH,
  __dirname,
]
  .filter(Boolean)
  .join(process.platform === 'win32' ? ';' : ':');

Module._initPaths();

require('server.js').default();
