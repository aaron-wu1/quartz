---
date: 2025-09-26
tags:
- operating-systems
- concurrency
- performance
- computer-architecture
- storage
title: The Structure of the "THE" - Multiprogramming System by Edsger W. Dijkstra
---

Q: Dijkstra explicitly states their goals for the THE operating system. How do these goals compare to, say, Microsoft's goals for the Windows operating system? Why do we no longer build operating systems with the same goals as THE?

A: "THE" os focuses only on a small part of what now modern operating systems need to consider. There more business requirements. Also HW performance has increase multiple folds, hence less on the focus of optimization of managing resources more on meeting user needs at least for the general user.
Additional notes:
- portability across different hardware
- efficient use of hardware - can be less important
- security
- scalability
- fault tolerance
- ease of use, UI
- many users, common people

Q/A
- What problem does the paper address?
Allowing a computer to context switch between programs
- How is it different from previous work, if any?
New idea, able to prove it's correctly
- What is the approach used to solve the problem?
Create a system that with layers of separate responsibilities, divide the sequential process of an application and run at different levels
- How does the paper support or otherwise justify its arguments and conclusions?
Told us what the proof is
- Was the paper, in your judgement, successful in addressing the problem?
It didn't really show the proof itself
How does their proof not have "deadlocks"? How do they know at the lowest level, it's always ordered

## Multiprogramming system
All activities are divided over a number of sequential processes. These sequential processes are placed at various hierarchical levels, in each of which one or more independent abstractions have been implemented. 

## Electrologica X8
what they designed for... , old computer specs:
(1) core memory cycle time 2.5usec, 27 bits; at present 32K; 
(2) drum of 512K words, 1024 words per track, rev. time 40msec; 
(3) an indirect addressing mechanism very well suited for stack implementation;
(4) a sound system for commanding peripherals and controlling of interrupts; 
(5) a potentially great number of low capacity channels; ten of them are used (3 paper tape readers at 1000char/see; 3 paper tape punches at 150char/ sec; 2 teleprinters; a plotter; a line printer); 
(6) absence of a number of not unusual, awkward features.

## Goals
Process smoothly a continuous flow of user programs as a service:
1. reduction of a turn-around time for programs of short duration
	- batch system -> fast runtime
2. economic use of peripheral devices
	- Efficient use of hardware
3. automatic control of backing store to be combined with economic use of the central processor
	- paging - automatic control of backing store
4. economic feasibility to use the machine for those application for which only the flexibility of a general purpose computer is needed, but (as a rule) not the capacity nor the processing power.
Additional goals:
- **not** multiaccess system
- verification - verify soundness
- highlight benefits of layered design
- debugging/testing
- managing complexity


## System Structure
#### Storage Allocation
- Used paging, allows for non consecutive storage of programs which helps with multiprogramming
- "core pages" -> in magnetic memory? and "drum pages" -> persistent storage, secondary storage
- "segments" -> id for page and metadata (eg. empty page or not)
#### Processor Allocation
- In sequential process, only order matters
- The system organizes all activities into distinct sequential processes:
	- "segment controller"
	- "message interpreter"
- Allows from switch from processes to process

#### System Hierarchy
The total system admits a string hierarchical structure:
- Level 0 - responsibility for the processor allocation to one of the processes whose dynamic progress is logically permissible. Scheduler and timer interrupt
	- abstracts the CPU, provides processes and scheduling. Takes processes and schedule them on CPU, by time slice process
- Level 1 - "segment controller" synchronized with the drum interrupt and the sequential processes"
	- responsible for managing memory, swap or paging system.
	- abstraction: data segments (in modern terms: page)
	- drum = hard disk 
- Level 2 - "message interpreter" allocation of the console(can think of it as a display/screen) keyboard via conversations between operator and higher level processes
	- virtualize console (read output from machine), every process thinks they have their own console
	- abstraction: private console for each process
- Above level 2 - as if each process had its private conversational console (isolation and abstraction) 
- Level 3 - sequential processes associated with buffering of input streams and unbuffering of output streams, I/O for all peripherals
	- abstraction: virtual devices
- Level 4 - independent user programs, all the other apps
- Level 5 - operator/user

## Design Experience
Learned reasoning principles behind synchronization:
- No information can be used before it has been produced
- No peripheral can be set to two tasks simultaneously
- etc
Processes that fit above time requirements can be synchronized

## Tradeoffs of Layered Architecture
| Pros                                                                         | Cons                                                                             |
| :--------------------------------------------------------------------------- | :------------------------------------------------------------------------------- |
| manage complexity                                                            | less flexibility, constrained to layers                                          |
| clear abstractions                                                           | performance overhead                                                             |
| isolation - able test each layer in isolation<br>- for debugging and testing | dependencies between layers, lower layers can affect upper layers' functionality |
| modularity - swap out layers, easier to change layers                        | careful design<br>- avoid circular dependencies                                  |

## Side Note From Lecture
### Structure of Modern OSes
Linux - 2 main layers:
- User-level apps
------------------  Privilege boundary ----------
- Kernel

Windows - 2 main layers:
- User-level apps
------------
- Win32 subsystem
------------------  Privilege boundary ----------
- Kernel
-----
HAL = hardware abstraction layer

### Hardware Trends
Keep in mind these numbers:
- absolute number - e.g. throughput
- change over time (trend)
- relative change - how does the trend compare?

|                         | 1968                     | 2025                     | factor change |
| :---------------------- | :----------------------- | ------------------------ | ------------- |
| clock speed             | 400 kHZ                  | 3GHz                     | 7500x         |
| memory capacity         | 32 KB                    | 32 GB                    | 1,000,000x    |
| storage capacity        | 512 K words              | 10 TB                    | 20,000,000x   |
| stirage revolution time | 40 ms                    | 7200 rpm -> 8ms          | 5x            |
| paper readers (IO)      | 1000 chars/s -> 8kbits/s | 300 Mbps (network cable) | 37,500x       |

## Sequential Process
- single threaded stream of instructions
- can suspend and resume later

Dijkstra is contrasting sequential process with electrical circuits?
- electrical circuits is controlled by the clock providing clear order, sequential process don't have that so need synchronization to have order
## Synchronizing Primitives
- Semaphore
	- P decreases value, probern (to test) from dutch words
	- V increases the value, verhogen (to increment)
	- 2 different ways to use semaphores:
		- mutex
		- coordination - uses private semaphores that are managed internally
	- Harmonious cooperation
		- deadly embrace, deadlock
		- Dijkstra trying to prove their system can't deadlock
			- solution: processes only block on a lower level, not higher
	- Corollary 1: If a semaphore value is nonpositive its absolute value equals the number of processes booked on its waiting list
	- Corollary 2: The P-operation represents the potential delay, the complementary V-operation represents the removal of a barrier
- Mutex
	- max value = 1, init value
	- min value = -(n-1) for n parallel process
- **Private Semaphore**
	- init = 0
	- min val = -1
	- max val = 1
	- No other process can perform P-op on a process' private semaphore


## THE Paper Summary
- layered OS structure
- abstraction: sequential processes
- semaphores for synchronization
- emphasis on correctness