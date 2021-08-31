import fs from 'fs';
import path from 'path';

const base = path.join(__dirname, '../entity');

const parse = (entity, sought, initPath, takeAll, callback) => {
  fs.readdirSync(initPath).forEach((name) => {
    const itemPath = path.join(initPath, name);
    const stat = fs.statSync(itemPath);

    if (stat && stat.isDirectory(itemPath)) {
      parse(entity, sought, itemPath, takeAll || name === sought, callback);
    } else {
      if (takeAll || name === `${sought}.js`) {
        callback(itemPath, takeAll ? path.basename(itemPath).split('.')[0] : entity);
      }
    }
  });
};

const crawler = (sought, callback) => {
  fs.readdirSync(base).forEach((name) =>
    parse(name, sought,  path.join(base, name), false, callback));
};

export default crawler;
