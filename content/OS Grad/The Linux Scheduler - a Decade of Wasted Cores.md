---
date: 2025-11-30
tags:
- operating-systems
- performance
- concurrency
title: The Linux Scheduler - a Decade of Wasted Cores
---

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