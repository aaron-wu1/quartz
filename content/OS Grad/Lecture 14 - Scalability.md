---
date: 2025-11-06
tags:
---
## RCU

### RCU Goals
- concurrent reads, even during updates
- low overhead - memory, execution time
- deterministic completion time

### Example: linked list
![[RCU linked list]]
Approaches for mutual exclusion
#### Approach #1: spin lock
- all threads acquire and release 
#### Approach #2: read write lock
- Multiple readers OR 1 writer, can't have both at the same time
- Benefit: 
	- multiple reads in parallel
- Drawbacks: 
	- cannot read while write is happening
	- could cause starvation, depends on implementation
		- like readers starve writer
	- execution time overhead
		- ```
		  struct rwlock{int n;}
			  n = 0 -> unlocked
			  n = -1 -> 1 writer
			  n > 0 - > locked by n readers
		  
		  read_lock - increment n
		  write_lock - decrement n
		  ```
		- To just read data, still lots of writes to n
		- space overhead
#### Thought experiment: readers skip the lock
- no writer: ok
- yes writer: not ok, could see inconsistent state

### Read-Copy-Update (RCU)
- rules, patterns, mechanisms
#### RCU idea #1: writers make a copy
![[RCU idea 1 writers make a copy]]
To update E2:
1. acquire lock
2. `Enew = alloc()`
3. `Enew -> next = E2 -> next`
4. `strcpy(Enew, "new string")`
5. `E1 -> next = Enew`
6. release lock
1-5 readers see old version, 6 - onwards readers see new version
- Readers cannot see partially complete updates

**problem:**
- Compilers and CPUs can reorder instructions

#### RCU idea #2: memory barriers to enforce ordering

To update E2:
1. acquire lock
2. `Enew = alloc()`
3. `Enew -> next = E2 -> next`
4. `strcpy(Enew, "new string")`
------------ Memory barrier ----------------
5. `E1 -> next = Enew`
6. release lock

**problem:**
- use-after-free
	- readers might still have a pointer to memory that we're trying to free

#### RCU idea #3: grace period
- writers - wait until all CPUs have context switched
- readers - can't hold RCU pointers through context switches

### Linux's RCU API
readers:
- `rcu_read_lock` - disable/enable timer interrupts
- `rcu_read_unlock` - disable/enable timer interrupts
	per core operation, no need to synchronize with other cores
- `rcu_dereference(pointer)` - includes a memory barrier
writers:
- `syncrhonize_rcu` - wait for all CPUs to context switch
- `call_rcu(callback, arg)` - async version
- `rcu_assign_pointer(pointer_addr, pointer)` - updates pointer, includes memory barrier

### RCU vs Read - write locks
readers:
- RCU imposes almost no overhead
- reads can happen during writes
writer:
- writes can take longer with RCU

### Drawbacks of RCU
- only helpful if reads >> writes
- relies on context switches
- complex
- different model of consistency
	- readers can observe stale data
- only works for data structures with single committing write

### Summary of RCU
- multicore CPUs - need scalable way to do synchronization
- Solution is RCU - readers don't have to wait and can run in parallel with writers
- used widely in Linux


## Linux Scalability
- Corey - new OS from scratch
- This paper - scalability of Linux
- Scalable commutativity rule - principles

### Scalability bottlenecks
- App
- Kernel
- Hardware

### Approach:
- set of applications
- find/fix bottlenecks
- Iterate until OS is not bottleneck

### Cache Coherence
![[linux scalablity cache coherence]]
Needs cache coherence protocol -> keeps caches consistent

### Scalability Bottlenecks
- writing to shared variables/memory
- lock on shared data
- competition for caches, memory bandwidth
- not enough concurrency

### Techniques for Improving Scalability
- sloppy counters - partition counter across cores
- ![[Sloppy Counter]]
	- how do we know the true value of counter? 
		- true value of counter = value of global - $\sum per\ core\ counters$
- avoid lock contention
	- fine-grained locks
- avoid data contention
	- per-core data structures
- wait-free sync
	- e.g., RCU
- avoid false sharing
	- cache lines, 64B
	- can have a cache line where one thread is accessing one part and another thread is accessing another part.
		- sharing cache line even though underlying variables aren't shared between threads
	- fix: move shared variables to separate cache lines

### Summary 
- general techniques for scalability
	- can apply to applications
- Linux is actually pretty scalable
