import { readFile } from 'fs/promises';
import { resolve } from 'path';

const dataPath = resolve(process.cwd(), 'day08', 'day08.data');

async function main() {
  const raw = await readFile(dataPath, 'utf-8');
//   const raw = `30373
// 25512
// 65332
// 33549
// 35390`
  const rows = raw.split(/\r?\n/)
  const treesMap: number[][] = rows.map(row => row.split('').map(h => parseInt(h)))
  const scoreMap: number[][] = Array.from(Array(treesMap.length), () => Array.from(Array(treesMap[0].length), () => 0))

  for (let y = 0; y < treesMap.length; y++) {
    const row = treesMap[y];
    for (let x = 0; x < row.length; x++) {
      scoreMap[y][x] = getScenicScore(treesMap, x, y)
    }
  }

  const result = scoreMap.reduce((out, row) => Math.max(
    out,
    row.reduce((rowMax, score) => Math.max(rowMax, score), 0)
  ), 0)

  console.log('result', result)

}

function getScenicScore(map: number[][], x: number, y: number) {
  const treeHeight = map[y][x]

  // top
  let tIdx = y
  let tScore = 0
  while (--tIdx >= 0) {
    if (map[tIdx][x] >= treeHeight) {
      tScore++
      break
    } else if (map[tIdx][x] < treeHeight) {
      tScore++
    } else {
      break
    }
  }

  // bottom
  let bIdx = y
  let bScore = 0
  while (++bIdx < map.length) {
    if (map[bIdx][x] >= treeHeight) {
      bScore++
      break
    } else if (map[bIdx][x] < treeHeight) {
      bScore++
    } else {
      break
    }
  }

  // left
  let lIdx = x
  let lScore = 0
  while (--lIdx >= 0) {
    if (map[y][lIdx] >= treeHeight) {
      lScore++
      break
    } else if (map[y][lIdx] < treeHeight) {
      lScore++
    } else {
      break
    }
  }

  // right
  let rIdx = x
  let rScore = 0
  while (++rIdx < map[y].length) {
    if (map[y][rIdx] >= treeHeight) {
      rScore++
      break
    } else if (map[y][rIdx] < treeHeight) {
      rScore++
    } else {
      break
    }
  }

  const score = tScore * bScore * lScore * rScore
  return score
}

main().catch(console.error);
