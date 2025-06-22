import { describe, expect, it } from "vitest";
import { Block } from "../src/block";
import { config } from "../src/config";
import { generateBlockHash } from "../src/utils";

describe("Block creation", () => {
  const { GENESIS_DATA } = config;
  it("Should create an instance of genesis block", () => {
    const block = Block.genesis();

    expect(block.index).toBe(GENESIS_DATA.index);
    expect(block.previousHash).toBe(GENESIS_DATA.previousHash);
    expect(block.nonce).toBe(GENESIS_DATA.nonce);
    expect(block.difficulty).toBe(GENESIS_DATA.difficulty);
    expect(block.data).toEqual(GENESIS_DATA.data);
    expect(block.timestamp).toEqual(GENESIS_DATA.timestamp);
    expect(block.hash).toBeDefined();
  });

  it("should calculate the correct hash", () => {
    const block = Block.genesis();
    const expectedHash = generateBlockHash(GENESIS_DATA);
    expect(block.hash).toBe(expectedHash);
  });
});

describe("Block mining", () => {
  const lastBlock = Block.genesis();
  const data = {
    transactions: [
      {
        name: "John Doe",
        amount: 1,
      },
    ],
  };
  const minedBlock = Block.mineBlock({ lastBlock, data });

  it("should mine a block", () => {
    expect(minedBlock).instanceof(Block);
  });

  it("Sets the `lastHash` to be the hash of the last block", () => {
    expect(minedBlock.previousHash).toEqual(lastBlock.hash);
  });

  it("Should have the correct data in the mined block", () => {
    expect(minedBlock.data).toEqual(data);
  });

  it("the timestamp should be greater than or equal to the last block's timestamp", () => {
    expect(minedBlock.timestamp).toBeGreaterThanOrEqual(lastBlock.timestamp);
  });

  it("sets a `hash` that match the difficulty criteria", () => {
    expect(minedBlock.hash.substring(0, minedBlock.difficulty)).toEqual(
      "0".repeat(minedBlock.difficulty)
    );
  });
});
