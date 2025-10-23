---
date: 2025-10-16
tags:
---
## VAX + Unix - popular at universities
- VAX ideas spread to Windows because one of the authors ended up working there 
### VAX/VMS
Goals:
- support different HW, various memory configs
- support constrained HW, efficient
	- limited memory
	- slow I/O
	- support 32-bit address spaces, 4GB potential memory
	- memory on machines at the time: 250KB-8MB physical memory

### Address Spaces
Large 32 bit addr spaces from 0 -> 2^32
![[VAX ADDR]]
OS is mapped to every process because it has reserved space
example: stack pointer's virtual address starts with 01
- 0 for user space
- 1 for P1 because it's stack space

### Paging
- Fixed sized pages, 512 bytes each
	- *In contrast* Multics had variable size pages 
- mapping of virtual pages to physical pages

### Page Tables
- Linear array of page table entries
	- *In Modern OS*: it would be multi level page tables
- hardware support:
	- **base register** -> virtual address (P0, 01) physical address (system)
	- **length register** 
- **segmentation faults** access of region of memory outside permitted range
- **context switch** - update registers
- Spectre and other side channel attack : where user and system share address space
	- now we separate page tables for user and system to protect from these attacks

### Space Efficiency
- how to minimize space for PTEs?
- swap process page tables to storage
- what about page tables for OS?
	- keep all pages in physical memory and not make them swappable
	- *in modern*: keep a root page that is able to handle OS page swapping when needed
- TLB
	- cache entries 
	- *VAX*: split it into user and kernel entries 
		- so user programs can't force kernel entries out
	- *in modern* : not the case anymore

### Efficient Paging
Local page replacement
- remove pages from the same process that is trying to swap
- each process has a threshold of pages in memory
- *in modern*: more flexible approaches, chooses pages based on process usage or other algos
- FIFO policy - simple and they didn't want to spend that much CPU time to decide which page to evict
	- *in modern*: use LRU typically

### Page caching
cache for pages about to be evicted:
- **free list**
	- pages that *don't need* to be written back
	- if fault then you grab a page from free page to use it 
		- zero if for stack
		- don't have to if you read from disk, b/c it just overwrites but now leaking data which is bad
- **modified page list**
	- pages that *do need* to be written back
- fault on either list brings the page back into resident set
- second chance - another opportunity to be moved back onto page table
- study found that it reduce page faults by half by using these lists

### Clustering
- slow I/O, small pages -> read/write are slow!
- reads - batch at a time
- write - collect many to write at once
	- try to find contiguous pages to write all at once in modified page list

### Summary of VAX/VMS
- process address space - inherited by UNIX and still used today
- techniques for efficient paging


## Mach Virtual Memory
Mach is Micro-kernel 
micro-kernel -> small nucleus and build everything around it
MacOS inherited a bunch of virtual memory stuff

### Mach VM -> MacOS VM
Tevania (author) -> Apple, later CTO
Rashid -> founded Microsoft Research

### IBM RT PC
created by IBM
*R* -> RISC - reduced instruction set
*PC* -> personal computer

Systems derived from it:
- POWER RS/6000
- POWERPC
- eventually:
	- XBOX
	- Gamecube

### Goal
- virtual memory that is machine independent
	- hardware differences:
		- single processor vs multi processor
		- non-uniform memory
		- segmentation (Multics) vs. paging (VAX/VMS)
		- TLB
- good performance
- support sparse address spaces
	- reasons for sparsity:
		- memory-mapped files
		- multiple threads
		- shared libraries
		- address space layout randomization (*today*)

### Address map
- doubly linked list
![[mach address map]]

### Resident Page Table
![[mach resident page table]]

### Memory Objects
- backing store for a range of virtual addresses
- where data is when it's not in physical memory
- customized pagers
	- `userfaultfd` in Linux today

### pmap
- hardware dependent data structure
- hardware differences:
	- structure of the TLB
	- how TLB misses are handled
	- paging vs segmentation
- soft state
	- if you discard some of it it's still maintained in some other data structures????

### Summary Mach
- separate VM representation from  machine dependent and machine independent

