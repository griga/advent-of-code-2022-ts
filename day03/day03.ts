import { readFile } from 'fs/promises';
import { resolve } from 'path';

const dataPath = resolve(process.cwd(), 'day03', 'day03.data');

function getItemPriority(char: string) {
  const charCode = char.charCodeAt(0);
  return charCode < 91 ? charCode - 38 : charCode - 96;
}

async function main() {
  const raw = await readFile(dataPath, 'utf-8');
//   const raw = `vJrwpWtwJgWrhcsFMMfFFhFp
// jqHRNqRjqzjGDLGLrsFMfFZSrLrFZsSL
// PmmdzqPrVvPwwTWBwg
// wMqvLMZHhHMvwLHjbvcjnnSBnvTQFn
// ttgJtRGJQctTZtZT
// CrZsJsPPZsGzwwsLwLmpwMDw`;
  const perRucksack = raw.split(/\r?\n/);
  const groupOf3 = perRucksack.reduce((out, next, idx) => {
    if (idx % 3 === 0) {
      out.push([]);
    }
    out[out.length - 1].push(next);
    return out;
  }, [] as string[][]);
  let sum = 0;
  for (const [items0, items1, items2] of groupOf3) {
    for (const item0 of items0) {
      if (items1.includes(item0) && items2.includes(item0)) {
        sum += getItemPriority(item0);
        break
      }
    }
  }
  console.log( sum);
}

main().catch(console.error);
