---
date: 2025-10-16
tags:
- operating-systems
- distributed-systems
- concurrency
- computer-architecture
- storage
- performance
- caching
title: Machine-Independent Virtual Memory Management for Paged Uniprocessor and Multiprocessor
  Architectures
---

## Question
Q: Why does Mach support copy-on-write, and how does it implement it?
A: To provide consistency, through shadow pages which is the subset of the file of the affected pages that contain changes
## Abstract
- Design and implementation of virtual memory management within the CMU Mach Operating System
- Mach virtual memory consists of a single code module and its related header file
	- separates software memory management from hardware support without sacrificing system performance

## Mach
Goals:
- explore the relationship between hardware and software memory architectures
- design a memory management system that would readily portable to multiprocessor computing engines as well as traditional uniprocessors
Supports:
- large, sparse virtual address spaces,
- copy-on-write virtual copy operations,
- copy-on-write and read-write memory sharing between tasks
- memory mapped files
- user-provided backing store objects and pagers

### Design
5 basic abstractions:
1. *task* - execution environment which threads may run
	- basically a process in UNIX with a single thread of control
2. *thread* - basic unit of CPU utilization. 
	- All threads within a task share access to all task resources
- *port* - communication channel -- logically a queue for message protected by the kernel
	- *send* and *receive* are primitives operations on ports
- *message* - typed collection of data objects used in communication between threads
- *memory object* - collection of data provided and managed by a server which can be mapped into the address space of a task

Operations on objects other than messages are performed by sending messages to ports
- pure MPI
- Mach permits system services and resources (kernel) to be managed by user-state tasks
	- the Mach kernel itself can be considered a task with multiple threads of control
	- kernel acts as a server
		- which implements tasks, threads and memory object
	- act of creating a task, a thread or a memory object, returns access rights to a port which represents the new object and can be used to manipulate it

The indirection of MPI allows objects to be placed anywhere on the network.
- without something like hierarchy
	- for example a thread can suspend another thread by sending a suspend message to that thread's *thread port* even if the requesting thread is on another node in the network

Key to efficiency:
- Virtual memory management can be integrated with message-oriented communication facility
	- allows for large amounts of data including whole files and whole addr spaces to be sent in a single message with the efficiency of simple memory remapping

### Basic Virtual Memory Operations
- allocate region of VM on a page boundary
- deallocate a region of VM
- set the protections status of a region of VM
- specify the inheritance of region of VM
- create and mange a memory object that can then be mapped into addr space of another task

Mach can have copy-on-write and read/write sharing

![[Screenshot 2025-10-16 at 12.07.58 PM.png]]

## Implementation of Mach Virtual Memory
Four basic memory management data structures:
1. *resident page table*
	- table used to keep track of information about machine independent pages
2. *address map*
	- doubly linked list of map entries, each of which describes a mapping from a range of addresses to a region of memory object
3. *memory object*
	- a unit of backing storage managed by the kernel or a user task
4. *the physical map (pmap)*
	- a machine dependent memory mapping data structure (**hw defined physical address map**)
implementation is split between *machine independent* and *machine dependent* sections
- *Machine Dependent* code implements only those operations necessary to create, update and manage the hardware required mapping data structures
- *Machine independent* code maintains all important virtual memory information

### Managing Resident Memory
Memory per task/process

Physical memory in Mach is treated primarily as a cache for the contents of virtual memory objects
- information about physical pages is maintained in page entries in a table indexed by physical page number
- each page entry may be simultaneously linked into several lists:
	- *memory object list*
		- speed up object deallocation and virtual copy operations
	- *memory allocation queue*
		- free, reclaimable, and allocated pages used by Mach paging daemon
	- *object/offset hash bucket*
		- fast lookup
		- size of Mach page is a boot time system parameter so can be configurable

### Address Maps

*address map* - map of addresses within a task space to byte offsets in memory objects
 - doubly linked list of *address map entries* where each entry maps a contiguous range of virtual addresses onto a contiguous area of a memory object
 - ops performed on map:
	 - *page fault lookups*
	 - *copy/protection operations on addr ranges*
	 - *allocation/deallocation of addr ranges*

### Memory objects
*memory objects* - implements backing storage
- virtual memory object is a repository for data
	- like a UNIX file
*reference counter* - allows the object to be garbage collected when all mapped references to it are removed

*pager* - task that handles page faults and page-out requests outside of kernel
- each memory object has an associated pager
- access to a pager is represented by a port (*paging-object port*)
- *paging_name* - memory object id
![[Screenshot 2025-10-16 at 12.46.38 PM.png]]
![[Screenshot 2025-10-16 at 12.47.08 PM.png]]
### Sharing Memory: Sharing Maps and Shadow Objects
When **copy-on-write** copy is performed, two address maps which contain the copies, point to the same memory object
- This is okay as long as both tasks **only read the data**
- If one of the tasks writes the data "copied" in this way, **a new page assessable only to the writing tasks must be allocated with the new modifications**

Mach creates memory objects for holding modified pages which originally belonged to another object called ***Shadow Objects***
- A shadow object is created as a result of a copy-on-write fault (writing by a task)
- it relies on original object that it "shadows" for all unmodified data and only creates a page for the region it modified
- A shadow object itself can be shadowed

*sharing maps* - identical to an address maps, but points to shared memory objects


### Managing the Object Tree
Shadowing can create long chains of shadow objects. Mach automatically garbage collects shadow objects when it recognizes that an intermediate shadow is no longer needed.

### Machine-Independent/Machine-Dependent Interface
Machine Dependent:
- Physical addr maps (*pmaps*)
![[Screenshot 2025-10-16 at 1.07.30 PM.png]]

## Assessing Various Memory Management Architectures
- Mach needs no in-memory hardware-defined data structure to manage virtual memory

Multiprocessor issues:
- lack of consistency when changing virtual mappings
	- TLB is not kept consistent, no cache consistency