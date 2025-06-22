import { Block } from "./block";
import { generateBlockHash } from "./utils";

export class Blockchain {
  constructor() {
    this.chain = [Block.genesis()];
  }

  /**
   *
   * @typedef {Object} BlockData
   * @property {Object} data - The data to be stored in the block.
   * @returns {void}
   */
  addBlock({ data }) {
    const newBlock = Block.mineBlock({ lastBlock: this.lastBlock, data });
    this.chain.push(newBlock);
  }

  /**
   * Returns the last block in the blockchain.
   * @returns {Block}
   */
  get lastBlock() {
    return this.chain[this.chain.length - 1];
  }

  /**
   * Replaces the current chain with a new chain if the new chain is valid and longer than the current chain.
   *
   * @param {Array<Block>} newChain - The new blockchain to replace the current one.
   * @returns {void}
   */
  replaceChain(receivedChain) {
    if (
      receivedChain.length <= this.chain.length ||
      !Blockchain.isValidChain(receivedChain)
    ) {
      console.error(
        "Received chain is not valid or shorter than the current one. Aborting..."
      );
      return;
    }

    console.log("Replacing the current chain with ", receivedChain);

    this.chain = receivedChain;
  }

  /**
   * Validates a blockchain.
   *
   * @param {Array<Block>} chain - The blockchain to validate.
   * @returns {boolean} True if the blockchain is valid, false otherwise.
   */
  static isValidChain(chain) {
    // Check if the genesis block is correct
    if (JSON.stringify(chain[0]) !== JSON.stringify(Block.genesis())) {
      return false;
    }

    for (let i = 1; i < chain.length; i += 1) {
      const { timestamp, previousHash, hash, data, index } = chain[i];
      const lastBlockHash = chain[i - 1].hash;

      if (lastBlockHash !== previousHash) {
        return false;
      }

      const validatedHash = generateBlockHash({
        data,
        previousHash,
        timestamp,
        index,
      });

      if (validatedHash !== hash) {
        return false;
      }
    }

    return true;
  }
}
