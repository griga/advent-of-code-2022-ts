import { readFile } from 'fs/promises';
import { resolve } from 'path';

const dataPath = resolve(process.cwd(), 'day07', 'day07.data');
class FSNode extends Map<string, number | FSNode>{ }
type FSNodeMeta = [nodeName: string, node: FSNode, nodeSize: number]

async function main() {
  const raw = await readFile(dataPath, 'utf-8');
  // const raw = `$ cd /
  // $ ls
  // dir a
  // 14848514 b.txt
  // 8504156 c.dat
  // dir d
  // $ cd a
  // $ ls
  // dir e
  // 29116 f
  // 2557 g
  // 62596 h.lst
  // $ cd e
  // $ ls
  // 584 i
  // $ cd ..
  // $ cd ..
  // $ cd d
  // $ ls
  // 4060174 j
  // 8033020 d.log
  // 5626152 d.ext
  // 7214296 k`
  const commands = raw.split(/\r?\n/)

  const root = new FSNode([])

  // let currentNode: FSNode = root;
  let currentPath: FSNode[] = [root]
  let match: RegExpMatchArray | null;
  // 1. fill tree
  for (let idx = 0; idx < commands.length; idx++) {
    const command = commands[idx];

    match = command.match(/\$ cd \//)
    if (match) {
      currentPath = [root]
      continue;
    }

    match = command.match(/\$ ls/)
    if (match) continue;

    match = command.match(/dir (.+)/)
    if (match) {
      const node = new FSNode();
      currentPath[currentPath.length - 1].set(match[1], node)
      continue
    }

    match = command.match(/cd \.\./)
    if (match) {
      currentPath.pop()
      continue
    }

    match = command.match(/cd (\w+)/)
    if (match) {
      const node = currentPath[currentPath.length - 1].get(match[1])! as FSNode
      currentPath.push(node)
      continue
    }


    match = command.match(/(\d+) ([\w\.]+)/)
    if (match) {
      const node = currentPath[currentPath.length - 1]
      node.set(match[2], parseInt(match[1]))
      continue
    }

    throw new Error(`unknown command: ${command}`)
  }
  // 2. find answer
  const results = findDirs('/', root, 100000)[1]
  const sorted = results.sort((a, b) => a[2] - b[2])
  const sizes = sorted.map(([, , size]) => (size))
  const rootSize = sizes[sizes.length - 1];
  const freeSpace   = 70000000 - rootSize;
  const spaceToFree = 30000000 - freeSpace;
  let result = 0
  console.log('freeSpace', freeSpace)
  for (let idx = 0; idx < sizes.length; idx++) {
    const size = sizes[idx];
    if (size >= spaceToFree) {
      result = size
      break
    }
  }
  // const result = results.reduce((out, [, , nodeResult]) => (out + nodeResult), 0)
  console.log('result', result); 
}


function findDirs(name: string, node: FSNode, size: number, results: FSNodeMeta[] = []): [size: number, results: FSNodeMeta[]] {
  let nodeResult = 0
  for (const [nodeName, nodeData] of node.entries()) {
    if (typeof nodeData === 'number') {
      nodeResult += nodeData
    } else {
      nodeResult += findDirs(nodeName, nodeData, size, results)[0]
    }
  }
  results.push([name, node, nodeResult])
  return [nodeResult, results]

}

main().catch(console.error);
