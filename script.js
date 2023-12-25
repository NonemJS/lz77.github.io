function lz77Compress(text, dictSize, buffSize, caseSensitive) {
  let dictionary = "";
  let buffer = text.slice(0, buffSize);
  let result = [];
  let pos = 0;

  while (buffer) {
      let match = "";
      let offset = 0;
      let length = 0;

      for (let i = dictionary.length - 1; i >= 0; i--) {
          if (
              (caseSensitive && dictionary[i] === buffer[0]) ||
              (!caseSensitive && dictionary[i].toLowerCase() === buffer[0].toLowerCase())
          ) {
              let j = i + 1;
              let k = 1;
              let temp = dictionary[i];

              while (j < dictionary.length && k < buffer.length) {
                  if (
                      (caseSensitive && dictionary[j] === buffer[k]) ||
                      (!caseSensitive && dictionary[j].toLowerCase() === buffer[k].toLowerCase())
                  ) {
                      temp += dictionary[j];
                      j++;
                      k++;
                  } else {
                      break;
                  }
              }

              if (temp.length > match.length) {
                  match = temp;
                  offset = dictionary.length - i;
                  length = match.length;
              }
          }
      }

      result.push({ offset, length, char: buffer[length] });
      dictionary += buffer.slice(0, length + 1);

      if (dictionary.length > dictSize) {
          dictionary = dictionary.slice(-dictSize);
      }

      pos += length + 1;
      buffer = text.slice(pos, pos + buffSize);
  }

  return result;
}

function compressText() {
  const inputText = document.getElementById('inputText').value;
  const dictSize = parseInt(document.getElementById('dictionarySize').value);
  const buffSize = parseInt(document.getElementById('bufferSize').value);
  const caseSensitive = document.getElementById('caseSensitive').checked;

  const compressed = lz77Compress(inputText, dictSize, buffSize, caseSensitive);
  let compressedText = '';

  for (let item of compressed) {
      let char = item.char || '';
      compressedText += `<${item.offset};${item.length};${char}>`;
  }

  document.getElementById('compressedResult').innerText = compressedText;
}

function lz77Decode(compressedText) {
  let decompressedText = '';
  const regex = /<(\d+);(\d+);(.?)>/g;
  let match;

  while ((match = regex.exec(compressedText)) !== null) {
      const offset = parseInt(match[1]);
      const length = parseInt(match[2]);
      const char = match[3];

      if (offset === 0 && length === 0) {
          decompressedText += char;
      } else {
          const startIndex = decompressedText.length - offset;
          let substring = '';

          if (startIndex >= 0) {
              for (let i = 0; i < length; i++) {
                  substring += decompressedText[startIndex + i];
              }
          }

          decompressedText += substring + char;
      }
  }

  return decompressedText;
}

function decompressText() {
  const compressedText = document.getElementById('compressedText').value;
  const decompressedText = lz77Decode(compressedText);
  document.getElementById('decompressedResult').innerText = decompressedText;
}
