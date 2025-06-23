import { config, MINE_RATE, INITIAL_DIFFICULTY } from "./config";
import { generateBlockHash } from "./utils";

/**
 * Represents a single block in the blockchain.
 */
export class Block {
  /**
   * Creates a new block.
   * @param {Block} blockData - BlockData
   */
  constructor({
    index,
    timestamp,
    previousHash,
    data,
    hash,
    nonce,
    difficulty,
  }) {
    /**
     * @type {Number}
     */
    this.index = index;
    /**
     * @type {string}
     */
    this.previousHash = previousHash;
    this.data = data;
    /**
     * @type {Number}
     */
    this.timestamp = timestamp;
    /**
     * @type {string}
     */
    this.hash = hash;
    /**
     * @type {Number}
     */
    this.nonce = nonce;
    /**
     * @type {Number}
     */
    this.difficulty = difficulty;
  }

  /**
   * Generates a genesis block using the config file.
   * @param {any} config - The configuration object.
   * @returns {Block} - The generated genesis block.
   */
  static genesis() {
    const hash = generateBlockHash({ ...config.GENESIS_DATA });
    const block = new Block({ ...config.GENESIS_DATA, hash });
    return block;
  }

  /**
   * Mines a new block with the given data and adds it to the blockchain.
   * @typedef {Object} MineBlockParams
   * @property {Block} lastBlock
   * @property {any} data
   * @returns {Block} - The newly mined block.
   */
  static mineBlock({ lastBlock, data }) {
    let timestamp, hash;
    const index = lastBlock.index + 1;
    const previousHash = lastBlock.hash;

    let { difficulty } = lastBlock;
    let nonce = 0;

    do {
      nonce += 1;
      timestamp = Date.now();
      difficulty = Block.adjustDifficulty({
        originalBlock: lastBlock,
        timestamp,
      });
      hash = generateBlockHash({
        index,
        timestamp,
        previousHash,
        data,
        difficulty,
        nonce,
      });
    } while (hash.substring(0, difficulty) !== "0".repeat(difficulty));

    return new Block({
      index,
      timestamp,
      previousHash,
      data,
      hash,
      difficulty,
      nonce,
    });
  }

  /**
   * Adjusts the difficulty based on the time taken to mine a block.
   * @typedef {Object} AdjustDifficultyParams
   * @property {Block} originalBlock - The original block that was mined.
   * @property {Number} timestamp - The current timestamp.
   * @returns {Number} - The new difficulty level.
   */
  static adjustDifficulty({ originalBlock, timestamp }) {
    const timeTaken = timestamp - originalBlock.timestamp;
    if (timeTaken < MINE_RATE) {
      return originalBlock.difficulty + 1;
    } else if (timeTaken > MINE_RATE) {
      return Math.max(originalBlock.difficulty - 1, INITIAL_DIFFICULTY);
    }
    return originalBlock.difficulty;
  }
}
