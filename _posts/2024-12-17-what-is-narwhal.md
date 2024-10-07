---
layout: post
title:  "Narwhal: Scalable Blockchain Data Propagation with DAG-Based Design" 
description: Every blockchain should share all transactions with nodes, and it directly affects performance, including throughput and latency. Narwhal was introduced in the paper “Narwhal and Tusk…" 
# date:   2022-10-26 15:00:00 +0900
categories: dev
# tags: [ethereum, solidity, smartcontract]
keywords: blockchain, consensus
comments: true
---

## Contents

- [What is Narwhal?](#what-is-narwhal)
- [Worker and Primary](#worker-and-primary)
- [The process of Narwhal](#the-process-of-narwhal)
- [Narwhal combined with consensus protocol](#narwhal-combined-with-consensus-protocol)
- [Limitations](#limitations)

## What is Narwhal?

Every blockchain should share all transactions with nodes, and it directly affects performance, including throughput and latency.

Narwhal was introduced in the paper ["Narwhal and Tusk: A DAG-based Mempool and Efficient BFT Consensus"](https://arxiv.org/abs/2105.11827). Narwhal processes transaction propagation and validation in separate, worker and primary layers to reduce bottlenecks and provide modular-based data availability.

Narwhal uses DAG(Directed Acyclic Graph) to clearly define dependencies between transaction data, thereby maximizing parallelism and scalability. DAG flexibly manages the order of transactions and supports stable data propagation even when the network is massively expanded.

![The relationship in the process of Narwhal](https://github.com/user-attachments/assets/975a0c88-d70b-47c9-b1f8-1f9b0808baf1)

*@The relationship in the process of Narwhal*

## Worker and Primary

When the client sends a transaction, it goes to the worker located in the node. Transactions are delivered to workers simultaneously, and each worker groups the received transactions into batches.

When transactions accumulate over a certain period or exceed a specified size, the batches created up to that point are transmitted to other nodes.

Nodes validate the received batch and send back a signature of itself to the origin worker. When a worker receives 2f + 1 of the signatures from other nodes, it creates a 'Mempool block', including a certificate.

![The design of the mempool block. r is round, and i is block number](https://github.com/user-attachments/assets/36fc3b5e-1911-4d9d-8b78-8b33c7daa697)

*@The design of the mempool block. r is round, and i is block number*

The certificate list guarantees that this Mempool block is already validated by 2f + 1 signatures from other nodes is reusable and does not need to re-propagate transactions even though the proposal has failed.

The primary receives Mempool blocks from workers in the same node and creates DAG for managing dependency between transactions. DAG uses authenticated Mempool blocks as nodes, and the relationships (parent-child) between each mempool block as edges connecting the nodes to determine the order of transactions and use them as data for consensus.

## The process of Narwhal

### 1. Make batches from transactions and broadcast

As described above, transactions sent from clients are generated in batches over a certain period or when a certain size is satisfied.

### 2. Get the signature of the node

Nodes send back their signature to the origin node worker, not a different worker. When signature data is disseminated randomly, network traffic is increased, and data integrity is difficult to ensure.
Every batch has metadata, including the ID of the batch and worker. A worker who receives batches can send them back to the origin worker due to their containing worker ID.

### 3. Make the mempool block with certification

When the worker receives more than 2f + 1 signature from other nodes, the worker creates a 'Mempool block' including transaction information, signature, etc.

Mempool block has a certification list, not a single certification to reuse when the proposal is failed. It could be a waste of network resources if the Mempool block has to obtain signatures from other nodes in every round, even though they already made certification from signatures of other nodes in previous rounds.

### 4. Send DAG to the leader node

Validator nodes transmit the DAG generated over a certain period to the primary of the leader node. The leader node arranges Mempool blocks from received DAGs into a single DAG and sends it to other nodes for proposal. Non-validators also generate DAG but do not send it to the leader node.

### 5. When the round is failed

A round is a logical unit of time during which transaction data is propagated through the network and consensus is reached. Round failures can occur due to leader failure, network delays, malicious node behavior, etc.

In Narwhal, a round is defined as a process in which a specific leader is designated, and the leader merges DAG data to attempt consensus.

#### In worker

- Even though the round failed, a worker maintains the Mempool block and reuses it in the next round.

- Since the worker continues to collect new transactions from clients regardless of round failure, new transactions are bundled into the next batch, including transactions from the previous batch, and propagated to the network.

- A batch is converted into a Mempool Block when a worker collects more than 2f+1 signatures from other nodes.

#### In primary

- Since the previous Mempool block is already allocated in DAG, it can be reused in the next round.

## Narwhal combined with consensus protocol

Most consensus algorithms, including PBFT and Hotstuff, operating with strongly coupled data propagation and consensus in the consensus process, can be improved in performance when they use Narwhal.

Narwhal provides increased network performance from completely separated data propagation and consensus.

### Data Propagation

- In Narwhal, data availability can be ensured by both workers collecting transaction data and primary generating DAG.

- Since transaction data is propagated independently from the consensus process, the data remains valid even if the consensus fails.

### Consensus

- Since Narwhal has already completed the data propagation, HotStuff only needs to agree on the DAG state, which is already guaranteed by the worker and primary from Narwhal.

![Differences between Narwhal-based consensus and standalone](https://github.com/user-attachments/assets/3107439d-ce19-4e25-bf88-483243ad68ac)

*@Differences between Narwhal-based consensus and standalone*

## Limitations

Because of the mesh structure in DAG, the complexity and size would be increased rapidly when the network expands and the number of transactions is increased. To solve this, we need a strategy to periodically clean up old Mempool blocks or limit the depth and size of the DAG.

Also, Narwhal maintains previous DAG data, which the proposal failed, and reuses them in the next round. We also need a policy to efficiently discard old data or merge it with additional data.

## References

- [Narwhal and Tusk: A DAG-based Mempool and Efficient BFT Consensus](https://arxiv.org/abs/2105.11827)
