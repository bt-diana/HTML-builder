const fs = require('fs/promises');
const path = require('path');

const dirPath = path.resolve(__dirname, 'secret-folder');

fs.readdir(dirPath, { withFileTypes: true }).then((files) => {
  files.forEach((file) => {
    if (!file.isDirectory()) {
      const fileProps = path.parse(file.name);
      fs.stat(path.resolve(file.path, file.name)).then((fileStat) => {
        // <file name>-<file extension>-<file size></file>
        // example - txt - 128.369kb
        const sizeInKb = Math.round((fileStat.size / 1024) * 1000) / 1000;
        console.log(fileProps.name, '-', fileProps.ext, '-', sizeInKb + 'kb');
      });
    }
  });
});
