import Jimp  from 'jimp';
import fs  from 'fs';

const font = [];

const args = process.argv.reduce((rest, arg) => {
  if (arg.includes('--')) {
    const [key, value] = arg.replace('--', '').split('=');
    rest[key] = value;
  }
  return rest;
}, {});

const height = args.height || 5;
const width = args.width || 5;
const outputFile = args.output || 'font.js';
console.log(args);

const zeroPad = (num, places) => String(num).padStart(places, '0');

function printLetter(letter) {
  if (letter === '') {
    return;
  }
  console.log('=====', letter);
  const binary = zeroPad(parseInt(letter, 36).toString(2), 25);
  let line = '';
  binary.split('').forEach(bit => {
    if (bit === '1') {
      line += '██';
    } else {
      line += '  ';
    }
    if (line.length === 10) {
      console.log(line);
      line = '';
    }
  });
}

Jimp.read('./font.png', function(readError, file) {
  if (readError) {
    throw readError;
  }

  const rows = file.getHeight() / 5;
  const cols = file.getWidth() / 5;

  for(let row = 0; row < rows; row++) {
    for(let col = 0; col < cols; col ++) {
      let letter = '';
      for(let y = 0; y < height; y++) {
        for(let x = 0; x < width; x++) {
          const color = Jimp.intToRGBA(
            file.getPixelColor(
              x + col * width,
              y + row * height,
            )
          ).r;
          letter += color === 255 ? '1' : '0';
        }
      }
      const compressedLetter = parseInt(letter, 2).toString(36);
      font.push(compressedLetter);
    }
  }

  const cleanFont = font.map(l => l === '0' ? '' : l);
  cleanFont.forEach(letter => {
    printLetter(letter);
  });

  const fontString = cleanFont.join(',');
  console.log(fontString.length, 'bytes');
  fs.readFile(outputFile, 'utf8', (err, data) => {
    if (err) {
      // File doesn't exist, so create a new one
      console.log('Creating', outputFile);
      fs.writeFile(
        outputFile,
        '/* Generated file. Do not edit. */' +
        `export const font = '${fontString}'.split(',');`,
        writeError => {
        if (writeError) {
          throw writeError;
        }
      });
    } else {
      // File exists, inject string
      console.log('Injecting into', outputFile);
      fs.writeFile(
        outputFile,
        data.replace(
          /\/\* font-start \*\/.*\/\* font-end \*\//,
          `/* font-start */'${fontString}'/* font-end */`
        ),
        writeError => {
        if (writeError) {
          throw writeError;
        }
      });
    }
  });
});


