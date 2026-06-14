---
date: 2025-09-28
tags: 
---
Q: How does synchronization in the RC 4000 system compare with synchronization in the THE system?
A: It's more durable than THE system. Particularly in the fact that it handles byzantine faults where the processes don't play nicely. It also tackles consensus too between processes which THE system doesn't. THE system only knows if it can or can't proceed with an action and not share state. 

Questions:
System nucleus -> start of the idea of a kernel?

## Goals
- extensibility
- flexible OS design
-> if we jump forward in time... this is basically the start of the idea of virtual machines
## Abstract
This paper describes the philosophy and structure of a multiprogramming system that can be extended with a hierarchy of operating systems to suit diverse requirements of program scheduling and resource allocation. The system nucleus simulates an environment in which program execution and input/ output are handled uniformly as parallel, cooperating processes. A fundamental set of primitives allows the dynamic creation and control of a hierarchy of processes as well as the communication among them.

## Introduction
At the time, multiprogramming systems only supports one mode of operation. It lacks the freedom to switch between different modes like: batch processing, priority scheduling, real-time scheduling or conversational access.

## System Nucleus
Concentrated on creating an environment where parallel, cooperating processes can exist
- Defined "What is a process?"
- Select primitives for synchronization and transfer of information among parallel processes
Implements these fundamental concepts:
- simulation of processes
- communication among processes; creation, control and removal of processes
**additional notes**
- Nucleus
	- small nucleus - provides key set of abstractions to build OS ontop of it
	- support multiple OSes
- Components of Nucleus:
	- process and process control - create, start, stop, remove
	- IPC via messages
	- interrupts and exceptions
	- scheduling - round robin
- OSes on top of Nucleus
	- memory management - hierarchical approach
	- process management - hierarchical approach
- Abstractions in Nucleus
	- processes
		- internal - typical modern process
		- external - wrapper around a hardware device
			- note: unix uses files to represent devices
	- message

## Principal of OS design: economy of abstraction
Design a small number of abstractions to perform a large number of actions
- external processes
- synchronization via messages
	- the system had some cleanup
- clock processes

## Processes
Two types: **internal** and **external**

Prereq definitions:
- *Program* - collection of instructions describing a computational process
- *process* - execution of these instructions, program under execution
- *peripheral device* - an item of hw connected to the data channel and is identified by a device number
- *document* - collection of data stored on a physical medium

*Internal process* is the execution of one or more interruptible programs in a given storage area

*external process* is the I/O of a given document identified by a unique process name. This concept implies that internal processes can refer to documents by name without knowing the actual devices on which they are mounted

## Process Communication
Dijkstra's semaphores work if all processes are playing as expected. If a processes is not playing nice, it breaks the logic (thinking of byzantine faults here in DS)

Rather Hansen demonstrates using *message buffering* within the system nucleus as the basic means of process communication
- The system nucleus administers a common pool of message buffers and message queue for each process.
- Includes communication primitives:
	- send message (receiver, message, buffer) 
		- copies message to first available buffer within the pool and delivers it in the queue of a named receiver.  Receiver is activated if in "waiting" state 
	- wait message (sender, message, buffer)
		- delays requesting process until a message arrives in queue
	- send answer (result, answer, buffer)
		- copies an answer into a buffer in which a message has been received and delivers it in the queue of the original sender
	- wait answer (result, answer, buffer)
		- delays the requesting process until an answer arrives in the given buffer
- The queues are FIFO

It's advantages are:
- multiprogramming system is dynamic, processes can appear and disappear at any time. A process does not in general have a complete knowledge of the existence of other processes
	- wait message makes it possible for a process to be unaware of the existence of other processes until it receives a message from them

Design requirements:
- handle bad actors, system nucleus needs to ensure that no other process can interfere with a conversation with two processes
- once connection is established, need common identification of order
- To make the system dynamic, any process can be removed at any time. Even if the process is engaged in a conversation. The system nucleus leaves the state of the conversation in the queues of the other processes and returns the buffers to the common pool.
- The reverse: If a process is removed and a sender is requesting a message, a dummy answer has to be sent back to the sender
- Limit number of messages sent simultaneously to prevent blocking

## External Processes
For each kind of external process, the system nucleus contains a piece of code that interprets a message from an internal process and initiates input/output using a storage area specified in the message. On interrupt, nucleus generates answer to internal process.
- External processes are created on request from internal processes. or assignment of a name to a particular peripheral device
- has primitives: *reservation* and *release* of external processes

## Internal Processes
Internal processes are created on request from other internal processes.
**System nucleus primitives** (This sounds like the start of syscalls)
- *creation*
	- after creation, parent process can load a program into the child process and start it -> encapsulation
- *control*
- *removal*
	- clear storage area for other processes

## Process Hierarchy
Have fundamental set of primitives, now need control strategies of communication, program scheduling and resource allocation or in all *operating systems*.

The issue is now, how can the operating systems have control over production processes?
- It's solved by arranging the internal processes in a *hierarchy* which parent processes have complete control over child processes

Design choices:
- All privileged functions are implemented in the system nucleus, which has no built-in strategy (policies)
	- Like syscalls
- Only rules of nucleus
	- a process can only allocate a subset of its own resources to its children
	- a process can only start, stop, and remove its own children
	- after a removal of a process its resources are returned to the parent process
- All system resources are owned by the basic operating system S

Design Rational:
- Extensible, build upon operating system due to hierarchical setup, no modification to system nucleus
- Replaceable, defined primitives (interface) that the underlying OS logic can be swapped 
- Std programs and user programs can be executed under diff OS, abstraction of OS away from std programs and user programs


## Nucleus Paper Summary
 - goal: flexible OS design
 - structure: small nucleus, OSes layered on top
 - synchronization via message passing
 - small number of abstractions








 


