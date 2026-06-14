---
date: 2025-10-13
tags:
- operating-systems
- concurrency
title: Monitors An Operating System Structuring Concept
---

source:  [Monitors: An Operating System Structuring Concept](https://dl.acm.org/doi/pdf/10.1145/355620.361161)
## Summary
The paper introduces monitors a collection of scheduler for resources. Monitors are a new abstraction boundary for synchronization where to access resources, programmers would need to interact with the monitor to see if was available for their process. This protects the resource and abstracts synchronization away from the programmer to handle.

## Questions
Q: What are "monitor invariant" I and "condition" B, and why are they important in the discussion of monitors?

## Background
A primary aim of an operating system is to share a computer installation among many programs making unpredictable demands upon its resources.

A primary task of its designer is therefore to construct the resource allocation algos to utilize hardware resources

A design would be constructing separate schedulers for each class of resource
- each scheduler will consist of some local admin data and procedures/functions that are called by programs wishing to acquire and release resources
This collection of associated data and procedures is a **monitor**.

**Monitor procedures**
- same as all other running programs
- only one program at a time can enter a monitor procedure
	- need a **"wait" operation** issued from inside the procedure of the monitor to delay program
	- need a **"signal" operation** issued from inside the procedure of the monitor to resume one of the waiting programs
- *local procedures* - monitor procedure that belong inside the monitor or runs under the monitor's protection

**Design notes**
- natural to design in this order:  procedure headings, the data, the condition, and the procedure bodies
- Acquire procedure does not have to retest that busy has gone false when it resume after its wait, since the release procedure has guaranteed that this is so
- FIFO reactivation on waiting programs
- single resource monitor simulates a Boolean semaphore
Monitor pesudo code
![[Screenshot 2025-10-13 at 3.05.24 PM.png]]
handles *mutual exclusion* and *coordination*
## Interpretation
Monitors implemented by semaphores
- Boolean semaphore for "mutex"
- "urgent" semaphore - count of which signaling processes suspended themselves
- "condsem" - which a process desiring to wait suspends itself