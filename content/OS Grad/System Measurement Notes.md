---
date: 2025-10-11
tags:
- operating-systems
- performance
- caching
- concurrency
- computer-architecture
- storage
title: System Measurement Notes
---

## Overview
In building an operating system, it is important to be able to determine the performance characteristics of underlying hardware components (CPU, RAM, disk, network, etc.), and to understand how their performance influences or constrains operating system services.


## Specs
- Ubuntu 24.04.03 live server amd-64
	- x86-64 ISA
	- Note: running on emulation on Macbook pro m4 for experimentation/debugging, testing actual metrics on an x86 laptop

## Experiments
**Steps for each experiment**:
1. Estimate *base hw performance* with cites
2. Guess overhead software addition to base hw perf (software overhead)
	- Possibly environment costs too
3. Combine base hw perf and software overhead to *overall prediction of performance*
4. Implement and perform measurement
5. Use low-overhead mechanisms for reading timestamps
	- Modern processors have cycle counter that apps can read using a special instruction
		- x86: use`rdtsc` instruction
		- ARM: use `cntvct_el0` register

**Operations**:
1. CPU, Scheduling, and OS Services
	1. Measurement overhead
	2. Procedure call overhead
	3. System call overhead
	4. Task creation time
	5. Context switch time
2. Memory
	1. Memory and cache access time
	2. Memory bandwidth
	3. Page fault service time
3. Network
	1. Round trip time
	2. Peak network bandwidth
	3. Connection overhead
4. File System
	1. size of file cache
	2. file read time
	3. remote file read time
	4. contention

## References
- [[Imbench]]