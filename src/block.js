import { config } from "./config";
import { generateBlockHash } from "./utils";

/**
 * Represents a single block in the blockchain.
 */
export class Block {
  /**
   * Creates a new block.
   * @param {Block} blockData - BlockData
   */
  constructor({ index, timestamp, previousHash, data, hash }) {
    this.index = index;
    this.previousHash = previousHash;
    this.data = data;
    this.timestamp = timestamp;
    this.hash = hash;
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
    const index = lastBlock.index + 1;
    const previousHash = lastBlock.hash;
    const timestamp = Date.now();
    const hash = generateBlockHash({ index, timestamp, previousHash, data });
    return new Block({ index, timestamp, previousHash, data, hash });
  }
}
