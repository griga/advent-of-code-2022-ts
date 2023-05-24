import { readFile } from 'fs/promises';
import { resolve } from 'path';

const dataPath = resolve(process.cwd(), 'day05', 'day05.data');

const stackMap = new Map<string, string[]>();
async function main() {
  const raw = await readFile(dataPath, 'utf-8');
//   const raw = `
//     [D]    
// [N] [C]    
// [Z] [M] [P]
//  1   2   3 

// move 1 from 2 to 1
// move 3 from 1 to 3
// move 2 from 2 to 1
// move 1 from 1 to 2`.replace(/\r?\n/, '');

  const [stacksRaw, operationsRaw] = raw.split(/\r?\n\r?\n/);

  // 1. parse into stackMap
  const stacksRawLines = stacksRaw.split(/\r?\n/);
  const stacksNameLine = stacksRawLines[stacksRawLines.length - 1];
  for (let i = 0; i < stacksNameLine.length; i++) {
    const char = stacksNameLine[i];
    if (char === ' ') continue;
    stackMap.set(char, []);
    for (let j = stacksRawLines.length - 2; j >= 0; j--) {
      if (stacksRawLines[j][i]?.trim()) {
        stackMap.get(char)!.push(stacksRawLines[j][i]);
      }
    }
  }

  // 2. process operations
  const operaionsLines = operationsRaw.split(/\r?\n/);
  for (let i = 0; i < operaionsLines.length; i++) {
    const operaionLine = operaionsLines[i];
    const [, count, from, to] = operaionLine.match(/move (\d+) from (\d+) to (\d+)/)!;
    const pickCount = parseInt(count);
    const fromStack = stackMap.get(from)!;
    const cratesToMove = fromStack.splice(fromStack.length - pickCount);
    stackMap.get(to)!.push(...cratesToMove);
  }
  const result = [...stackMap].map(([stack, crates]) => crates[crates.length - 1]).join('');
  console.log(result);
}

main().catch(console.error);
