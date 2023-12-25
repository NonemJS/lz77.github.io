    // Функция для сжатия текста в LZ77 с учетом регистра букв
    function lz77Compress(text, caseSensitive) {
        // Инициализация словаря и буфера
        const dictSize = 4096; // Размер словаря
        const buffSize = 16; // Размер буфера
        let dictionary = ""; // Словарь
        let buffer = text.slice(0, buffSize); // Буфер
        let result = []; // Результат
        let pos = 0; // Позиция в тексте
        // Пока буфер не пуст
        while (buffer) {
          // Поиск наибольшего совпадения в словаре
          let match = ""; // Совпадение
          let offset = 0; // Смещение
          let length = 0; // Длина
          for (let i = dictionary.length - 1; i >= 0; i--) {
            // Если символ в словаре совпадает с первым символом в буфере
            if (caseSensitive) { // Если учитывать регистр букв
              if (dictionary[i] === buffer[0]) { // Сравнение символов как есть
                // Проверка дальнейшего совпадения
                let j = i + 1; // Индекс в словаре
                let k = 1; // Индекс в буфере
                let temp = dictionary[i]; // Временное совпадение
                // Пока не достигнут конец словаря или буфера
                while (j < dictionary.length && k < buffer.length) {
                  // Если символы совпадают
                  if (dictionary[j] === buffer[k]) {
                    // Добавление символа к временному совпадению
                    temp += dictionary[j];
                    // Переход к следующим символам
                    j++;
                    k++;
                  } else {
                    // Прерывание цикла
                    break;
                  }
                }
                // Если длина временного совпадения больше длины текущего совпадения
                if (temp.length > match.length) {
                  // Обновление текущего совпадения, смещения и длины
                  match = temp;
                  offset = dictionary.length - i;
                  length = match.length;
                }
              }
            } else { // Если не учитывать регистр букв
              if (dictionary[i].toLowerCase() === buffer[0].toLowerCase()) { // Сравнение символов в нижнем регистре
                // Проверка дальнейшего совпадения
                let j = i + 1; // Индекс в словаре
                let k = 1; // Индекс в буфере
                let temp = dictionary[i]; // Временное совпадение
                // Пока не достигнут конец словаря или буфера
                while (j < dictionary.length && k < buffer.length) {
                  // Если символы совпадают в нижнем регистре
                  if (dictionary[j].toLowerCase() === buffer[k].toLowerCase()) {
                    // Добавление символа к временному совпадению
                    temp += dictionary[j];
                    // Переход к следующим символам
                    j++;
                    k++;
                  } else {
                    // Прерывание цикла
                    break;
                  }
                }
                // Если длина временного совпадения больше длины текущего совпадения
                if (temp.length > match.length) {
                  // Обновление текущего совпадения, смещения и длины
                  match = temp;
                  offset = dictionary.length - i;
                  length = match.length;
                }
              }
            }
          }
          // Добавление объекта в результат
          result.push({offset, length, char: buffer[length]});
          // Обновление словаря и буфера
          dictionary += buffer.slice(0, length + 1);
          if (dictionary.length > dictSize) {
            dictionary = dictionary.slice(-dictSize);
          }
          pos += length + 1;
          buffer = text.slice(pos, pos + buffSize);
        }
        return result;
      }
      
      // Тестирование функции
      // let text = "В лесу родилась Ёлочка, в лесу она росла. Зимой и летом стройная, зелёная была.";
      // let compressed = lz77Compress(text, caseSensitive=false);
      // console.log(compressed);
      
      function compressText() {
            const inputText = document.getElementById('inputText').value;
            const dictSize = parseInt(document.getElementById('dictionarySize').value);
            const buffSize = parseInt(document.getElementById('bufferSize').value);
            // const caseSensitive = document.getElementById('caseSensitive').checked;
            
            //const compressed = lz77Compress(inputText, dictSize, buffSize, caseSensitive);
            const compressed = lz77Compress(inputText, dictSize, buffSize);
            let compressedText = '';
            
            for (let item of compressed) {
              let char = item.char || '';
              compressedText += `<${item.offset};${item.length};${char}>`;
            }
      
            document.getElementById('compressedResult').innerText = compressedText;
          }


// Функция декодирования текста LZ77
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
        const substring = decompressedText.substr(startIndex, length);
        decompressedText += substring + char;
      }
    }

    return decompressedText;
  }

  // Функция декодирования и отображения расшифрованного текста
  function decompressText() {
    const compressedText = document.getElementById('compressedText').value;
    const decompressedText = lz77Decode(compressedText);
    document.getElementById('decompressedResult').innerText = decompressedText;
  }
