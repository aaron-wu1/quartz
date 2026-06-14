---
date: 2025-10-15
tags:
---
## Question
- "VAX/VMS, then, is a collection of procedures that exist in the address space of each process." Explain in your own words what this statement means.
	- In VAX/VMS, procedures are isolated per process
## Introduction
- Outlines memory management policies and decisions made in the design and implementation of the first release of VAX/VMS OS

## VAX-11 HW
- Process = basic entity
	- 32-bit virtual addr space
	- 512-byte pages
	- 32-bit virtual address, 21-bit virtual page number, 9-bit byte offset within the page
- VM
	- upper two bits of vaddr divide the process address space into functional regions or spaces
	- High-address half of the address space (Bit 31 = 1) is system space and it's shared by all processes in the system
	- Low-address half of address space (bit 31 = 0) is process space and unique to each process![[Screenshot 2025-10-15 at 5.31.18 PM.png]]
- Paging
	- Each region in memory is defined by a page table
		- fields:
			- valid bit, Page Table Entry or PTE<31>
				- checks whether it's loaded into main memory
			- protection field, PTE<30:27> 
				- indicates privilege required to read or write
			- modify bit, PTE<26
			- field used by os, PTE<25:21>
			- physical page frame number, PTE<20:0>
	- System space has a separate page table called the system page table
	- Translation of a process-space virtual address involves two accesses:
		- one to the system page table, to calculate the *physical address of the process page table*
		- one to the process page table, to calculate the *physical address of the specified element*

## Use of address space by VAX/VMS
System region:
- executive code and data
- process-specific data structures
- process page tables
- Vector region
	- contains pointers to executive service routines in system space
With the vector region, it shares the OS with all other processes in the system.

...

## Memory-management implementation
Issues in paging systems:
 - effect of one or more heavily paging programs on other programs in the system
 - high cost of program startup and restart time in virtual memory environments
 - increased disk workload
 - processor time consumed by searching page lists in OS

To fix above issues, VAX/VMS memory management system **is divided into two basic components: the pager and the swapper**
- *the pager* - OS procedure that executes when a page fault occurs
	- responsible for loading and removing process pages into and out of memory
		- in paper used LRU eviction
- *the swapper* - separate process responsible for loading and removing entire processes into and out of memory

**Process-local page replacement policy**
- when a page must be removed from memory, the page to be removed is selected from the process requesting a new page.
	- limit is placed on the amount of physical memory a process may occupy

**Resident list set** - set of pages currently in memory for a process 
**resident-set limit** - maximum size of the resident set

When a page is removed from a process's resident set, it is placed on one of two page lists:
- **free page list** - if modified bit = 0
- **modified page list** - if modified bit =1, must be written to the paging file (modified page list)
If a process faults a page that is on either of the above list, page is returned to process's resident set

### Clustering
*Clustering of pages* - VAX/VMS page sizes is small so to reduce I/O ops, it reads and writes several pages at a time known as *clustering*

1. When the pager locates a page to be read from exec file, it determines the cluster size
	- default cluster size specified by user

### Modified page list 
thinking it's like swap space in unix...
Purpose:
1. acts as a cache for recently removed resident-set pages that have been written to
2. allows for clustering writes to page file 
	- like a daemon to handle writes of pages to disk

Has a *low limit* and *high limit* of list size
- 20 or 30 for low
- 100 + for high

VAX/VMS delays modified-page write requests with this queue. Due to that it provides 4 optimizations:
1. Modified page list acts as a cache of recently removed pages
2. When a write request must be performed, many pages can be written at once
3. Pages can be arranged on the paging file so that clustering on read requests is possible
4. Because writes are delayed many page writes are entirely avoided because either the pages are faulted again or the program terminates

*Demand-zero page* - is a page that is created for a program and initialized to zero on demand
- pages that were initially zero like uninitialized arrays, are not stored by the linker in the execution file. Linker creates a null-sized segment of demand-zero pages
- when the page faults (on demand zero page), the pager allocates a physical memory page and fills it with zeros and then add the page to resident set of the process

*copy-on-reference* - pager sets the modify bit of the PTE for a  writable page when it's first loaded from the executable file

*paging in system space*
- has system resident set
- for it's process page tables, a page table is not removed unless it's empty

### The Swapper
swaps between memory and the backing store. also responsible for writing the modified page list
Objectives:
1. keep the highest priority processes resident 
2. avoid the typically high paging rates generated by resuming a process in most paged systems

When a process is removed from memory, its entire resident set is written to the swap file, along with some process-specific OS database

*what does it do*
- lets say a process not in memory becomes able to execute
	- the swapper allocates pages for the resident set, page tables and OS data structures
	- then the swapper updates the process's page table entries to reflect new virtual-to-physical mappings
- Process creation
	- when a new process is created, the swapper swaps in a process shell, which provides the initial environment in which a program can be executed
### Program control of memory
VAX/VMS provides routines for processes to:
- expand or contract it's P0 or P1 region
	- P0 heap, P1 stack
- increase or decrease resident set size
- lock or unlock pages in resident set (to keep pages in set)
- lock or unlock the process in memory (process can't be swapped)
- create and or map global or private section into the process addr space
- produce a record of the page-fault activity of the process
