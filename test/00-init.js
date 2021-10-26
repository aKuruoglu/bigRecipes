import { Module } from 'module';
import path from 'path';

process.env.NODE_PATH = [
  process.env.NODE_PATH,
  path.join(__dirname, '../src'),
]
  .filter(Boolean)
  .join(process.platform === 'win32' ? ';' : ':');

Module._initPaths();

before(async () => {
  await require('server.js').default();
});
