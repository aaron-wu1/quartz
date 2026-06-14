---
date: 2025-10-09
tags:
- operating-systems
- security
- storage
- performance
- caching
- computer-architecture
- programing-language
title: Lecture 5 - Protection pt2
---

## Multics
### Goals
- uniform protection model

### Principles
- Check every access
- permission rather than exclusion
	- whitelist rather than blacklist
- principle of least privilege
- the design is not secret
	- security of your system should not rest upon ignorance of the system
- usability

### Protection in Multics
- how can protection be efficient
- start with login process
	- establish user id/principle identifier
	- did people not have login/passwords

### File System
- Paper mentions this as storage system
- All protection is derived from file system
- access control lists (ACLs) -> static
	- lots of variability in combined states of capabilities
	- downside: expensive to check
	- Aim try to derive capabilities from ACLs (dynamic (on execution of programs))

### File Example
- Possible API: 
	- `read("file.txt", buffer, length,...)`
	- need to check permissions before read... ACLs lookup everytime
- Today's API check with capabilities
	- `read(fd, buffer, length,...)`
	- fd = capabilitites
	- `fd = open("file.txt",...)`
- fd -> open file descriptor table -> kernel
	- ![[Capabilities]]

### Segmented Memory Model
Divide virtual memory into a bunch of segments
![[FS Segmented Memory Model]]

## Descriptors
![[Descriptors]]
- can use TLB to make it even more efficient
	- if rights changed need to flush TLB or invalidate cache
- derived from the file system
- capabilities can change -> copy on write

### Protected Subsystems

![[Multics Protected Subsystems]]
- In systems now: there 4 rings, but really only 2 are used
	- in the past had 8 for more configurability
- More complicated in VMs, but more research to think about as an aside

### Hydra vs Today
- Hydra
	- also provides protected subsystems
	- Hydra rejects hierarchy
- Today
	- similar to Multics rings, but fewer
	- syscalls are similar to gates

### Multics Summary
- Protection in FS, based on access control lists
- protects memory accesses using descriptors (capabilities)

## Singularity (2007)
Authors: OS background + PL background

### Motivation
- avoid physical checks & overheads
- dependability, runtime errors
- leverage PL & verification
- security vulnerabilities
- failures

### Singularity's Approach
- leverage language features
	- eg. in Java for checking buffer overflow
		- JVM has bounds checking during interpretation
- verification
Singularity is asking: How can we apply above to an OS???

### Design
- SIPs - software-isolated processes
- CBCs - contract-based channels
- MBPs - manifest-based programs
How?
- one address space 
- enforced using software rather than hardware 
	- can run everything in ring zero, protect with software
- data in a SIP is private
![[Singularity Design]]
- type system to enforce exchange heap
	- once an object is in exchange heap, the original SIP's pointer to the object is invalidated
- Software verification & runtime checks
- example: 
	- smart pointers in C++
	- Ownership in Rust

### Drawbacks with software based enforcement
- shared address space
- have to use a specific language

### Summary
- software-based isolation
	- using programming languages + verification