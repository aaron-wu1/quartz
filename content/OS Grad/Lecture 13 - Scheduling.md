---
date: 2025-11-04
tags:
- operating-systems
- concurrency
- performance
- computer-architecture
title: Lecture 13 - Scheduling
---

## Scheduler Activations

| Kernel-level threads                                                                                          | User-level threads                           |
| ------------------------------------------------------------------------------------------------------------- | -------------------------------------------- |
| OS is aware of them, manages them                                                                             | purpose: express concurrency in applications |
| Purpose: leveraging physical parallelism                                                                      | Managed by user level thread libraries       |
| Example: pthreads (fn: exit, yield, etc)                                                                      |                                              |
| Misconception: it's only in kernel space, it can execute in user space.<br>Note: the kernel just manages them |                                              |
![[User vs Kernel Thread]]


### Threading Models
- *M:N threading* - Multiplex user-level threads over kernel threads
	- where n = kernel threads
	- where m = user-level threads
	- M>>N
- *M:M threading* - map user-level threads directly to kernel threads
- *M:1 threading* - only run on one core, one kernel threads multiplexes user-level threads (not as used as much anymore)
	- no physical parallelism

### Tradeoffs between user-level threads

| User-level threads                                                                                                                           | Kernel-level threads |
| -------------------------------------------------------------------------------------------------------------------------------------------- | -------------------- |
| lower overhead                                                                                                                               | higher overhead      |
| Kernel events are hidden from user level<br>- lots of ways threads block in kernel I/O, page faults<br>- OS can preempt kernel-level threads | OS awareness         |
| Customizable, specialized                                                                                                                    | general purpose      |
|                                                                                                                                              | hardware parallelism |
|                                                                                                                                              | more isolation       |
### Scheduler Activations
![[Scheduler Activations]]
- OS just allocates cores
- User-level schedules threads across cores 
- This is called **2-level scheduling**
- **invariant**: # of active SAs = # of cores
- OS adds a core to an app: create a new sched. activation
- OS revokes a core: 
	- preempts 2 SAs, uses one for an upcall

### In Go
- it tries to detect if one kernel thread is blocked then try to wake up a new kernel level thread
- not scheduler activations

### Summary of Scheduler Activations
- Pros/Cons of user-level and kernel-level threads
- Use of upcalls to notify user levels whenever scheduling decisions has been made

## Decade of Wasted Cores
- Linus Torvalds, what do you know?
	- his temper
	- his response to commits
	- ego
	- Git, Linux
	- advocate for monolithic kernels
	- advocate for open source software

### Scheduler Goals
- Fair allocation of compute - policy
- Prioritize important tasks - policy
- Work conserving - no core is idle if there are runnable threads
- Performance - cache locality
- efficient - power usage, locality
- scaling
- general purpose

### Single-Core Scheduling
![[single core scheduling]]
### CFS: Completely Fair Scheduler
- Preemptive - timeslice (e.g. a few ms)
- weighted - vruntime
- Implemented using a red-black tree

### Multi-Core Scheduling
- one runqueue per core
- ![[Multi-core scheduling]]
- Why multiple runqueues / core? 
	- Avoids contention for 1 queue
		- So runqueue isn't the bottleneck
#### Challenges
- load imbalance
	- expensive to remedy
- complex cache hierarchies
- hyperthreads (SMT)
![[threads on core]]

### Load Balancing in Linux
- periodic load balancing
- "emergency" load balancing - idle core, try to steal
- on creation/wakeup
	- try to place on an idle core

### Metrics
- In Linux:
	- number of threads
	- sum of weights (priorities)
	- load - combine weights and average CPU utilization
	- groups 

### Load-Balancing Algorithm
- Idea: if we didn't care about cache locality, we would want to perfectly balance cores, but we do care!
	- **hierarchical approach**
		- 1 core per group balances load
		- prevent need to moving across sockets
		- ![[load bal cores]]
### Group Imbalance Bug
- 8 NUMA nodes, 8 cores each
- 64 compilation threads -> load 1 
- 2 R threads -> load 64 - due to high average
- R threads would run on each socket with load of 64, rest of 64 threads would be balanced on rest of NUMA loads. Other 7 cores was just idle
	- FIX: rather than average, use minimum instead

### Overload on Wakeup Bug
- thread wakeups
- threads woken on busy local core rather than another idle core
- fix: favor idle cores for wakeups

### Summary of Wasted Cores
- Design of scalable CPU scheduler with per-core runqueues
- Approaches to balancing load
- CPU scheduling is complex