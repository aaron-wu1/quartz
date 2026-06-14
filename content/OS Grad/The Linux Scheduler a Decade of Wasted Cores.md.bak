---
date: 2025-11-03
tags:
---
source: https://dl.acm.org/doi/abs/10.1145/2901318.2901326

Source: https://dl.acm.org/doi/pdf/10.1145/2901318.2901326

## Background
### OS scheduler
What an OS scheduler does is answer two questions:
1. Which thread should run next
2. How long should the thread run for

## CFS
Linux's general-purpose scheduler is called **CFS** or Completely Fair Scheduler
- Goal: If two threads want the CPU, and they have the same priority, each should get roughly the same share of CPU time
- Wall-clock time doesn't work well in the real world since it doesn't take into consideration priorities
	- Use **vruntime** instead or how much CPU time a task has received; scaled by its priority
		- higher priority accumulates vruntime slower
		- lower priority accumulates vruntime faster
		- This also allows for smooth time slicing and not abrupt time slice jumps

CFS uses a red-black tree to keep track of tasks and their vruntime. Finding the smallest vruntime becomes reading the leftmost node

CFS picks a target latency or the time window in which every runnable task should run at least once. Each task should run at least: 
- `Target latency / tasks =  min task time`
  
**Nice** in Linux is used to set priority

### Core ideas
- Tracks fairness with **vruntime**, not wall-clock time
- vruntime increases while a task runs; rate depends on priority
- Runnable tasks stored in a red-black tree keyed by vruntime
- Scheduler picks smallest vruntime
- Time slice is determined by **target latency / runnable tasks**
- Result is smooth fairness rather than quantum-based scheduling

## Multicore
-  Each CPU has its **own runqueue** and its own red-black tree
	- Avoids lock contention
	- Each core to pick next task locally
	- Scalability
- **Scheduling is mostly done per-core, not globally**
- Issue now is how to you maximize idle cores whose runqueues are empty
	- **Load balancing** - use one core as an LB 
- Why not cores steal from other threads instantly?
	- contention: cache line ping pong between threads - stall
	- thrashing: thread moved across cores loses cache warmth, cache becomes cold
- **Scheduling domains** - Linux builds a hierarchy of execution levels
	- Like:
		- Level 1: SMT siblings
		- Level 2: cores sharing an LLC
		- Level 3: cores in the same NUMA node
		- Level 4: all cores in the machine
	- The goal is to reduce cost of scanning remote cores


-------- 
Old and Long version...
## Questions
What makes multicore scheduling more challenging than single-core scheduling?
## Reader note
- CPU scheduling has gotten a lot more complex as CPU technology has advanced beyond single-core CPUs.
- Focus on understanding what makes scheduling challenging with modern CPUs and what techniques can be used to address these challenges.

## Abstract
**OS thread scheduler must maintain invariant**:
- Make sure that ready threads are scheduled on available cores
But this invariant is often broken in Linux.

The paper discovers why this invariant is broken and their fixes

## Introduction
**Challenges of modern CPUs (multicore)**
- Non-uniform memory access latencies (NUMA)
	- when memory access time depends on which CPU core is accessing which region of memory
- High costs of cache coherency and synchronization
- Diverging CPU and memory latencies

**Core issue**
- *The scheduler unintentionally and for a long time leaves cores idle while there are runnable threads waiting in runqueues*

**How the authors confirmed that the scheduler was the issue**
- Developed:
	- *sanity checker* - a tool  that periodically checks for the violation of the invarient, catches the bugs and collect a trace
		- invarient: Make sure that ready threads are scheduled on available cores
	- Visualization tool, that visualizes the trace of scheduling activity

## Linux Scheduler
Linux's *Completely Fair Scheduling (CFS)* algorithm

### On single CPU
- CFS uses a *weighted fair queuing (WFQ)* scheduling algorithm
	- CPU cycles are divided among threads in proportion to their weights
	- CFS time-slices the CPU among the running threads
		- **Scheduler defines a fixed time interval** where that each thread in the system must run at least once in the interval
		- The interval is divided among threads proportionally to their *weights*
		- A thread's weight is essentially its priority or *niceness* in UNIX
	- When a thread runs, it accumulates *vruntime* (runtime/weight)
		- Once a thread's *vruntime* exceeds its assigned timeslice, the thread is preempted from the CPU if there are other runnable threads available.
		- A thread might also get preempt if another thread with a smaller *vruntime* is awoken
	- Threads are organized in a *runqueue* as a red-black tree, in which the threads are sorted in the increasing order off their *vruntime*
	- When a CPU looks for a new thread to run it picks the leftmost node in the red-black tree, which contains the thread with the smallest *vruntime*

### On multi-core systems
**New challenge**: 
- balancing load between cores (expensive)

#### How CFS's load balancing algorithm works
**Load tracking metric**
 - Strawman's load balancing algorithm would be to distribute roughly equal threads to cores
	 - Issue is that it doesn't take priorities into account
- Weight is also not enough
	- Say a high priority thread is on one core, many low priority threads on another and they are balanced through weights
	- Now the high priority core sleeps often, causing the CPU thread to idle. The CPU can "steal" other threads to run but that should've been the responsibility of the scheduler to avoid this and defeats the purpose of per-core runqueues.
- Need a metric for **load** - combination of the thread's weight and its average CPU utilization

**Load-balancing algorithm**
- Basic load balancing is greedily choosing the most loaded core and transfering tasks to the least loaded core
	- Issue is that this doesn't consider **cache locality** or **NUMA**
- Create a hierarchy of cores and their relationships based on NUMA nodes called *scheduling domain*
- Breakdown:
	- Load balancing is run for each scheduling domain starting from the bottom to the top
	- At each level, one core of each domain is responsible for balancing the load
		- Core is either the first idle core of scheduling domain, if the domain has idle cores whose free CPU cycles can be used for load balancing
		- The first core of the scheduling domain otherwise
	- Average load is computed for each scheduling group of the scheduling domain
		- *busiest* group is picked, based on heuristics that favor overloaded and imbalanced groups
	- If the busiest group's load is lower than the local group's load, the load is considered balanced at this level
	- Otherwise, the load is balanced between local CPU and the busiest CPU of the group
- In a scheduling domain, the sets of cores among which the load balancing is performed are called *scheduling groups*

**Optimizations**
Scheduler prevents duplicating work by running the load-balancing algorithm only on the *designated core* for a given scheduling domain

## Bugs
- **Group Imbalance bug** - load balancing decisions are based on average load per scheduling group, not per core load
	- average is skewed
	- Fix:
		- Instead of *average loads* -> *minimum load* per group, reveals the idle cores
- **Scheduling Group Construction Bug** - when using taskset ot pin threads to specific NUMA nodes, incorrectly builds scheduling groups with Node 0's perspective
	- Fix:
		- Build scheduling groups from the perspective of each node
- **Overload-on-Wakeup Bug** - When a sleeping thread wakes up, Linux tries to place it close to the waking thread for cache locality. Causes issue with already overloaded cores
	- Fix:
		- Wake threads on the **longest-idle** core if available, instead of locality
- **Missing Scheduling Domains Bug** - if a core is disabled and re-enabled via `/proc`, the kernel forgets to rebuild top-level scheduling domains
	- Fix:
		- Restore the missing call that rebuilds scheduling domains across NUMA nodes

## Lesson Learned
- Scheduler requires modularity due to rapid evolution of HW
	- more bugs -> more fixes -> need to be integrated
- Visualization tools helps explore data