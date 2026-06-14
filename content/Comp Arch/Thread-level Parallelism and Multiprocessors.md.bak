---
date: 2025-11-26
tags:
---
## Background
- MIMD - multiple instructions, multiple data
- TLP - thread-level parallelism

Thread-level parallelism (TLP) implies the existence of multiple PCs and exploited primarily through MIMDs. 

- **Multiprocessors** - tightly coupled processors (CPUs) that are coordinated and used by one OS and share memory in a shared address space
	- These systems exploit thread-level parallelism through 2 different models:
		- *Parallel processing* - tightly coupled set of threads collaborating on a single task
		- *Request-level parallelism* - execution of multiple, relatively independent processes that may originate from one or more users
			- *Multiprogramming* - single application running on multiple processors
- **Multicore** - single chip systems with multiple cores or multiprocessor where the CPU cores coexist on a single processor chip.

## Multiprocessor Architecture: Issue and Approach
Constraint:
- For MIMD multiprocessor with n processors, we must usually have at least *n* threads or processes to execute.

*Grain size* - amount of computation assigned to a thread

Existing shared-memory multiprocessors fall into two classes:
- *symmetric (shared-memory) multiprocessors (SMP)* - small numbers of cores, < 8
	- Possible for the processors to share a single centralized memory that all processors have equal access to, hence symmetric
	- Also sometimes called *Uniform memory access (UMA)* multiprocessors
- *Distributed shared memory (DSM)* - memory must be distributed among the processors rather than centralized
	- Distributing memory among the nodes both increases bandwidth and reduces the latency to local memory
	- DSM multiprocessor is also called a *NUMA (nonuniform memory access)*

## Terms
### ILP vs TLP
- **ILP** tries to overlap _instructions_ from one thread (pipeline, OoO, speculation).
- **TLP** overlaps _whole threads_ that each have their own PC and state.

### TLP Forms: Parallel vs Request Level
- **Parallel Processing** - multiple threads cooperate to solve one big problem
- **Request-Level Parallelism** - many independent tasks being serviced at once

### SMP vs DSM
- **SMP** - Symmetric Multiprocessor (UMA) - all cores share a single, uniform-latency physical memory
	- Pros:
		- simple
		- easy coherence (snooping)
		- uniform latency to memory
	- Cons:
		- shared bus -> bandwidth bottleneck
		- Doesn't scale well beyond 8 cores
- **DSM** - Distributed Shared Memory (NUMA) - each processor chip has its own local memory, but all memory is still in one shared address space
	- Pros:
		- scales to more cores (64, 128...)
		- higher aggregate memory bandwidth
		- local memory is very fast
	- Cons:
		- remote memory is slow
		- programmer or compiler must care about data placement (locality of memory)
		- coherence requires more complex protocols

## Bottlenecks
**Limited parallelism (Amdahl's Law)**
- No matter how many processors you have, your speedup is limited by the part of code that can't be parallelized
**Communication + Remote Memory Latency**
- If your data lives in another node's memory, your access might take hundreds of cycles longer
	- Need NUMA-aware data placement
	- Coherence protocols

## Cache Coherence (MESI) 

### MESI
- Snoopy protocol 
	- Typically with **snooping bus** where all cores are connected to a shared bus to memory 
	- Every cache **snoops**; watches all the transactions on that bus
	- When one core broadcasts an invalidate, everyone hears it and updates their MESI state
- Each cache block is in one state
	- **Modified**: cache has only copy, its writable, and dirty
	- **Exclusive**: cache has only copy, but it's clean
	- **Shared**: block can be read
	- **Invalid**: block contains no data

### Writing to shared state
When Core 0 wants to **write** a line that is currently **shared** in both Core 0 and Core 1:
- **Core 0** must invalidate **Core 1's copy** so that **Core 0 becomes the *only* owner**

What coherence actually ensures is:
- **A write requires exclusive ownership**
	- Core 1's cached copy must become **INVALID**
	- Core 0 transitions its line from **shared -> modified**

Essential rule of **MESI**:
- **A processor cannot write unless it is the sole owner of the cache line**
