---
date: 2025-12-04
tags:
- distributed-systems
- operating-systems
- concurrency
- virtualization
- storage
- performance
title: Lecture 19 - File Systems Pt3
---

e## GFS
- 2003
- **Setting**
	- inexpensive hardware -> frequent failures
	- very large files - 100MB -100 GB
		- web crawled data
		- small ish number of files, since they were so large
	- writes: sequential, append heavy
	- co designed with application
		- relaxed GFS consistency model to simplify the FS without too much changes on application
		- clients are within google
	- high throughput rather than low latency
	- concurrent writes to the same file
		- MapReduce

### GFS
- Built on top of some other file system
- No POSIX interface, their own interface
**Files**
- organized into large chunks - 64 MB
- store as regular Linux files
- internal fragmentation scare, but files so large not an issue

**Namespace**
- hierarchical - a/b/c/foo.txt
- directories 
	- kind of an illusion
		- hierarchical only for naming purposes
		- done to avoid locking
### Architecture
![[GFS Architecture]]
- Master - stores metadata
	- does not store file data
	- control plane operations
- Chunkservers - store all the file data
	- Replicate each chunk across multiple chunk servers
- Client - user or application trying to access the file
- Ensures consistency with version numbers
- Lots of opportunities for failures on writes, but GFS tries to detect the issue and recover from it

### Appends
challenge: concurrent appends
- POSIX: writes()
	- writes at specific offset
- clients overwrite each other
- synchronization is costly
New interface: record append
- primary chunkserver orders appends
- high rate of concurrent apples, one chunk server responsible for serializing appends

### At-least-once semantics
- chunk is written at least once
- if failure, chunk might be written multiple times

### Exposing inconsistent data to clients
- duplicates - record ID
- padding - checksums
- fragments, write partially complete - checksums



Replaced by colossus

### Summary
- distributed file system
- exposes inconsistencies to application
- challenges
	- scale
	- consistency 
	- failures

## Final Exam
- Logistics - Piazza, Monday 3pm-6pm in same room
- 1 piece 8x11 paper
- content:
	- Focus on the papers
	- everything except GFS
	- Some open ended questions

## Review
Review over common themes over papers

### Separation of Policy and Mechanism
- Policy
	- decisions
- Mechanism
	- tool for control, enforcement
Goal: decouple these two
- More flexibility
- Reuse mechanisms over different policies

**Hydra**
- mechanism: capabilities
- policy: setting of the rights bits
	- eg RWX, different policies
**Microkernels (Nucleus, L4)**
- mechanism: 
	- L4: IPC, threads, address spaces
	- nucleus: IPC, process control, scheduling
- policy: implemented by services
	- User space:
		- How to allocate of memory
**LFS**
- policies: How to clean segments
**Snap**
- mechanisms: pinning, interrupts
- policies: which scheduling mode to use
### Layering
- Break system into layers 

| Pros                                                     | Cons                           |
| -------------------------------------------------------- | ------------------------------ |
| isolation                                                | overhead                       |
| modularity, abstraction                                  | designing layers can be tricky |
| debugging testing easier focusing on one layer at a time | hard to enforce layers         |
|                                                          |                                |
**THE**
- Layered design: processes, memory, console, I/O, app

**UNIX**
- Layered design: kernel space and user space
	- privilege boundaries between those two

**File Systems**
- Layered design:
	- apps
		- apps <-> kernel: files and directories
	- kernel
		- kernel <-> storage device: blocks
	- storage device

**Microkernels vs Exokernels**
![[Micro Kernel vs Exokernels rev]]

### Virtualization
- Virtualization: create a version of X that behaves like a real X

#### Virtual Memory
**TENEX, VAX/VMS, MACH**
- virtualizing: physical memory
- abstraction: virtual addresses
![[Virtual memory virtualization]]

#### Virtual Machines
**XEN, VM370**
- virtualizing: hardware itself
- interface: instruction set architecture, physical memory, I/O devices
- Trap and emulate - mechanism
- structure: hosted vs bare metal model
	- hosted run on app: virtual box
	- bare metal run directly on hypervisor
- challenging to virtualize x86
#### Binary translation - VMWare
- Rewrites privileged instructions
#### Paravirtualization - xen
- modify OS to call hypervisor (hypercalls)

#### Hardware support
- new privilege layer, memory, and I/O