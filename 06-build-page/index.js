const fs = require('fs');
const path = require('path');

const templatePagePath = path.resolve(__dirname, 'template.html');
const distPath = path.resolve(__dirname, 'project-dist');
fs.promises.mkdir(distPath, { recursive: true });
const distPagePath = path.resolve(distPath, 'index.html');
const distPageWriteStream = fs.createWriteStream(distPagePath);

fs.promises.readFile(templatePagePath).then((buffer) => {
  const templates = [
    ...buffer.toString().matchAll(/(?<match>{{(?<component>.+?)}})/gm),
  ];

  distPageWriteStream.write(buffer.subarray(0, templates[0].index));
  templates.forEach(async (match, index) => {
    const nextIndex = templates[index + 1]?.index;
    const componentPath = path.resolve(
      __dirname,
      'components',
      match.groups.component + '.html',
    );
    await fs.promises.readFile(componentPath).then((componentBuffer) => {
      distPageWriteStream.write(componentBuffer);
      if (nextIndex)
        distPageWriteStream.write(
          buffer.subarray(match.index + match.groups.match.length, nextIndex),
        );
      else {
        distPageWriteStream.write(
          buffer.subarray(match.index + match.groups.match.length),
        );
      }
    });
  });
});

const srcPath = path.resolve(__dirname, 'styles');
fs.promises.mkdir(distPath, { recursive: true });

const filePath = path.resolve(distPath, 'style.css');
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

const assetsPath = path.resolve(__dirname, 'assets');
const distAssetsPath = path.resolve(distPath, 'assets');
copyFolder(assetsPath, distAssetsPath);

function copyFolder(dirPath, newDirPath) {
  const fileNames = Array();

  fs.promises.mkdir(newDirPath, { recursive: true });

  fs.promises
    .readdir(dirPath, { withFileTypes: true })
    .then((files) => {
      files.forEach((file) => {
        fileNames.push(file.name);
        if (!file.isDirectory()) {
          fs.promises.copyFile(
            path.resolve(dirPath, file.name),
            path.resolve(newDirPath, file.name),
          );
        } else {
          copyFolder(
            path.resolve(file.path, file.name),
            path.resolve(newDirPath, file.name),
          );
        }
      });
    })
    .then(() => {
      fs.promises.readdir(newDirPath, { withFileTypes: true }).then((files) => {
        files.forEach((file) => {
          if (!fileNames.includes(file.name)) {
            if (!file.isDirectory()) {
              fs.promises.unlink(path.resolve(file.path, file.name));
            } else {
              deleteFolder(path.resolve(file.path, file.name));
            }
          }
        });
      });
    });
}

function deleteFolder(folderPath) {
  fs.promises
    .readdir(folderPath, { withFileTypes: true })
    .then((files) => {
      files.forEach((file) => {
        if (!file.isDirectory()) {
          fs.promises.unlink(path.resolve(file.path, file.name));
        } else {
          deleteFolder(path.resolve(file.path, file.name));
        }
      });
    })
    .then(() => {
      fs.promises.rmdir(folderPath);
    });
}
