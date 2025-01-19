const fs = require('fs');
const path = require('path');

const filePath = path.resolve(__dirname, 'text.txt');
const readStream = fs.createReadStream(filePath);

//method №1
readStream.pipe(process.stdout);

//method №2
// readStream.on('data', (chunk) => {
//   console.log(chunk.toString());
// });

//method №3
// readStream.setEncoding();
// readStream.on('data', (chunk) => {
//   process.stdout.write(chunk);
// });
