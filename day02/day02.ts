import { readFile } from 'fs/promises';
import { resolve } from 'path';

const dataPath = resolve(process.cwd(), 'day02', 'day02.data');

// A for Rock(1), B for Paper(2), and C for Scissors(3)
// X to lose, Y to draw, and Z  to win
const outcomeMapping = new Map([
  [
    'A',
    new Map([
      ['X', 3],
      ['Y', 1 + 3],
      ['Z', 2 + 6],
    ]),
  ],
  [
    'B',
    new Map([
      ['X', 1],
      ['Y', 2 + 3],
      ['Z', 3 + 6],
    ]),
  ],
  [
    'C',
    new Map([
      ['X', 2],
      ['Y', 3 + 3],
      ['Z', 1 + 6],
    ]),
  ],
]);

async function main() {
  const raw = await readFile(dataPath, 'utf-8');
  // const raw = `A Y\nB X\nC Z`;
  const rounds = raw.split(/\r?\n/);

  const sum = rounds
    .map((round) => {
      const [her, mine] = round.split(/\s+/);
      return outcomeMapping.get(her)!.get(mine)!;
    })
    .reduce((a, b) => a + b);

  console.log(sum);
}

main().catch(console.error);
