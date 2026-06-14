---
date: 2025-06-08
tags:
- operating-systems
- virtualization
- security
- concurrency
- performance
title: OS Crash Course
---

All the most important content IMO
## What is an OS?
A layer of programs above HW to make it easier to develop applications
- *usually* provides abstractions for applications
- *often* provides protection between applications

## Design Requirements
When designing an OS some of it's key features are:
- Building abstractions to interact with physical resources
- Prioritizing high performance and minimizing overhead
- Protection between processes
- Reliability
- Security

## Key Components
- **Kernel**: core of OS with modules to abstract hardware
	- eg: process management, file system, memory management, networking, I/O
- **[[#Process]]**: running program; program under execution
- **Program**: static file, list of instructions

## What pieces are required in an OS to meet the requirements?
- [[#Virtualization]]
- [[#Policies]]
- [[#Persistence]]
## Core Details
- [[#CPU Virtualization]]
- [[#Virtual Memory]]
- [[#File Systems]]
- [[#IPC]]
## Details

### CPU Virtualization
Provides the illusion of multiprocessing.

**Requirements on process execution**:
- [[#Limited Direct Execution (Speed)]]
- [[#Context Switch and Timer Interrupts (Fairness)]]
- [[#Memory Isolation (isolation)]]

**How CPU decides which process to run?**
- [[#Scheduling]]

### Virtualization
Virtualization in an OS takes a physical resource and transforms it into a general, easy to use, virtual form to use. An example are system calls are a way for apps through the OS to interact with hardware. Other examples are supporting multithreading which is virtualizing CPU and [[#virtual memory|virtual memory]] that provides protection to memory across processes.

### Policies
The OS needs a set of rules to define how interactions under virtualization. For example, in virtualizing the CPU, a policy is needed to determine which process to run on the CPU. This would be the scheduling policy.

### Persistence
DRAM or volatile memory can be lost when power goes out or when the computer is shutoff. To be able to maintain data integrity and support user data to be accessible across shutoffs, the memory must be written to disk. In other words, persistent memory is written to disk and that requires the support of filesystems which are in charge of managing persistent data I/O.

### Limited Direct Execution (Speed)
**Direct Execution**: Allowing programs to run on CPU without any virtualization is fast. The issue is that malicious programs can hog the resource by staying on the CPU. 

**Limited Direct Execution**: Protects against these malicious programs by limiting access to the CPU through system calls.

Requires [[#Scheduling]] to decide which process to run on CPU.

### Context Switch and Timer Interrupts (Fairness)
**[[#Context Switch]]**: take the running process off the CPU for another process
**Timer Interrupts**: sets a quantum for process to run and relinquish CPU to OS so that the OS is able to maintain control

### Memory Isolation (isolation)
Protects process' memory by not allowing other processes to access their memory; Segfaults. Processes are tricked to think their allocated address space is the full addressable memory; virtual memory.

Each process has a base/bounds of memory addresses that's it's able to access. If the address is out of that, OS signals a page fault.
### Process
A process is a running program.

**Has 3 key states:**
- Running
- Blocked
- Ready
*Scheduler determines which process are in the running state and which are ready.

**Process Lifecycle**
1. Create process, get PID
2. Assign part of DRAM to process, address space
3. Load code and static data to space
4. Setup inputs needed to run program's main fn
5. Update process state to ready
6. When process is scheduled (running), OS hands off control to process
7. Process finishes and runs teardown (destroy)

**Process API**
- CREATE - fork() - creates identical copy of process as a child, typically starts at line where fork was called; in c pid > 0 is parent, pid == 0 is child
- WAIT  - wait() - waits for process to complete
- EXECUTE - execvp() - start program with code, overwrites current process
- STOP - kill() - sends a signal to kill the process
*Processes don't share memory but on fork copies over address space, isolation*

### Context Switch
Context switch is when the OS switches which a process from a running state with another process, under the time sharing design pattern. Previous process's machine state must be stored to be referred later when it's started again and the new process's machine state should be loaded in.

**Key Terms**
- **Schedule**: record of what process runs on each CPU and when
- **Policy**: controls how OS timeshares CPU
- **Arrival Time**: time when process is created
- **Job Length**: duration of time needed for process
- **Start Time**: time when process first starts on processor
- **Completion Time**: time when process is killed
- **Response Time**: \[start time\] - \[arrival time\]
- **Turnaround Time**: \[completion time\] - \[arrival time\]
- **workload**: set of processes, arrival time and job lengths that the OS scheduler uses to make decisions
- **Preemption**: stopping before job is completed; used in the context of scheduler algorithms and if their decision forces a job to pause in the middle of a job.

### Scheduling
**Scheduling Algos**
- **First Come First Serve (FCFS) also FIFO**
	- leads to **Convoy Effect**, when a long job blocks shorts jobs behind it; head of line blocking
- **Shortest Job First (SJF)**
	- cons - doesn't support unknown job lengths, long jobs may never run
- **Round Robin**
	- fixed quantum for each job; cycle through jobs
	- preemption
- **Shortest Completion Time First (SCTF)**
	- allows some progress on long jobs
	- preemption
	- cons: 
		- jobs might not arrive at the same time; ordering is not guarrenteed
		- more context switch


### Virtual Memory
The idea of memory virtualization is that:
- each process needs its own memory and process' memory should be protected
- virtualization gives the process the impression that it owns all the memory of the system.

Address Space: decided by bits, 32 vs 64 bit

**Design issues**:
- **Internal Fragmentation**: allocated memory is not all used
	- caused by overallocation
- **External Fragmentation**: variable sized memory allocates/deallocations creates unallocatable gaps over extended use
	- cause by variable sized allocations
*Solution: allocate small, fixed-sized chunks (pages); lots of work done to best optimize page size for OS*

More on paging [[#Paging and Address Translation]]

### Paging and  Address Translation
**Key terms**
- **Page**: a fixed sized chunk of memory; contains page number + offset
	- can be:
		- virtual pages - pages not on memory; can be on disk
		- physical pages - actual pages on memory
- **Page Table**: map of virtual pages to physical memory pages
- **Swap Space**: OS managed space, on disk, for pages that can't fit into memory
- **Page Eviction**: when a new page needs to be swapped into memory, a page from memory needs to be evicted/removed.
- **Dirty Page**: written to page that needs to be saved to disk
- **Page faults**: page not found in memory, can be used as a metric for eviction policy performance (if too many page faults bad)
	- **Thrashing**: when the OS spends more time swapping pages than executing virtual tasks, increases CPU utilization due to swapping overhead
	- **Working set model**: to figure out pages is going to come from running processes to avoid thrashing

**What happens when a page is not in memory?**
Page faults -> check swap space -> evict page -> swap in

### IPC
Communication between processes on the same machine, interprocess communication

Two ways:
- **Message Passing**
	- Use a message queue to determine order of data
	- One way is using pipes/queues to send data, processes subscribes to pipe and push to the pipe.
- **Shared Memory**
	- Use mutexes to lock critical section/shared memory

### File Systems
- software that organizes and manages data on storage
- maps logical files to physical locations on disk
- provides interface for file operations \[CREATE, READ, WRITE, DELETE\]

**Has two levels, logical and physical**:
- Logical Level: 
	- exposes file and directory abstractions
	- sys call APIs for file handling
- Physical Level:
	- works with disk firmware and moves bytes to/from disk to DRAM

**Key Terms**
- **File**: persistent seq of bytes
- **File-format**: app-specific standard
- **Metadata**: info about file content
- **Directory**: cataloging structure, folder for files
- **File Descriptor**: OS assigned int for file virtual obj
	- 0/1/2 reserved for STDIN/STDOUT/STDERR
	- index into kernel maintained table of open files/processes that maps to inode
- **Inode**: metadata structure (persistent); inode number is fixed by OS
	- owner id
	- file type
	- protection info
	- map to physical disk blocks
	- creation time
	- reference counter

**Goals for FS**:
- Efficiency - fast read/write
- Reliability - recover from crashes/errors
- Scalability - handle small to massive files
- Security - access control, permissions

**Structures for FS**
- Tree Structure:
	- simple, sharing is asymmetric
- DAG structure:
	- any parent can remove file, only last parent can delete
	- symbolic links
	
**Direct block and doubly indirect block**
*TODO: insert image here xD*


### Hypervisor, virtualization
*nice to have*