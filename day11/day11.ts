import { readFile } from 'fs/promises';
import { resolve } from 'path';

const dataPath = resolve(process.cwd(), 'day11', 'day11.data');

type Monkey = {
  index: number,
  items: bigint[],
  operation: (old: bigint) => bigint,
  testBy: bigint,
  onTrue: number,
  onFalse: number,
  inspections: number,
}
const exaampleData = `Monkey 0:
Starting items: 79, 98
Operation: new = old * 19
Test: divisible by 23
  If true: throw to monkey 2
  If false: throw to monkey 3

Monkey 1:
Starting items: 54, 65, 75, 74
Operation: new = old + 6
Test: divisible by 19
  If true: throw to monkey 2
  If false: throw to monkey 0

Monkey 2:
Starting items: 79, 60, 97
Operation: new = old * old
Test: divisible by 13
  If true: throw to monkey 1
  If false: throw to monkey 3

Monkey 3:
Starting items: 74
Operation: new = old + 3
Test: divisible by 17
  If true: throw to monkey 0
  If false: throw to monkey 1`
async function main() {
  const raw = await readFile(dataPath, 'utf-8');
  // const raw = exaampleData
  const monkeysRaw = raw.split(/\r?\n\r?\n/)

  const monkeys: Map<number, Monkey> = new Map();
  for (let idx = 0; idx < monkeysRaw.length; idx++) {
    const monkeyRaw = monkeysRaw[idx];
    const monkey = parseMonkeyRaw(monkeyRaw)
    monkeys.set(monkey.index, monkey)
  }

  const divisorProduct = [...monkeys.values()].reduce((dp, monkey) => monkey.testBy * dp, BigInt(1))

  let round = 0
  while (round < 10000) {
    for (const [, monkey] of monkeys) {
      let item: bigint | undefined;
      while (item = monkey.items.shift()) {
        const worry = monkey.operation(item) % divisorProduct
        // const level = Math.floor(worry)
        // console.log(level / monkey.testBy, Math.floor(level / monkey.testBy));

        if (worry % monkey.testBy == BigInt(0)) {
          monkeys.get(monkey.onTrue)!.items.push(worry)
        } else {
          monkeys.get(monkey.onFalse)!.items.push(worry)
        }
        monkey.inspections++
      }
    }
    round++
    // if ([1, 20, 1000, 2000, 3000, 4000, 5000, 6000, 7000, 8000, 9000, 10000].indexOf(round) >= 0) {
    //   const inspections = [...monkeys.values()].map(({ inspections }) => (inspections))
    //   console.log(inspections)
    // }
  }
  const sorted = [...monkeys.values()].sort((m0, m1) => m0.inspections > m1.inspections ? -1 : 1)
  const result = sorted[0].inspections * sorted[1].inspections
  console.log('result', result)
}

function parseMonkeyRaw(monkeyRaw: string): Monkey {
  const [monkeyLine, itemsLine, operationsLine, testLine, onTrueLine, onFalseLine] = monkeyRaw.split(/\r?\n/)
  const [, indexRaw] = monkeyLine.match(/Monkey (\d+):/)!
  const [, itemsRaw] = itemsLine.match(/Starting items: (.+)/)!
  const [, operationRaw] = operationsLine.match(/Operation: new = (.+)/)!
  const [, operand0, op, operand1] = operationRaw.match(/(old|\d+) ([\+\*]) (old|\d+)/)!
  let operation: (old: bigint) => bigint
  const opMap: Record<string, (a: bigint, b: bigint) => bigint> = {
    '*': (a: bigint, b: bigint) => a * b,
    '+': (a: bigint, b: bigint) => a + b
  }
  if (operand0 === 'old' && operand1 === 'old') {
    operation = (old: bigint) => opMap[op](old, old)
  } else {
    operation = (old: bigint) => opMap[op](old, BigInt(parseInt(operand1)))
  }
  const [, testByRaw] = testLine.match(/Test: divisible by (\d+)/)!
  const [, onTrueRaw] = onTrueLine.match(/If true: throw to monkey (\d+)/)!
  const [, onFalseRaw] = onFalseLine.match(/If false: throw to monkey (\d+)/)!
  return {
    index: parseInt(indexRaw),
    items: itemsRaw.split(', ').map(item => BigInt(parseInt(item))),
    operation: operation,
    testBy: BigInt(parseInt(testByRaw)),
    onTrue: parseInt(onTrueRaw),
    onFalse: parseInt(onFalseRaw),
    inspections: 0
  }
}


main().catch(console.error);
