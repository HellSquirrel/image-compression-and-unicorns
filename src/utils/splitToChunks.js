import aperture from 'ramda/src/aperture';

const getRealLength = array =>
  array.reduce(
    (result, value, index) =>
      result + value * 2 ** ((array.length - index - 1) * 4),
    0
  );

export const splitToChunks = buff => {
  const signature = [];
  const chunks = [];
  const iter = new Int8Array(buff).entries();
  let chunkNumber = 0;
  let size = 0;
  for (let [index, value] of iter) {
    size++;
    if (index < 8) {
      signature.push(value);
    } else {
      const currentChunk = chunks[chunkNumber];
      if (!currentChunk) {
        chunks[chunkNumber] = {
          chunkLength: [value],
          chunkType: [],
          chunkData: [],
          CRC: [],
        };
      } else {
        const { chunkLength, chunkType, chunkData, CRC } = currentChunk;
        if (chunkLength.length < 4) {
          chunkLength.push(value);
        } else {
          const length = getRealLength(chunkLength);
          if (chunkType.length < 4) {
            chunkType.push(value);
          } else if (chunkData.length < length) {
            chunkData.push(value);
          } else if (CRC.length < 4) {
            CRC.push(value);
            if (CRC.length === 4) {
              chunkNumber++;
            }
          }
        }
      }
    }
  }

  const processedChunks = chunks.map(c => ({
    ...c,
    chunkLength: getRealLength(c.chunkLength),
    chunkType: c.chunkType.map(ct => String.fromCharCode(ct)).join(''),
  }));

  return { signature, chunks: processedChunks, size };
};

const getColorType = number => {
  const dict = {
    0: 'Greyscale',
    2: 'TrueColor',
    3: 'Indexed-colour',
    4: 'Greyscale with alpha',
    6: 'Truecolour with alpha',
  };

  return dict[String(number)];
};

export const getMetaData = chunks => {
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

export const getPallete = chunks => {
  const PLTE = chunks.find(c => c.chunkType === 'PLTE');
  if (!PLTE) return null;
  const { chunkData } = PLTE;
  return aperture(3, chunkData);
};
