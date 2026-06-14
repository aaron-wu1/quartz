---
date: 2026-02-20
tags:
title: The Trouble with Distributed Systems
---
Reality with distributed systems is to assume that **anything that can go wrong will go wrong**. 

## Faults and Partial Failures
In a distributed systems, some parts of the system may break while other parts are still functional. This is known as a *partial failure* and the difficulty with partial failures is that they are *nondeterministic*.

### Cloud Computing and Supercomputing
There's a spectrum of philosophies on building large-scale computing systems:
- *High-performance computing* (HPC) - many CPUs for one task; trying to simulate a single node
- *Cloud computing* - many computers, many tasks; inherently multi-node
