---
date: 2025-09-25
tags: 
---
## Why Grad OS?
- Broaden horizons of designing OS
- learn not just what but **why**

## What will I get out of this course?
- principles for OS design
- experience with reading research papers
- comfort discussing research material
- experience measuring systems performance

## Reading Questions
- What are the goals of author?
- What is the overall approach?
- How does it compare to prior works?
- how does the paper back up their claims with evidence? 
	- Do you buy it? 
	- Do they do a good job demonstrating their approach?
- Do they achieve their goals?
- Note: **Papers are not necessarily truth**

## What is an Operating System?
- interface between hardware and application
- managing hardware resources
- isolation, security, protections
- abstraction of hardware resources
- illusions to applications
- handles interrupts and exceptions
- define policies and enforce them for applicaitons

## Windowing Environment
Is it part of the OS?
- It depends on OS, if it's running on the user level or not
	- linux - user level
	- windows - part of OS
	- need to interact with device drivers which requires kernel level

## Web Browser
Is it part of the OS?
- No, user level program that runs on top of OS
	- precedent - 90s anti trust case with microsoft and netscape
	- not always the case (before 90s)

## Network Stack
Is it part of the OS?
- Yes, use system calls to interact with device drivers?
- not always
	- might implement stack at user level for better performance
	- depends on the layer
- layers:
	- HTTP - user level
	- TCP - OS
	- Ethernet - OS
	- Hardware (NIC) - OS

## Memory Allocation
Is it part of the OS?
- Yes - managing physical memory
- Yes - users use virtual memory
- No - some control of memory from user level (stack vs heap/virtual)
- Yes - OS provides interfaces to request mem, but OS is in charge
- Both - some memory allocation in OS (paging, handling faults) and some in User level (GC, Malloc, Free)
- Yes - memory is a physical resource, at some level OS has to manage memory

Similar to Network Stack example, split between OS and userspace
- Ex: 
```
	| App | ---malloc---> | libc |       user level
                        mmap sbrk        OS
```

## How different are different OSes?
similar - all managing hardware resources
depends - some are more configurable
different - if looking at different settings, business requirements
different support for low-level hardware
