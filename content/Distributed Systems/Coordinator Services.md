---
date: 2026-02-17
tags:
title: Coordinator Services
---
## Big Idea
**Consensus is slow, but we need it!**
For example, IP assignment for servers and databases, replication schema, partitioning breakdown (what partition is located on which node). See [[Partitioning]].

## What is a coordinator service?
A coordination service is a key-value store that allows us to store this data in a reliable way. Some examples are: ZooKeeper (Zab), etcd ([[What is Raft?|Raft]])
- Put application configuration that require consensus into a coordination service

## How do they work?
They are built on top of a **distributed consensus layer** like Raft.
How to make sure reads are always latest?
1. Read from leader - slow, high load on leader
2. Read from multiple nodes, SYNC operation to keep reads linearizable. 

## Coordination Services Conclusions
Too slow to be used for application data, only **key pieces of configuration** for backend that need to be correct.

Built on top of consensus algorithms to maintain linearizability. 