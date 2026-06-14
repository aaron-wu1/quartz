---
date: 2025-12-02
tags:
- operating-systems
- storage
- performance
- caching
- concurrency
- computer-architecture
title: Lecture 18 - File System Pt2
---

## Problem
**FS consistency after a crash**

### File system inconsistencies
- Lost file data - tolerable (in small amounts)
- Inconsistent metadata - NOT OKAY
	- Don't know which files exist or corrupted
	- Metadata: directories, inode, free list bitmaps
	- Inconsistent state due to FS crashes in the middle of modifying some but not all parts of metadata
In order to mitigate inconsistent files
- `fsck` - file system consistency checker
	- Runs after reboot to restore consistency
	- Checks all files to make sure they are consistent, if not it will update to be consistent
	- Drawbacks:
		- Can't always fully restore consistency
			- say a bitmap saying a block is in use, but no inode pointing to it???
		- takes a long time to run
File buffer cache - caches file data
- Write to storage periodically(e.g., ~30 seconds)
- data and metadata
- For consistency, `fsync` forces a flush to storage
Consistency in FFS
- synchronous writes

## Soft Updates
- ordering constraints
	- No dangling ptrs
	- No reuse until old ptr removed
	- Never reset an old ptr until new one persists
- Uses in memory data structures to track these dependencies, can allow async write and write data in a safe manner
- Overall approach
	- Write changes to file buffer cache
	- Track dependencies between blocks
	- Write blocks in a safe order that respects dependencies

### Challenge: Circular Dependencies
- When tracking dependents in block level, can end up with blocks that are mutually dependent
- Example: 
	- Create a file: (no dangling pointer)
		1. Create Inode
		2. Add directory entry
	- Delete a file: (same no dangling pointer)
		1. Remove the directory entry
		2. re-initialize inode
![[Circular Deps file]]
### Soft updates
- fine-grained dependency tracking
	- track inodes, directory entries, etc, rather than blocks
- Undo/redo
	- temporarily undo operations
	- lock the block while they are rolled back, unlock after rolling forward
![[Soft Updates]]

### Overheads
- Memory overhead from tracking all these dependencies
	- not too bad in practice
- CPU overhead -  extra work for undo/redo
	- if storage device is disk, overhead is mainly on disk
	- On low latency medium like NVRAM, this becomes a bigger issue

### Optimizations
- Write many blocks at once, in parallel
- Skip writes that are undone later
	- temporary files, in `/tmp`

### Evaluation
- FFS - "Conventional", synchronous metadata writes
	- reliability, poor performance
- FFS - "No order", async writes
	- best possible performance, but no reliability
- Soft Updates, both performance and reliability
	- within 5% of "No order" approach
	- don't need to run `fsck` before running after reboot
- Write-Ahead logging

### Summary
- Metadata consistency and ordering constraints
- Soft updates: Fine-grained dependency tracking and roll back
	- more than just the block level


## SplitFS
### Persistent Memory
- Attached to the memory bus
#### Properties
- Capacity - larger than DRAM, smaller than disk
- Latency - 2-4 times slower than DRAM
- Expensive
- Loads/stores to access 
- Non volatile, persistent
- limited # of writes
- byte addressable
- bandwidth, less than DRAM more than disk, 1/2 - 1/3 bandwidth of DRAM
#### Challenges: caching
Data might be in one of the caches and not written out to persistent memory
- Need to use write-through stores
- Non-temporal stores: `MOVNT` on x86
	- get persistence
- flush: `CLFLUSH` on x86, flushes entire cache line
- Use fences to prevent re-ordering
	- fence after the flush to make sure the flush is completed before continuing with later code

### Disk vs Persistent Memory
![[Disk VS Persistent Memory]]
### SplitFS
- past approaches to manging metadata: in-kernel, in userspace
	- SplitFS is **HYBRID**
- data - handle in user space
- metadata - handle in kernel

#### Goal: unmodified apps
![[SplitFS]]
Writes:
- Overwrites - copy
- appends - potentially add new blocks, lots of metadata updates
	- uses staging file
	- write to staging file
	- reconcile on `close()` or `fsync()`
		- update inode to move from staging file to the blocks they actually belong to
#### Relink
![[Relink]]

### Summary of SplitFS
- hybrid user/ kernel to optimize data operations
- staging files and relink operation