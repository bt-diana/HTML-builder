const fs = require('fs');
const path = require('path');

const templatePagePath = path.resolve(__dirname, 'template.html');

const distPath = path.resolve(__dirname, 'project-dist');
fs.promises.mkdir(distPath, { recursive: true });

const distHTMLPath = path.resolve(distPath, 'index.html');
fs.promises.copyFile(templatePagePath, distHTMLPath);
