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
      console.log(index);
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
