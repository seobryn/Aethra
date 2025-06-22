import { Block } from "./block";
import CryptoJS from "crypto-js";

/**
 * Generates a SHA-256 hash for a given block.
 *
 * @param {Omit<Block, "hash">} block - The block to generate the hash for.
 * @returns {string} The hexadecimal representation of the hash.
 */
export function generateBlockHash({ data, previousHash, timestamp, index }) {
  const stringifiedBlock = JSON.stringify({
    data,
    previousHash,
    timestamp,
    index,
  });
  return CryptoJS.SHA256(stringifiedBlock).toString(CryptoJS.enc.Hex);
}
