const fs = require('fs');
const path = require('path');

const distPath = path.resolve(__dirname, 'project-dist');
fs.promises.mkdir(distPath, { recursive: true });
