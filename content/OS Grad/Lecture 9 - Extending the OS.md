---
date: 2025-10-23
tags:
- operating-systems
- computer-architecture
- performance
- security
- concurrency
- virtualization
title: Lecture 9 - Extending the OS
---

## Goal: move OS functionality to user level

![[u-kernels]]
**Benefits of uKernels**:
- Easy to update
- Easy to debug
- Run many OSes

**Drawbacks**:
- messaging overhead

## L4
### Goals
- Design a uKernel with good performance - *5-10% slower*
	- can we do better than Mach?
- Run a standard OS on a uKernel
- Do we need colocation? - *no, perf. is good enough*
	- efficiency
- Specialization, extensibility - *specialization: pipes, extensibility: cache partitioning, user-level pagers*
	- by specialization: customize existing service
	- by extensibility: add new features

### Key Abstraction
- *Threads* 
- *Address space* 
- *IPCs* 

![[L4 Architecture]]

### Memory Management
- Hierarchical address spaces
- Linux delegates memory to apps
- L4 grants memory to Linux
- user-level pagers

### Page Faults
- trap to ukernel
- ukernel sends a msg to Linux
### Page Tables
- 2 sets of page tables:
	- one in user level
	- one in kernel level (B/c kernel can't trust user programs to run well)
- drawbacks of shadow page tables 
	- overheads for updates
	- extra memory for duplicate copies
- Question: (is there shadow pages that only shadow the shadow pages kernel to reduce size of user level page table and only change if page is dirty)

### L4 Linux Implementation
- Modify libraries (e.g. syscalls)
- Modify arch-dependent portions of Linux

### L4 Summary
- design of modern microkernel
- perf. approaches monolithic kernels
- opportunities for specialization, extensions

## Exokernel

### Goals:
- Security 
- Efficiency 
- expose hardware to user level
- push all OS -> user-level

![[exokernel]]
Example: 
- PTE - check before installing in TLB (this is the secure binding)
- ask for physical page
- tables - physical pages per process
### Benefits
- lower overhead
- easy to specialize + extend
	- can remove FS if wanted, modular, for APP

### User-level management of hardware resources
- how to provide protection?

### 3 Main Functions
- protection via *secure bindings* -> decouple authorization from use
- resource revocation & *abort protocol*
- track resource ownership

### Memory Management

### Adoption
- inspired approaches to virtual machines
- high performance settings

### Exokernel Summary
- untrusted library operating systems - manage HW resources directly
- protection using secure bindings