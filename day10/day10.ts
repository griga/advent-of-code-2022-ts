import { readFile, writeFile } from 'fs/promises';
import { resolve } from 'path';

const dataPath = resolve(process.cwd(), 'day10', 'day10.data');
const renderPath = resolve(process.cwd(), 'day10', 'day10.render');
const example = `addx 15
addx -11
addx 6
addx -3
addx 5
addx -1
addx -8
addx 13
addx 4
noop
addx -1
addx 5
addx -1
addx 5
addx -1
addx 5
addx -1
addx 5
addx -1
addx -35
addx 1
addx 24
addx -19
addx 1
addx 16
addx -11
noop
noop
addx 21
addx -15
noop
noop
addx -3
addx 9
addx 1
addx -3
addx 8
addx 1
addx 5
noop
noop
noop
noop
noop
addx -36
noop
addx 1
addx 7
noop
noop
noop
addx 2
addx 6
noop
noop
noop
noop
noop
addx 1
noop
noop
addx 7
addx 1
noop
addx -13
addx 13
addx 7
noop
addx 1
addx -33
noop
noop
noop
addx 2
noop
noop
noop
addx 8
noop
addx -1
addx 2
addx 1
noop
addx 17
addx -9
addx 1
addx 1
addx -3
addx 11
noop
noop
addx 1
noop
addx 1
noop
noop
addx -13
addx -19
addx 1
addx 3
addx 26
addx -30
addx 12
addx -1
addx 3
addx 1
noop
noop
noop
addx -9
addx 18
addx 1
addx 2
noop
noop
addx 9
noop
noop
noop
addx -1
addx 2
addx -37
addx 1
addx 3
noop
addx 15
addx -21
addx 22
addx -6
addx 1
noop
addx 2
addx 1
noop
addx -10
noop
noop
addx 20
addx 1
addx 2
addx 2
addx -6
addx -11
noop
noop
noop`
async function main() {
  const raw = await readFile(dataPath, 'utf-8');
  // const raw = example
  const commands = raw.split(/\r?\n/)

  const crtData: string[][] = Array.from(Array(6), () => Array.from(Array(40), () => '.'))

  let spriteX = 1;
  let cycle = 1;


  for (let idx = 0; idx < commands.length; idx++) {
    const command = commands[idx].trim();
    if (command === 'noop') {
      renderToCRTData(cycle, spriteX, crtData);
      cycle++;
      continue
    }
    renderToCRTData(cycle, spriteX, crtData);
    cycle++
    renderToCRTData(cycle, spriteX, crtData);
    const dSpriteX = parseInt(command.match(/^addx ([-\d]+)$/)![1])
    spriteX += dSpriteX
    cycle++
  }
  console.log('cycle', cycle)
  // const result = [...checkMap.values()].reduce((out, next) => out + next[1], 0)
  // console.log('result', result)
  await renderToFile(crtData, renderPath)

}

function renderToCRTData(cycle: number, spriteX: number, crtData: string[][]) {
  const y = Math.floor((cycle - 1) / 40);
  const x = (cycle - 1) % 40;

  const isLit = (spriteX - 1 <= x) && (x <= spriteX + 1)


  const pixelData = isLit ? '#' : '.'


  crtData[y][x] = pixelData

}

async function renderToFile(data: string[][], output: string) {
  const content = data.map(row => row.join('')).join('\n')
  await writeFile(output, content)
}

main().catch(console.error);
