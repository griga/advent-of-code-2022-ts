import { readFile, writeFile } from 'fs/promises';
import { resolve } from 'path';

const dataPath = resolve(process.cwd(), 'day09', 'day09.data');
const renderPath = resolve(process.cwd(), 'day09', 'day09.render');

type Point = {
  x: number
  y: number
}

async function main() {
  const raw = await readFile(dataPath, 'utf-8');
  // const raw = `R 5
  // U 8
  // L 8
  // D 3
  // R 17
  // D 10
  // L 25
  // U 20`
  const commands = raw.split(/\r?\n/)
  const rope: Point[] = Array.from(Array(10), () => ({ x: 0, y: 0 }))
  const tailUniquePositions = new Map<string, number>()
  const operations: Record<string, Point> = {
    U: { x: 0, y: -1 },
    D: { x: 0, y: 1 },
    L: { x: -1, y: 0 },
    R: { x: 1, y: 0 },
  }

  for (let idx = 0; idx < commands.length; idx++) {
    const command = commands[idx];
    const [, direction, stepsRaw] = command.match(/(\w) (\d+)/)!
    const steps = parseInt(stepsRaw)
    const opertion = operations[direction]
    for (let i = 0; i < steps; i++) {
      rope[0].x += opertion.x
      rope[0].y += opertion.y
      for (let k = 0; k < rope.length - 1; k++) {
        const knot = rope[k];
        const next = rope[k + 1];
        adjustNext(knot, next)
      }
      writeTailPosition(rope[rope.length - 1], tailUniquePositions)
      // await renderRopeData(makeRenderRopeData(rope), renderPath)
    }

  }

  console.log('tailUniquePositions.size', tailUniquePositions.size)
}


function adjustNext(knot: Point, next: Point) {
  const dy = knot.y - next.y
  const dx = knot.x - next.x
  if (Math.abs(dx) > 1 && Math.abs(dy) > 1) {
    next.y = Math.floor((knot.y + next.y) / 2)
    next.x = Math.floor((knot.x + next.x) / 2)
  } else if (Math.abs(dy) > 1) {
    next.y += Math.floor((dy) / 2)
    next.x = knot.x
  } else if (Math.abs(dx) > 1) {
    next.x += Math.floor((dx) / 2)
    next.y = knot.y
  }
}


function makeRenderRopeData(rope: Point[], resolution: number = 55): string[][] {
  const out = Array.from(Array(resolution), () => Array.from(Array(resolution), () => '.'))
  const mx = Math.floor(rope.map(({ x }) => (x)).reduce((a, b) => a + b) / rope.length)
  const my = Math.floor(rope.map(({ y }) => (y)).reduce((a, b) => a + b) / rope.length)
  const cx = Math.floor(resolution / 2) + 1
  const cy = cx
  const sx = cx - mx
  const sy = cy - my
  if (0 <= sx && sx < resolution && 0 <= sy && sy < resolution) {
    out[sy][sx] = 's'
  }
  for (let i = rope.length - 1; i >= 0; i--) {
    const knot = rope[i];
    const symbol = i === 0 ? 'H' : `${i}`
    const x = cx + knot.x - mx
    const y = cy + knot.y - my
    out[y][x] = symbol
  }
  return out
}

async function renderRopeData(data: string[][], output: string) {
  const content = data.map(row => row.join('')).join('\n')
  await writeFile(output, content)
}


function writeTailPosition({ x, y }: Point, tailUniquePositions: Map<string, number>) {
  const tailPositionKey = `${x}-${y}`
  if (!tailUniquePositions.has(tailPositionKey)) tailUniquePositions.set(tailPositionKey, 0)
  tailUniquePositions.set(tailPositionKey, tailUniquePositions.get(tailPositionKey)! + 1)
}

main().catch(console.error);

