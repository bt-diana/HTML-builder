const fs = require('fs');
const path = require('path');
const readline = require('readline');

//create output file
const filePath = path.resolve(__dirname, 'input.txt');
const writeStream = fs.createWriteStream(filePath);

//output greatings
const rl = readline.createInterface(process.stdin, process.stdout);
rl.write('Hello! Type your message:\n');

//wait for the input
rl.on('line', (input) => {
  if (input === 'exit') {
    rl.emit('SIGINT');
  } else {
    writeStream.write(input);
  }
});

//output farewell
rl.on('SIGINT', () => {
  rl.write('Good bye!');
  rl.close();
});
