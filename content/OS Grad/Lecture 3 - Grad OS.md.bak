---
date: 2025-10-02
tags: 
---
## TENEX Paper
### Introduction
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
### Goals
- virtual machine 
	- virtual memory, multiple processes, file system
- modularity, maintainability, ease of implementation
- good human engineering
	- executive
- sharing and isolation
- backwards compatibility
- efficiency
### Introduces Virtual Memory
- address spaces -  separate address spaces for processes and operating system
- virtual memory maps - page tables
- BBN pager - TLB, caching address

### Virtual Address Translation
- virtual address -> Page Table -> physical address
- virtual address -> TLB
	- in TLB -> physical addr
	- not in TLB -> page table -> physical addr

### BBN Pager
9 bits (virtual page) -> 11 bits (physical page)
- Weird constraint
	- less memory on virtual page than physical page compared to modern OS

### Sharing
- pages of memory
- using page table entries
	- direct
	- indirect
		- TENEX needs hops to reference the same page
		- in constrast today we can just point to page
	- shared
		- page cache or buffer cache

### Copy On Write
- Different copies of the same original data
- Copies page to new page and direct new process to point to new page
	- only when edited
### Backwards Compatibility
goal: binary compatibility
- added compatibility package/library
- JSys - new system call instruction
- The package that is running on user level is going to support all old system calls
	- under the hood call new system calls

### Exec (executive) = shell
- command completion with ESC
- abbreviations
### File System
- hierarchical 
	- `C:\dir\file.ext.version` 
	- `device\directory\name.extension.version#`
- TENEX has versioning within the name

### Scheduler
- priorities, round-robin
- 
### TENEX Summary
- virtual memory - sharing, copy-on-write
- time-sharing system
- support for backwards compatibility

## UNIX Paper
### Introduction
Other systems that influenced UNIX:
- TENEX
- Berkeley's time-sharing system
- Multics - authors worked on multics and it failed which taught them what they should improve on
### Goals
- easy-to-use -> interactive
- elegance ->  unifying abstractions -> everything is a file
- inexpensive -> afforability
- easy to maintain
	- first to be in C others at the time were in assembly
- unifying abstractions

### File System
#### File Data model
- Before Unix:
	- structure imposed on files
	- predeclare file sizes
- Unix:
	-  uninterpreted collection of bytes
		- no structure on files, whatever date on file
		- from the file system perspective it doesn't care what you put into files
	- variable-length files
		- don't have to predeclare the files size
#### File System API
- Before Unix:
	- no buffer cache in kernel
		- OS didn't take care of buffering writes
	- separate APIs for sequential vs random access
	- asynchronous APIs
		- need to keep checking if I/O operation completed
	- pushed complex reasoning up to the user
- Unix:
	- unified API, simple
		- write(fd, buffer, count) blocking APIs -> issue I/O operation then ask scheduler to wake up process again
		- seek - for random access
	- moved buffer cache in kernel
		- a lot of applications wanted to use buffer cache
#### File Names and Directories
- Before Unix:
	- one directory per user
	- directories represented differently on disk
- Unix:
	- directories stored just like files
	- files were independent of directories
		- multiple file names can point to a file
	- hierarchical namespace
		- `/root/dir1/dir2/dir3....`
		- *mount* connect multiple filesystems

| "."         |                 |
| ----------- | --------------- |
| ".."        |                 |
| "file1.txt" | -> file on disk |
| "file2.txt" |                 |

### Devices
- Before Unix:
	- per-device kernel calls
		- different kernel calls or syscall for devices
- Unix:
	- device-independent I/O
		- treat all devices as files
		- use read and writes to get device info from file
	- ioctl - device-specific functionality

### Protection Model
- Before Unix:
	- list of users (Multics)
- Unix:
	- 6 bit scheme R/W/X permissions
	- set-user-id
- Today:
	- 9-bit scheme owner/group/other R/W/X
### Processes
Before Unix:
- one process per user
Unix:
- many processes per user
	- fork(label)
		- where the child should jump to
	- exec()
Today:
- fork()
	- starts at where the fork is called
### Shell
Before Unix:
- built into kernel
	- users had to use whatever shell came with kernel
Unix:
- shell is a user-level program
- I/O redirection
	- $ command < in.txt > out.txt
- example pseudo code:
```
	while (1){
		read command
		fork()
		if child
			reassign stdin & stdout
			exec(command)
		wait(child)
	}
```

### APIs for Process Creation
Unix: fork() and exec()
windows: CreateProcess(name, cmd, attributes, ...)

Pros of Fork:
- easy, simple
- copy on write keeps overhead low
- easy to share resources between parent and child
Cons of Fork:
- inefficient/slow
- complex to integrate in kernel
	- lots of stuff to copy
- isn't thread safe
- insecure
	- copying everything and can copy things that you don't want

### Summary of UNIX
- unifying abstractions
- careful decomposition