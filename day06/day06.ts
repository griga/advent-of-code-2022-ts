import { readFile } from 'fs/promises';
import { resolve } from 'path';

const dataPath = resolve(process.cwd(), 'day06', 'day06.data');

async function main() {
  const raw = await readFile(dataPath, 'utf-8');
  // const raw = `zcfzfwzzqfrljwzlrfnpqdbhtmscgvjw`
  const markerSymbols = []
  let result = undefined
  for (let idx = 0; idx < raw.length; idx++) {
    const char = raw[idx];
    markerSymbols.push(char)
    const checkSymbols = markerSymbols.slice(markerSymbols.length - 14)
    const isMarker = checkSymbols.filter((item, idx, array) => array.indexOf(item) === idx).length === 14
    if (isMarker) {
      result = idx + 1
      break
    }

  }

  console.log(raw.length, result);

}

main().catch(console.error);
