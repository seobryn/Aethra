import { Blockchain } from "./blockchain.js";

const blockchain = new Blockchain();

blockchain.addBlock({ data: "Init" });

let prevTimestamp, nextTimestamp, nextBlock, timeDiff, average;

const times = [];

for (let i = 0; i < 10000; i += 1) {
  prevTimestamp = blockchain.lastBlock.timestamp;

  blockchain.addBlock({ data: `Block ${i}` });

  nextBlock = blockchain.lastBlock;
  nextTimestamp = nextBlock.timestamp;
  timeDiff = nextTimestamp - prevTimestamp;
  times.push(timeDiff);
  average = times.reduce((total, num) => (total + num) / times.length);

  console.log(
    `Time to mine block ${timeDiff}ms. Difficulty: ${nextBlock.difficulty}. Average time: ${average}ms.`
  );
}
