---
date: 2025-10-21
tags:
  - OS
  - distributed-systems
---
- interfaces - exposed vs transparent
- Centralization vs distribution
- implementation

![[Dist OS]]

## Sprite

### Technology Trends
Good for motivating system design and research problems. Eg one metric is scaling but another isn't
- larger memories - increasing DRAM, more storage capacity
- rise of networking - interconnected machines
	- workstations connected by a network
	- sharing 
		- finding files(harder compared to a time-shared machine back in the day)
		- idle machines, how to utilize
	- management /admin
	- transparency - users should not notice that they are running on a distributed platform
- Multiprocessors
	- parallelism and sharing
	- OS -> multiprocessors
	- they were thinking of how to better support parallelism within the operating system itself
### Features of Sprite
- Distributed file system
	- utilize file caching
		- can do due to larger memories
- RPCs
- Process migration:
	- idle machines utilization
- Single global namespace
	- used for finding files
- Subsystem  + Monitors (RCU)
	- OS -> multiprocessor 
- Shared Fork
	- parallelism and sharing

### Caching
Caches file data on both client and server
![[Sprite OS Caching]]

- concurrent sharing
	- disable caching
- sequential sharing
	- version numbers - change file block, increment version number
- Sys design - keep common case fast and don't care as much about non-common cases 
- backing store - regular files
	- everything is represent as a file, helps with caching because everything is same type 

### Physical Memory Allocation
- file buffer cache vs virtual memory
- ![[Sprite storage]]
- Adjust based on requirements

### Process Migration
- Allow processes to migrate across workstations
- Goals: transparency - don't want it visible to the users
- `pmake` - parallel make tool
- Freeze process, then transfer over
- Kernel calls:
	- Different kernels have different states -> different results
	- How can we do this transparently?
		- Forwarded back to home machine
	- **Today** - use VM instead because it encapsulates kernel state

### Shared Fork
"Processes in shared address space" - threads
Unix: share code
Sprite: shared_fork -> share both code and data (heap)
- Why not share stack?
	- we want threads to have separate states of execution or diverging states of execution and that requires a different stack per thread
- **Today**
	- `pthread_create` -> share code and data

## Sprite Summary
- file caching protocol
- When thinking about research/system design:
	- **Consider technology trends in system design**

## LegoOS
Monolithic Servers - CPU + Memory + Storage
![[Monolithic Server]]
Properties:
- *Cache-coherent interconnects*: One CPU write to DRAM is visible to all CPUs
- *High bandwidth low latency within same server*
- Network card to connect to data center network

### Hardware Disaggregation
Separate all the components inside monolithic server and connect it to data center network individual instead.
![[HW Disaggregation]]
- organize HW into blades

### Benefits
- resource elasticity
	- Scale up more memory or CPU resources individually/independently
- specialized hardware
	- Easier to adopt new specialty hardware
- more fine-grained failure domains
	- improve reliability of system overall
- improve resource utilization
	- users might over estimate resources, more flexibility
	- *bin-packing problem* - many different jobs and scheduler has to find a place to schedule job
		- how to pack jobs into server as efficiently as possible...
		- result is stranded resources

Performance is a non-goal, due to increase in overhead.
- Benefits outweighs overhead
- If it's close enough to Linux monolithic server

### Challenges
- interconnect:
	- 500 Gbps, 50ns latency
- data center network: 40 Gbps, 6 us latnecy
- **today**: 100+ GBps, few us latency

### LegoOS
Need to implement a significant part of LinuxOS
#### Split Kernel
- pComp, mComp, sComp
- monitor - manager for component
![[LegoOS Split Kernel]]
#### 2-level memory management
- *vRegions* 
- *vma trees* - fine grained memory allocation within vRegions
	- just within memory component

### Implementation
- On commodity hardware, enable and disable different pieces of HW

### Evaluation
- small working sets - perf. a little worse within 2x on standard server
- large working sets - better perf.
	- accessing memory over the network is faster than locally

### Adoption
- disaggregated GPUs
- disaggregated storage - blob storage
- disaggregated memory - still active area of research
- machines are larger, makes *bin-packing* problem easier

### LegoOS Summary
- Splitkernel approach -> disaggregated OS
- Exploring this extreme point in design space
	- learning a lot about limits of research and how to backoff and create something valuable


