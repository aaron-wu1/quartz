---
date: 2025-10-20
tags:
---
source: https://cseweb.ucsd.edu/classes/fa25/cse221-a/papers/sprite-ieee-computer88.pdf

## What is Sprite
New OS for networked uniprocessor and multiprocessor workstations with large physical memories. 
- Implements a set of kernel calls much like 4.3 BSD UNIX
- Sprite kernel contains:
	- RPC facilities for communication between kernels
	- *prefix tables* to implement a single file name space and flexibility in administering the network file system
	- large variable-size file caches on both client and server machine

## Motivation / Goals
Technology trends that Sprite is adapting to:
- Increase distributed machines: Hide the distribution as much as possible but make the available the same ease of sharing and communication that is possible on time-shared machines
	- ***network transparency*** big goal
- Increased availability of larger physical memories, 
	- goal is to mange physical memory in a way that maximizes the potential for file caching
- Imminent arrival of multiprocessor workstations
	- sprite to facilitate the development of multiprocessor applications

**overall goal**
- Simple and efficient mechanisms that capitalize on the three technology trends

### Facilities Design (api)
- Most kernel calls in Sprint are similar to those provided by the 4.3 BSD version of UNIX OS
- Three additional facilities to encourage resource sharing:
	- Transparent network file system
	- Mechanism for sharing writable memory between processes on a single workstation 
	- Mechanism for migrating processes between workstations in order to take advantage of idle machines

### Kernel Implementation
Built from scratch
- remote procedure call (RPC) facility that allows the kernel of each workstation to invoke operations on other workstations
- Sprite FS is implemented as a collection of *domains* on different server machines, but it appears to users as a single hierarchy that is shared by all workstations
	- *prefix tables* to manage name space
- For high performance on FS, Sprite caches file data on both server and client
- Virtual memory system uses ordinary files for backing storage
- Sprite guarantees that processes behave the same whether migrated or not.
	- *home* machine for each process and forwarding location-dependent kernel calls to the process's home machine (server client model)

## Application Interface
Designed to facilitate sharing!
1. Sprite FS allows all of disk storage and all of the I/O devices in the network to be shared by all processes
2. VM allows physical memory to be shared between processes on the same workstation
3. Process migration, allows jobs to be offloaded to idle workstations and allows processing power to be shared

### Past networked FS
- Earliest system only allowed remote file access with a few special programs
- Second generation systems, allow any applications to access files on any machine in network, but special names must be used for remote files.
- Third generation systems, Sprite, provide *name transparency* - location of file is not indicated directly by its name, possible to move groups of files from one machine to another without changing their names
### Shared Address Spaces
Early versions of UNIX did not permit memory to be shared between user processes, except for read-only code

There are two reasons for providing shared memory:
1. Most natural way to program many applications is to use a collection of processes in a shared address space
2. Advent of multiprocessors.
	- If an application is to be decomposed into pieces that can be executed concurrently, there must be fast communication between the pieces

**How does Sprite share memory?**
- **Proc_Fork** kernel call to create a new process and can request the new process to share the parent's data segment:
- ![[Screenshot 2025-10-20 at 12.57.57 PM.png]]
### Process Migration
Many of the machines will be idle at any given time, to maximize utilization, Sprite provides a new kernel call `Proc_Migrate` which will move a process or group of processes to an idle machine.

**Expected usage**
- Shell commands for manual migration
- `pmake` new version of UNIX `make` utility
	- Recompilation of programs, designed to invoke multiple recompilation concurrently using process migration to offload the compilation to idle machines

**Attributes**
- One of the most important in Sprite's migration is *transparency* both to the process and the user
	- Process will produce exactly the same results when migrated as it would if it were not migrated
	- Migrated process can be stopped, killed or debugged just like the user's other processes

## Basic Kernel Structure
Kernel functions via collection of *kernel calls* similar to UNIX:
- user process execute "trap" instructions to switch to supervisor state
- kernel executes as a privileged extension of the user process, using a small per-process kernel stack for procedure invocation within the kernel

### Multi-threading
Prior OS kernels are *single-threaded*: a single lock is acquired when a process calls the kernel and released when the process puts itself to sleep or returns to user state

**Sprite kernel is *multi-threaded***:
- Several processes may execute in the kernel at the same time
- Kernel is organized in a monitor-like style, 
	- With many small locks protecting individual modules or data structures instead of a single overall lock

### RPCs
Facilitates communication between kernels from different workstations.
- RPC was chosen over message style because RPC provides a simple programming model (remote ops appear like local procedure calls) 
- RPC approach is efficient for request-response transactions which we expected to be the most common form of interactions

![[Screenshot 2025-10-20 at 1.12.29 PM.png]]
Assumes that Sprite kernels are trustworthy, no encryption nor kernel validate RPC operations

## Managing the File Name Space - Prefix Tables
Key implementation issues in networked FS:
1. How to manage file name space in a way that simplifies system administration
2. How to manage the file data in a way that provides high performance

Perspectives:
- To users, Sprite FS is a single hierarchy like time-shared UNIX
- To sysadmins, the file system is a collection of *domains*, which are similar to "file systems" in UNIX![[Screenshot 2025-10-20 at 1.21.32 PM.png]]
To fix stale domain structures (file based), Sprite introduces *prefix tables*. Each client machine maintains a private prefix table and each prefix table corresponds to a domain.
- For remote links, the client uses a *broadcast protocol* to make a new prefix table entry and then reprocesses the remainder of the name

## Managing File Data - Client and Server Caches
The Sprite FS is implemented using large caches of recently-used file blocks stored in the main memories of both client and servers.

Caches provide two benefits:
1. Caches improve file system performance by eliminating disk accesses and network transactions
2. Reduce the loading on network and the servers

### Basic Cache Design
Each client and server workstation maintains a large cache of recently-accessed file blocks
- organized on a block basis
- stored in main memory rather than local disk

**Cache Consistency**
Each `Fs_Read` kernel call always returns the most up-to-date data for a file

***implementation***, consider 2 separate cases:
- *sequential write-sharing* - where one workstation modifies a file and another workstation reads it later, but file is never open on both workstations at the same time
	- Handled by version numbers associated with cached blocks for file. 
		- When client opens file, server returns a current version number
		- If different, the file must have been modified recently on some other workstation, so the client discards all of the cached blocks for the file and reloads its cache from the server when the blocks are needed.
	- Due to *delayed-write* (writes to cache first), the server doesn't always have the current data for a file. Servers handle this situation by keeping track of the last writer for each file
		- When a client who is not the last writer requests to open file, the server forces the last writer to write all its dirty blocks back to server's cache
- *concurrent write-sharing* - one workstation modifies a file while it is open on another workstation
	- Sprite disables client cache for that file
	- When the server recieves an open request that will result in concurrent write-sharing, 
		- it flushes dirty blocks back from the current writer and notifies all of the clients with the file open that they should not cache the file anymore

## Virtual Memory
Traditional VM but has three aspects for networking
1. Sprite uses ordinary files for backing storage in order to:
	- simplify process migration
	- share backing storage between workstations
	- capitalize on server caches
2. "sticky segments" and a dynamic tradeoff of physical memory between the VM sys and file cache
### Backing storage
Portion of disk used to hold pages that have been swapped out of physical memory
![[Screenshot 2025-10-20 at 2.29.04 PM.png]]
- Advantages to paging from files
	- reuse of existing file mechanisms
	- flexibility when each machine uses a private partition for backing storage
	- network file system makes it easy for backing files ot be allocated either on local disks or remote servers

### Sticky Segments
Sticky Segments: Sprite keeps the code pages of a program in memory even after the program exits. Pages remain in memory until they are replaced using normal clock mechanism
- used for reducing cost of programs that are invoked frequently
### Double-Caching
Caching the same block of a file in two different places in memory because VM system is a user of the file system.
- VM memory system bypasses local file cache when reading and writing backing files

### VM-FS negotiation
VM sys and the File Sys have conflicting needs for physical memory. 
- FS is best when the file cache is as large as possible
- VM is best when the file cache is small as possible so most of the physical memory may be used for virtual memory

Sprite allows the file cache on each workstation to grow and string in response to changing demands on machine's virtual memory and file system

## Process Migration
Simplest way to approach process migration is:
1. "Freeze" the process
2. Transfer its state to new machine, including registers and other execution state, virtual memory, and file access
3. "Unfreeze" the process on its new machine, so that it may continue executing

**Dominate cost is virtual memory transfer**
- to reduce it:
	- V system (another OS) uses *pre-copying* - process continues executing while memory is transfered
	- Accent (another OS) uses a "lazy" approach - VM image is left on old machine and transferred to new machine one page at a time when page faults occur
	- LOCUS (another OS) checks for a read-only code segment and re-opens it on the new machine, rather than copying it from the old machine
	- In Sprite, the old machines simply pages out the process's dirty pages and transfer information about the backing files to the target machine.
		- if the code segment already exists on the new machine, the migrating process shares it, as in LOCUS

**how to achieve transparent remote execution**
- In sprite, process communicate with the rest of the world by invoking kernel calls. Kernel calls are normally executed on the machine where invoked. 
- Sprite assigns each process a *home node* - the machine on which the process was created, unless if it's a migrated process where it's the parent's machine
- The kernel calls is forwarded to the process's home node (using RPC) and is executed there to guarantee the same results

## Summary
Sprite will provide three overall features:
- sharing
	- at several levels
		- tightly-coupled processes may share memory
		- processes everywhere may share files
		- users may share processing power
- flexibility
	- for sys admins to evolve
- performance
	- usage of special purpose RPC protocol for communication between kernels and physical memory as a flexible cache for both programs and files

