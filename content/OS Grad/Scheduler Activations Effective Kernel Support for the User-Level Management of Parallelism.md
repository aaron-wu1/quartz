---
date: 2025-11-02
tags:
  - operating-systems
  - scheduling
---
source: https://dl.acm.org/doi/pdf/10.1145/146941.146944

## Question
The goal of scheduler activations is to have the benefits of both user and kernel threads without their limitations. What are the limitations of user and kernel threads, and what are the benefits that scheduler activations provide?
- Limitations:
	- User threads - bad performance if requires lots of privileged operations, trap to kernel
	- Kernel threads - too heavy, not flexible to use cases
- Scheduler activations provide the flexibility and performance of user threads but the functionalities of a kernel thread
## Reader Notes:
- One modern incarnation of user-level threads is goroutines in GO( described in [Illustrated Tales of Go Runtime Scheduler](https://medium.com/@ankur_anand/illustrated-tales-of-go-runtime-scheduler-74809ef6d19b)).)
- Try to distinguish between user and kernel treads throughout this paper

## Abstract
- Threads can be supported by either OS kernel or user-level library code
- The paper argues:
	- Performance of kernel threads is *inherently* worse than that of user-level threads
	- Problems encountered in integrating user-level threads with other system services is a consequence of the lack of kernel support for user-level threads
		- Kernel threads are the *wrong abstraction* to support user-level management of parallelism
- It presents a new take of a kernel interface and user-level thread package that provide the same functionality as kernel threads without losing the performance and flexibility of user-level management of parallelism.

## Background
To consider:
- **Cost of parallelism** - performance of parallelism is hindered by the cost of creating and managing parallelism
- **Processes** - too heavy of a hit on performance, hence use of *threads* 
### The problem
Threads can be supported on **user-level** or **kernel level**
- User-level threads are managed by runtime library routines linked into each application so that thread management operations require no kernel intervention
	- **Performant**: cost of user-level threads operations is close to a cost of a procedure call
	- **Flexible** to needs of the language or user without kernel modification
- Kernel threads avoids the system integration problems because the kernel directly schedules each application's threads onto physical processors
	- Too heavyweight for use in many parallel programs
- Performance from worst to best:
	- process
	- kernel thread
	- user-level thread
	- procedure

As a result, user-level threads have been implemented on top of the kernel threads (Mach - CThreads, Topaz - WorkCrews)
- But **since user-level threads are built on top of kernel threads exactly as they are built on top of traditional processes; they have the same performance, and they suffer exactly the same problems**

**Core issue:**
- Should the programmer employ user-level threads, which have good performance and correct behavior (assuming the application is uniprogrammed and does no I/O)
	- uniprogrammed - only one program running on the system at a time (no trapping to kernel for context switching)
- OR employ kernel threads which has worse performance but not as restricted

### Cost of Kernel Threads
- *Cost of accessing thread management operations*: With kernel threads, the program must cross an extra protection boundary on every thread operation, even when the processor is being switched between threads in the same address space.
- *Cost of generality* - one implementation is used by all applications
	- eg. Kernel threads generally implement preemptive priority scheduling, even through most parallel apps can use a simpler policy like FIFO
- *Cost of modifying the kernel* - yeah don't want to go through all this trouble just to support one use case for one app

### Poor integration of User-Level Threads on Traditional Kernel interface
Two key issues with kernel threads:
- Kernel threads block, resume and are preempted without notification to the user level
	- user-level thread library loses track of which threads are actually running
- Kernel threads are scheduled obliviously with respect to the user-level state
	- OS may schedule the wrong thread or leave CPUs idle while runnable user threads exist
**Ultimately needs information shared between kernel and user scheduler**

## Goals
Introduce a kernel interface and user-level thread package that together combine the functionality of kernel threads with the performance and flexibility of user-level threads

Cases addressed:
- Common case: when thread ops don't need kernel intervention, performance is essentially the same as that achieved by existing user-level thread management systems
- Infrequent case: when the kernel is involved (I/O), the system mimics the behavior of a kernel thread management system

To allocate processors among application:
- kernel needs access to user-level scheduling information
To manage application's parallelism:
- the user-level support software needs to be aware of kernel events that are normally hidden from the app

## Solution
**Provide each application with a *virtual multiprocessor*, an abstraction of a dedicated physical machine**

Each application knows exactly how many (and which) processors have been allocated to it and has complete control over which of its threads are running on those processors.
- Kernel tells the *user thread scheduler* all it's actions on their address space (blocking a thread or preempting)
- The thread system in each address space notifies the kernel of the subset of user-level thread ops that can affect processor allocation (tells whether it needs more or less processors)
- The kernel mechanism for this is called *scheduler activations*
	- scheduler activation vectors helps the kernel and user-level thread scheduler to cooperate/communicate

### Kernel Support for User-Level Management
Kernel gives each process **N** processors, but the **user-level scheduler** decides which threads to run on those processors (not the kernel)

**Application programmer sees no difference besides performance**

**Uses Scheduler Activations**
- Upcall - special control transfer where the kernel enters the user-level scheduler with
	- Event that occured (block, wakeup, preemption)
	- Saved register state of the affected thread
	- Fresh activation context to run the user scheduler

#### **Handling Critical Sections**: Preventing Deadlocks
- If a user thread is preempted while holding a lock
	- Activation detects this and resumes the interrupted thread until it exits the critical section
		- can detect because the kernel notifies user-level scheduler
	- Then thread scheduling continues to prevent deadlock

#### Scheduler Activation Roles
- Holds execution context for user-level threads
- Notifies user-level thread system of a kernel event
- Provides space in the kernel for saving the processor context of the activation's current user-level thread

#### Scheduler Data structures
- 2 execution stacks:
	- one on kernel
	- one on app address space
- When user-level thread calls into kernel, it uses the activation's kernel stack

#### Notifying the Kernel for updating Processor Allocation
Notifies a small subsets of thread operations that affect the kernel's processor allocation decision

Interface:
- `add more processors(count)`
	- Allocate more processors to this address space
- `this processor is idle()`
	- preempt this processor


