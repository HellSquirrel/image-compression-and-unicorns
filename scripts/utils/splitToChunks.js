const getRealLength = array =>
  array.reduce((result, value, index) => result + value, 0);

const splitToChunks = buff => {
  const signature = [];
  const chunks = [];
  const iter = buff.entries();
  let chunkNumber = 0;
  for (let [index, value] of iter) {
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

  return { signature, chunks: processedChunks };
};

module.exports = {
  splitToChunks,
};
