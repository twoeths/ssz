import {itBench} from "@dapplion/benchmark";
import {BranchNode, getNodeH, LeafNode} from "../../src/node";
import {countToDepth, subtreeFillToContents} from "../../src";

describe("HashObject LeafNode", () => {
  // Number of new nodes created in processAttestations() on average
  const nodesPerSlot = 250_000 / 32;

  const zeroLeafNode = LeafNode.fromZero();

  itBench(`getNodeH() x${nodesPerSlot} avg hindex`, () => {
    for (let i = 0; i < nodesPerSlot; i++) {
      getNodeH(zeroLeafNode, i % 8);
    }
  });

  itBench(`getNodeH() x${nodesPerSlot} index 0`, () => {
    for (let i = 0; i < nodesPerSlot; i++) {
      getNodeH(zeroLeafNode, 0);
    }
  });

  itBench(`getNodeH() x${nodesPerSlot} index 7`, () => {
    for (let i = 0; i < nodesPerSlot; i++) {
      getNodeH(zeroLeafNode, 7);
    }
  });

  // As fast as previous methods
  const keys: (keyof LeafNode)[] = ["h0", "h1", "h2", "h3", "h4", "h5", "h6", "h7"];

  itBench(`getNodeH() x${nodesPerSlot} index 7 with key array`, () => {
    for (let i = 0; i < nodesPerSlot; i++) {
      zeroLeafNode[keys[7]];
    }
  });

  itBench(`new LeafNode() x${nodesPerSlot}`, () => {
    for (let i = 0; i < nodesPerSlot; i++) {
      LeafNode.fromHashObject(zeroLeafNode);
    }
  });
});

describe("Node batchHash", () => {
  const numNodes = [250_000, 500_000, 1_000_000, 2_000_000];

  for (const numNode of numNodes) {
    itBench({
      id: `batchHash ${numNode} nodes`,
      before: () => {
        return createList(numNode);
      },
      beforeEach: (rootNode: BranchNode) => rootNode,
      fn: (rootNode: BranchNode) => {
        rootNode.batchHash();
      },
    });

    itBench({
      id: `get root ${numNode} nodes`,
      before: () => {
        return createList(numNode);
      },
      beforeEach: (rootNode: BranchNode) => rootNode,
      fn: (rootNode: BranchNode) => {
        rootNode.root;
      },
    });
  }
});

function createList(numNode: number): BranchNode {
  const nodes = Array.from({length: numNode}, (_, i) => newLeafNodeFilled(i));
  // add 1 to countToDepth for mix_in_length spec
  const depth = countToDepth(BigInt(numNode)) + 1;
  const node = subtreeFillToContents(nodes, depth);
  return node as BranchNode;
}

function newLeafNodeFilled(i: number): LeafNode {
  return LeafNode.fromRoot(new Uint8Array(Array.from({length: 32}, () => i % 256)));
}
