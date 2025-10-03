---
date: 2025-10-01
tags:
  - summary
---
Paper Source: https://dl.acm.org/doi/pdf/10.1145/361268.361271
Summary of TENEX, a Paged Time Sharing System for the PDP-10 by Daniel G. Bobrow, Jerry D. Burchfiel, Daniel L. Murphy, and Raymond S. Tomlinson Bolt Beranek and Newman Inc.*

## Abstract
- TENEX - new time sharing OS with paging hw
- Overview of design and goals
- Specifications of:
	- powerful multiprocess large memory virtual machine
	- intimate terminal interaction
	- comprehensive uniform file and I/O capabilities
	- clean and flexible system structure
## Introduction
TENEX is a new time sharing OS implemented on DEC PDP-10 (old mainframe computer)
Design Constraints:
- Minimal changes made to PDP-10 processor and none to the basic address computation
- that the system had to be in service for users within six month of operation of the HW

**Lecture Notes**
- Hardware was more extensible than today
- Terminology
	- different terms for the same thing
		- monitor -> kernel
	- same term for different things
		- virtual machine (need to think about what we are virtualizing)
			- hardware (VMware)
			- language (Java) - bytecode
				- virtualizing the bytecode layer
			- OS syscall interface (TENEX)
				- run multiple different processes
### Design Goals
Falls into three broad categories:
- State of the art virtual machine
	- Paged virtual address space equal to or greater than the addressing capability of the processor with full provision for protection and sharing (need to handle invalid addresses)
	- Multiple process capability in virtual machine with appropriate communication facilities (support multiple processes running)
	- File system integrated into virtual address space, built on multilevel symbolic directory structure with protection, and providing consistent access to all external I/O devices and data streams (modern file system)
	- Extended instruction repertoire making available many common operations as single instructions (abstraction of complex instructions)
- Good human engineering throughout the system
	- An executive command language interpreter which provides direct access to a large variety of small, commonly used system functions, and access to and control over all other subsystems and user programs
		- uses EXEC command language to control the OS for control of the system, imperative command based like bash
		- closer to natural language ("COPY", "STATISTICS")
	- Terminal interface design which facilitates intimate interaction between program and user, provides extensive interrupt capability and full ASCII character set 
		- terminal that printed characters on paper (Teletype) at the time
		- intimate interaction - charcter-at-a-time interaction not line-at-a-time
		- can issue a control-c interrupt
	- Virtual machine functions which provide all necessary options, with reasonable default values
	- The system should encourage and facilitate cooperation among users and protection against undesired interaction (isolation security)
		- PDP-10 serves multiple users, can have shared memory pages or shared files
- The system must be implementable, maintainable, and modifiable
	- Software must be modular with well-defined interfaces (extensible)
	- Software must be debuggable and reliable (robust and interpretable)
	- System should run efficiently, allow dynamic manual adjustment of service if desired, and extensive reconfiguration without reassembly (configurable)
	- System should contain instrumentation to clearly indicate performance (observability)

## Hardware Development for TENEX
Added an address mapping (paging) device 

### BBN Pager
interface between the PDP-10 processor and the memory bus
- provides individual mapping (relocation) of each page (512 words) of both user and monitor address spaces using separate maps for each
- uses "associative registers" to store mapping information
On each memory request, the 9 high-order bits of the address and the request type level are compared in parallel with the contexts of each associative register
Cases:
- If the match is found, returns 11 high-order address bits to reference
- If no match is found, reference is made to a 512 work "page table" in physical core memory - RAM
- The page is not in core, protected or nonexistent, then a page fault (trap) will occur
- Page is shared; the map contains a "shared" pointer which contains the location information for the page
- Page belongs to another process; entry contains an "indirect" pointer to an entry in another page table from which the location information is obtained
**Design summary**
- indirect and shared pointer mechanism allow pages to be actively shared (be represented in more than one address space) but still have the current address (core or secondary storage) stored in only one place
	- simplifies memory tables
- Read and write sharing on pages with per-page status bit
	- produces trap on write reference, and creates a private copy (COPY-ON-WRITE)
- maintains a record of activity of the pages in core memory in a "core status" table. Takes notes when a page has been referenced, which processes have used that page, and whether the page has been written into (dirty bit)

### Processor Modifications
New system call instruction JSYS (Jump to SYStem), added to the PDP-10 processor
- Transfers control from user space into the OS (monitor)
- Uses a transfer vector (like a sys call table) to figure out which OS routine to run
- Saves processor state (context) to return to your program
Added context bit to CPU state to determine user vs monitor mode
## The TENEX Virtual Machine
User process doesn't have access to direct I/O instruction of PDP-10, but through instructions which the call monitor routines (syscalls).
- Separation of kernel space and user space

### Virtual Memory Structure
Specified by a *virtual memory map* of 512 slots which the user may read or write via monitor calls
- private page - page shared with no other processes in system
- private pages are automatically created whenever a process makes a reference to a page with an empty spot on the map
- indirect pointers can be put on this map too and be shared
- also can contain pages from the file system

### Job structure
Job is a set of one or more hierarchically related processes and has the following attributes:
- name of user who initiated job
- account number to charge costs associated with use of system resources
- hierarchy of running and/or suspended processes

Jobs can have simultaneously running processes
- In TENEX, a process may only create child processes not parallel or superior in hierarchical structure

TENEX multiple processes examples:
1. To enable the EXEC to run user programs, handling faults, and servicing user requested interrupts.
2. To allow programs to block for an arbitrary set of events; one process waits for each event and signals the main process when it occurs.
3. To implement an invisible debugging program, completely protected from malfunction of the program under test.

### Pseudo Interrupt System
Various processes in a job may explicitly direct interrupts to each other for purposes of communication. Ex: key in terminal

### Other Monitor Functions
1. Functions which provide information to the program about the state of the system or job (time of day, runtime used, name of user, etc.).
2. Functions which save and restore the computational environment of a process to allow restarting of a suspended program.
3. Functions which provide frequently needed forms of I/O conversions, such as fixed or floating point number input and output, and date and time to string conversions.

### Backward Compatibility (DEC 10/50 Monitors)
- TENEX monitor calls were implemented with JSYS instruction to keep old monitor calls
- Catch 10/50 monitor calls and run with TENEX monitor calls
	- map a small compatibility package into process's address space
- Compatibility code kept in user space not kernel space
	- can use normal pseudo-interrupts
	- independent maintenance from monitor
	- monitor is protected from malfunction of compatibility routines

## User Interaction with TENEX
**Terminal Interaction Capabilities**
- while you're typing TENEX can respond, hence the author's suggestion of using a Full-duplex terminals where it can take input and out at the same time
**Executive Command Language**
- TENEX EXEC or EXEC for short
- Designed for two objections
	- Ease of learning
	- Ease of use
- All english words and each command begins with a keyword 
	- Eg `COPY` , `STATISTICS`
- Use "esc" to autocomplete command and provide help on next argument
- Uses "?" to output help
- Three styles of input:
	- Complete input
	- Abbreviations: abbreviated with any initial substring
	- Completion: types same chars as abbreviated input + esc
**Interrupt and Escape Chars**
- Control-C - terminates programs
- Control-T - interrupts a user's exec process to type out total CPU and console time used

## The Tenex File System
Functions:
- symbolic file name management
	- "file descriptor block" pointer associated with that name
- checking information concerned with:
		- file status: exists, access rights, etc
		- the process requesting access to the file
			- **File Access Protection** - should the other process be allowed to know about the existence of this file and at what level
### File Names
TENEX file is named by a file descriptor composed of five fields
- device name
- directory name
- file name
- extension
- version number

### File Access Protection
Generally access to a file depends on two things:
- Desired access level
- Relation of the program making the access to the owner of the file
TENEX has a simple protection scheme - only possible relationships a program may bear to the file's owner are:
1. The directory attached to the job under which the program is running is the same as the owning directory. (Owner)
2. The directory attached to the job under which the program is running is in the same group as the owning directory.  (Same group)
3. Neither 1 nor 2. (Other user on system)

TENEX has 5 kinds of access (the three relationships and 5 protections are indicated by 15 bits, 3x5):
- directory listing
- read
- write
- execute
- append

### File Operations
Steps to use a file in TENEX:
1. Correspondence is established between a file name and a Job File Number (JFN)
	- JFN - small index into a job table for files
2. The files is opened, establishing the mode and access permission and setting up monitor tables to permit the data of the file to be accessed
3. data is transferred to or from the file
4. file is closed, fixing up the directory info and releasing the space occupied in system tables for file

*Thawed* or *unthawed* access:
- thawed acesss - a file may have any number of thawed writers or thawed readers, but no provision is made to guarantee that information is in a consistent (frozen) state
- unthawed access - any access of unthawed readers and one unthawed writer to prevent conflicting operations
Simultaneous accessors of a file must be thawed or unthawed.

## The Monitor
Kernel
### Scheduler
Designed to meet a set of potentially conflicting requirements:
1. equitable distribution of CPU service, at least 1/N of real time where there are N jobs on the system
2. identify and give prompt service to jobs making interactive requests
3. efficient use of core memory to maximize CPU usage
4. provision for administratively controlling the allocation of resources so as to obtain other than equal distribution if desired (change allocations as needed)

**Balance Set Scheduling** - scheduling policy
- If you run too many processes at once, one will keep faulting pages in and out -> THRASHING
- gives a priority rating to each runnable process in the system based off an estimate of the working set size of each process
- jobs with the high priority whose total working sets will fit in the core may be run concurrently
	- to prevent thrashing but encourage concurrency

**Setting Process Priorities**
TENEX, priority is based on a long term average ration of CPU use to real time. A process's priority after an interaction is determined by its priority before the interaction and the length of the interaction
- Process priority is decreased while running but increased while it's blocked
- used to prevent compute-bound processes being block by interactive processes

**Resource Guarantees and Limitations**
Admin access allow assignment of a fraction F of guaranteed CPU service.
$C/T > F$, where C is CPU seconds used by the process and T is the real time since the process last unblocked

### Core Mangement
A process is considered to have enough of its working set (necessary pages to run that's loaded in core) if it's page fault time equals PAV, a system parameter set to 67ms or 2 drum revolutions
- Another example of TENEX configurability
To reduce the size of a process working set, a least recently used algorithm is used (LRU) to evict pages

### System Measurements
Scheduler maintains a set of integrals over time which give:
- IDLE, time when no process are request CPU service
- WAIT, time when all runnable processes are waiting for completion of page fault
- CORE, overhead time spent in core management
- TRAP, time spent handling pager traps

$S = IDLE + WAIT + CORE$ = total time in scheduler
$REALTIME - S - TRAP$ = time spent running user processes

### Debugging Aids
DDT - program which allows memory locations to be examined and modified, and breakpoints to be placed in runing program.