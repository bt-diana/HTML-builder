const fs = require('fs/promises');
const path = require('path');

const dirPath = path.resolve(__dirname, 'files');
const newDirPath = path.resolve(__dirname, 'files-copy');
const fileNames = Array();

fs.mkdir(newDirPath, { recursive: true });

fs.readdir(dirPath, { withFileTypes: true }).then((files) => {
  files.forEach((file) => {
    if (!file.isDirectory()) {
      fileNames.push(file.name);
      fs.copyFile(
        path.resolve(dirPath, file.name),
        path.resolve(newDirPath, file.name),
      );
    }
  });
});

fs.readdir(newDirPath).then((files) => {
  files.forEach((file) => {
    if (!fileNames.includes(file)) {
      fs.unlink(path.resolve(newDirPath, file));
    }
  });
});
