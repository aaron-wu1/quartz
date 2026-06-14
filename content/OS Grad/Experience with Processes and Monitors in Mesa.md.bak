---
date: 2025-10-13
tags: 
---
source: [Experience with Processes and Monitors in Mesa](https://dl.acm.org/doi/pdf/10.1145/358818.358824)

## Summary
## Question
Q: Compare and contrast synchronization in Java with Hoare monitors and Mesa monitors.

Synchronization in Java

Synchronization in Mesa Monitors:
- explicit interface with private and public procedures

## Introduction
**Goals**
- *Local concurrent programming*
	- an individual application can be implemented as a group of synchronized processes for concurrency (threads?)
- *Global resource sharing*
	- Independent applications can run together on the same machine, cooperatively sharing the resources; can share the processor
- *Replacing interrupts*
	- request for software attention to a device can be handled directly by waking up an appropriate process, without going through a separate interrupt mechanism 
**Issues with prior work on monitors**
- *Program structure*
	- Mesa has a framework for organizing programs into modules which communicate through defined interfaces. Processes must fit into this scheme
- *Creating processes*
	- idk TODO
- *Creating Monitors*
	- prior work had a fixed number of monitors
- *WAIT in nested monitor call*
	- idk TODO
- *Exceptions*
	- a realistic system must have timeouts and to abort a process
	- Mesa uses a `UNWIND` mechanism for abandoning part of a sequential computation in an orderly way
- *Scheduling*
	- No agreed scheduling yet
- *Input-output*
	- details in integrating I/O into framework of monitors and condition variables had not been fully worked out
monitors are shared memory in this paper

## Monitors
Monitors act as the component to synchronize access of data between several processes. Consists of:
- synchronization
- the shared data
- the body of code which performs the access
The data is *protected* by a *monitor* and can only be accessed within the body of a *monitor procedure*. There are two kinds of monitor procedures:
- *entry procedures* - can be called from outside monitor
- *internal procedures* - can only be called from inside the monitor
Processes can only perform operation on the data by calling *entry procedures*!

**Mesa Monitors**
- simplest monitor is a instance of a *module*, basic unit of global program structuring
	- *Mesa module* consists of a collection of procedures and their global data
	- a module has `PUBLIC` procedures (External interface)
	- and `PRIVATE` procedures (internal implementation)
- A monitor modules differs a bit from a standard mesa module:
	- *entry* 
	- *internal* (private)
	- *external* (nonmonitor procedures)
**Monitor correctness argument**
- The monitor maintains an *invariant* which is always true of its data, except when some process is executing in the monitor. Whenever control leaves the monitor, this invariant must be established. In return, whenever control enters the monitor the invariant can be assumed. Thus an entry procedure must establish the invariant before returning, and monitor procedures must establish it before doing a `WAIT`
	- *invariant* - logical state inside a monitor that is always true no matter what is accessing it

- Timeout - waiting
- Abort - running
- Broadcast - notify