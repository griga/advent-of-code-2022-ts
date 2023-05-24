import { readFile } from 'fs/promises';
import { resolve } from 'path';

const dataPath = resolve(process.cwd(), 'day04', 'day04.data');

async function main() {
  const raw = await readFile(dataPath, 'utf-8');
//   const raw = `2-4,6-8
// 2-3,4-5
// 5-7,7-9
// 2-8,3-7
// 6-6,4-6
// 2-6,4-8`;
  const perPair = raw.split(/\r?\n/);

  let count = 0;

  for (const pair of perPair) {
    const [elf0, elf1] = pair.split(',');
    const [elf0l, elf0h] = elf0.split('-').map((_) => parseInt(_));
    const [elf1l, elf1h] = elf1.split('-').map((_) => parseInt(_));
    if (!(elf0l > elf1h || elf1l > elf0h)) {
      count += 1;
    }
  }
  console.log(count);
}

main().catch(console.error);
