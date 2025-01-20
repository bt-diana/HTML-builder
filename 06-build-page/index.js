const fs = require('fs');
const path = require('path');
const readline = require('readline');

const templatePagePath = path.resolve(__dirname, 'template.html');
const templatePageReadStream = fs.createReadStream(templatePagePath);

const distPath = path.resolve(__dirname, 'project-dist');
fs.promises.mkdir(distPath, { recursive: true });

const distHTMLPath = path.resolve(distPath, 'index.html');
const distPageWriteStream = fs.createWriteStream(distHTMLPath);

const rl = readline.createInterface(templatePageReadStream);

// const templates = Array();

rl.on('line', (line) => {
  const lineTemplates = [...line.matchAll(/{{(.+?)}}/g)];
  if (lineTemplates.length > 0) {
    [...line.matchAll(/(?:^|}})(.*?)(?:{{|$)/g)].forEach((match) => {
      distPageWriteStream.write(match[1]);
    });
  } else {
    distPageWriteStream.write(line);
  }
  distPageWriteStream.write('\n');
});
