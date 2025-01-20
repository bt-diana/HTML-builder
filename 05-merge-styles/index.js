const fs = require('fs');
const path = require('path');

const srcPath = path.resolve(__dirname, 'styles');
const distPath = path.resolve(__dirname, 'project-dist');
fs.promises.mkdir(distPath, { recursive: true });

const filePath = path.resolve(distPath, 'bundle.css');
const writeStream = fs.createWriteStream(filePath);

fs.promises.readdir(srcPath, { withFileTypes: true }).then((files) => {
  files.forEach((file) => {
    if (!file.isDirectory()) {
      const { ext } = path.parse(file.name);
      if (ext === '.css') {
        const readStream = fs.createReadStream(
          path.resolve(srcPath, file.name),
        );
        readStream.setEncoding();
        readStream.on('data', (chunk) => {
          writeStream.write(chunk);
        });
      }
    }
  });
});
