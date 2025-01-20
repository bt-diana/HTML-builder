const fs = require('fs/promises');
const path = require('path');

const dirPath = path.resolve(__dirname, 'files');
const newDirPath = path.resolve(__dirname, 'files-copy');

fs.mkdir(newDirPath, { recursive: true });

fs.readdir(dirPath).then((files) => {
  files.forEach((file) => {
    fs.copyFile(path.resolve(dirPath, file), path.resolve(newDirPath, file));
  });
});
