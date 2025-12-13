---
date: 2025-12-02
tags:
---
## Uniprocessor
What does a uniprocessor lacks:
- Complexity
- Power
- Lack of ILP
	- lots of it was due to superscalar parallelism which was harder and harder to find in programs
- Marginal gains of incremental logic

### Big Idea
- Marginal utility of each new transistor is decreasing
- If n is the number of transistors
	- Performance is `O(sqrt(N))`
	- Power and Area are `O(N)`
	- Diminishing returns

### Throughput Computing
![[Screenshot 2025-12-02 at 2.15.44 PM.png]]
- Tradeoff: smaller 4x smaller CPUs rather than 1 super big CPU
	- Slower single thread, 4x throughput
## Parallel Architectures
- Multiprocessor
- Multithreaded processors
- Multicore processors

## Classifying Multiprocessors
### Flynn Taxonomy
- **SISD** (Single instruction Single Data)
	- Uniprocessors
- **SIMD** (Single Instruction Multiple Data)
	- GPUs
- **MIMD** (Multiple Instruction Multiple Data)
	- modern multiprocessors or multicores
- **MISD** (Multiple Instruction Single Data)
	- Not possible

### Interconnection Network
Two types:
- **Bus**
- **Network Based**

### Memory Topology
- UMA (Uniform Memory Access)
	- Same speeds for all memory accesses
- NUMA (Non-uniform Memory Access)
	- Latency is dependent on address locality
	- Network based are often NUMA, a piece of memory is local to each process (Fast), addressing non-local (slow)

### Programming Model
- Shared Memory - every processor can name every address location
- Message Passing - each processor can name only it's local memory. Communication is through explicit messages (multicomputer)

**note: roughly two**
- programming models: shared memory vs message passing
- hardware approaches: shared memory vs messing passing
- These decisions are somewhat orthogonal (`TODO WHY?`)

## Parallel Programming
- Shared-memory programming requires synchronization to provide mutual exclusion and prevent race conditions

## Multiprocessor Caches (Shared Memory)
### Cache Coherency Problem
- Solve with Cache Coherent Protocol
- Informally:
	- Any read must return the most recent write
	- Too strict and very difficult to implement
- Better:
	- A processor sees its own writes to a location in the correct order
	- Any write must eventually be seen by a read
	- All writes are seen in order ("serialization"). Writes to the same location are seen in the same order by all processors.

### Solution
- Track the state of every cache line
	- Invalid, Valid, Modified, Clean
- Bus easy, order determined by arrival in bus
- **Snooping Solution (Snoopy Bus)**
	- Send all requests for unknown data to all processor
- `<TODO>`

`<TODO below>`  - what is this hoare vs mesa semantics lmao?
- *Write-update*
	- On each write, each cache holding that location updates its value
- *Write-invalidate*
	- On each, write, each cache holding the location invalidates the cache line

### MESI Protocol, a Snoopy protocol
- Invalidation protocol, assumes write-back cache
- `<TODO>`

### MOESI = Modified, Owned, Exclusive, Shared, Invalid
- Added **OWNED** (dirty in multiple caches, owned in one) => Owner responsible for writing back shared, dirty line
	- dirty means diff from main memory, but in coherency case, has to be consistent with other caches

## Multiprocesssor Summary
- Network vs Bus
- Message-passing vs Shared Memory
- Multiprocessing+caches = coherence problems  
• Cache coherence protocols solve the coherence problem in  
hardware  
• Multicore+multithreading gives high performance across a  
range of TLP.