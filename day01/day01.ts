import { readFile } from 'fs/promises';
import { resolve } from 'path';

const dataPath = resolve(process.cwd(), 'day01', 'day01.data');

async function main() {
  const raw = await readFile(dataPath, 'utf-8');

  const food = raw.split(/\r?\n/);

  const caloriesByElves = [];

  let elveIdx = 0;

  for (let foodIdx = 0; foodIdx < food.length; foodIdx++) {
    const calories = food[foodIdx];
    if (calories.trim() === '') {
      elveIdx++;
      continue;
    }

    if (caloriesByElves[elveIdx] === undefined) {
      caloriesByElves[elveIdx] = 0;
    }
    caloriesByElves[elveIdx] += parseInt(calories);
  }

  const byCaloriesDesc = caloriesByElves.sort((a, b) => b - a);

  const sum = byCaloriesDesc.slice(0, 3).reduce((a, b)=> a + b)

  console.log(sum);
}

main().catch(console.error);
