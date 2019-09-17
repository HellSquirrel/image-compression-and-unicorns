const fs = require('fs');
const path = require('path');
const { splitToChunks } = require('./utils/splitToChunks');
const { aperture } = require('ramda');

const getRealLength = array =>
  array.reduce((result, value) => result + value, 0);

const analyzeFile = fileName => {
  const buff = fs.readFileSync(path.resolve(__dirname, fileName));
  return splitToChunks(buff);
};

analyzeFile('./samples/rect_optimized.png');

const getColorType = number => {
  const dict = {
    0: 'Greyscale',
    2: 'TrueColor',
    3: 'Indexed-colour',
    4: 'Greyscale with alpha',
    5: 'Truecolour with alpha',
  };

  return dict[String(number)];
};

const getMetaData = chunks => {
  const IHDR = chunks.find(c => c.chunkType === 'IHDR');
  const { chunkData } = IHDR;
  const width = getRealLength(chunkData.slice(0, 4));
  const height = getRealLength(chunkData.slice(4, 8));
  const bitDepth = chunkData[8];
  const colorType = getColorType(chunkData[9]);
  const compressionMethod = chunkData[10];
  const filterMethod = chunkData[11];
  const interlaceMethod = chunkData[12];

  return {
    width,
    height,
    bitDepth,
    colorType,
    compressionMethod,
    filterMethod,
    interlaceMethod,
  };
};

const getPallete = chunks => {
  const PLTE = chunks.find(c => c.chunkType === 'PLTE');
  if (!PLTE) return null;
  const { chunkData } = PLTE;
  return aperture(3, chunkData);
};

console.log(
  getMetaData(analyzeFile('./samples/rect_optimized.png').chunks),
  getPallete(analyzeFile('./samples/rect_optimized.png').chunks)
);
