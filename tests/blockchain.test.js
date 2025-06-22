import { describe, it, expect, beforeEach, vi } from "vitest";
import { Blockchain } from "../src/blockchain.js";
import { Block } from "../src/block.js";

describe("Blockchain", () => {
  /**
   * @type {Blockchain}
   */
  let blockchain, newChain, originalChain;

  beforeEach(() => {
    blockchain = new Blockchain();
    newChain = new Blockchain();

    originalChain = blockchain.chain;
  });

  it("should have an instance of chain property as array", () => {
    expect(Array.isArray(blockchain.chain)).toBe(true);
  });

  it("should have the genesis block", () => {
    expect(blockchain.chain.length).toBe(1);
    expect(blockchain.chain[0]).toEqual(Block.genesis());
  });

  it("should add a new block to the chain with the addBlock function", () => {
    const newData = { key: "value" };
    blockchain.addBlock({ data: newData });
    expect(blockchain.lastBlock.data).toEqual(newData);
  });

  describe("isValidChain", () => {
    describe("When the chain does not start with the genesis block", () => {
      it("should return false", () => {
        blockchain.chain[0] = { data: "fake genesis" };

        expect(Blockchain.isValidChain(blockchain.chain)).toBe(false);
      });
    });

    describe("When the chain starts with the genesis block and has multiple blocks", () => {
      beforeEach(() => {
        blockchain.addBlock({ data: "New Trans" });
        blockchain.addBlock({ data: "Other New Trans" });
        blockchain.addBlock({ data: "Last New Trans" });
      });

      describe("and the lastHash ref has changed", () => {
        it("should return false", () => {
          blockchain.chain[2].previousHash = "fake last hash";

          expect(Blockchain.isValidChain(blockchain.chain)).toBe(false);
        });
      });

      describe("and the chain contains a block with invalid field", () => {
        it("returns false", () => {
          blockchain.chain[2].data = { fake: "field" };

          expect(Blockchain.isValidChain(blockchain.chain)).toBe(false);
        });
      });

      describe("and the chain does not contain any invalid blocks", () => {
        it("returns true", () => {
          expect(Blockchain.isValidChain(blockchain.chain)).toBe(true);
        });
      });
    });
  });

  describe("replaceChain", () => {
    let errMock, logMock;

    beforeEach(() => {
      errMock = vi.fn();
      logMock = vi.fn();

      global.console.error = errMock;
      global.console.log = logMock;
    });

    describe("when the new chain is not longer", () => {
      beforeEach(() => {
        newChain.chain[0] = { new: "chain" };
        blockchain.replaceChain(newChain.chain);
      });

      it("does not replace the chain", () => {
        blockchain.replaceChain(newChain.chain);
        expect(blockchain.chain).toEqual(originalChain);
      });

      it("logs an error", () => {
        expect(errMock).toHaveBeenCalledTimes(1);
      });
    });

    describe("when the new chain is longer", () => {
      beforeEach(() => {
        newChain.addBlock({ data: "New Trans" });
        newChain.addBlock({ data: "Other New Trans" });
        newChain.addBlock({ data: "Last New Trans" });
      });

      describe("and the chain is invalid", () => {
        beforeEach(() => {
          newChain.chain[2].hash = "|InvalidHash|";
          blockchain.replaceChain(newChain.chain);
        });

        it("does not replace the chain", () => {
          expect(blockchain.chain).toEqual(originalChain);
        });

        it("logs an error", () => {
          expect(errMock).toHaveBeenCalledTimes(1);
        });
      });

      describe("and the chain is valid", () => {
        beforeEach(() => {
          blockchain.replaceChain(newChain.chain);
        });

        it("does replace the chain", () => {
          expect(blockchain.chain).toEqual(newChain.chain);
        });

        it("logs the replacement message", () => {
          expect(logMock).toHaveBeenCalledTimes(1);
        });
      });
    });
  });
});
