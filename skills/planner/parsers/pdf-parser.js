const pdfParse = require('pdf-parse');

async function parsePdf(buffer) {
  const normalizedBuffer = buffer && buffer.byteOffset !== undefined && buffer.buffer
    ? new Uint8Array(buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength))
    : buffer;
  const data = await pdfParse(normalizedBuffer);
  return data.text;
}

module.exports = { parsePdf };
