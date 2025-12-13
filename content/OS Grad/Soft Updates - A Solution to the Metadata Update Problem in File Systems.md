---
date: 2025-11-29
tags:
---
Source: https://users.ece.cmu.edu/~ganger/papers/softupdates.pdf

## Core Issue
**Metadata Updates** - has been a source of performance, integrity, security, and availability problems for file systems
- Eg. file creation and block allocation

To illustrate issue with Metadata Updates, consider file creation, FS has to create multiple independent pieces of metadata on disk (inode, directory data block, free map)
- To prevent corruption, the updates must have in order, this requirement is called **Update Dependency**
**Update Dependency follow three rules** (**Ordering Constraints**):
1. Never point to a structure before it has been initialized
2. Never reuse a resource before nullifying all previous pointers
3. Never reset the last pointer to a live resource before the new pointer has been set
	- E.g. when renaming a file, do not remove the old name for an inode until the new name has been written

The authors present **soft updates**, an implementation technique for low-cost sequencing of fine-grained updates to write-back cache blocks.
- Disk using soft updates can be comparable to a memory-based file system performance
- As well as stronger integrity and security guarantees than most disk-based file systems

Good for workloads with frequent updates on metadata (such as creating and deleting files)

## Background
**Metadata** - gives structure to raw storage capacity
- FS must maintain integrity of metadata for persistent storage
	- eg no dangling pointers to uninitialized space
	- no ambiguous resource ownership caused by multiple pointers

Past work to solve metadata updates and issues:
- *Synchronous Writes* - capped by disk speeds
- *Nonvolatile RAM (NVRAM)* - extra hardware expenses, soft updates can achieve similar performance without extra hardware
- *Atomic Updates* - group a set of dependent updates as an atomic operation, requires write-ahead logging (writing to a log file prior to commit)
	- Doesn't match the speed of soft updates, due to logging
- *Scheduler-Enforced Ordering* - FS can use asynchronous writes for metadata and pass any sequencing restrictions to the disk scheduler with each request
	- delayed writes cannot safely be used when sequencing is required, requires visibility to the writes in order to schedule.
- *Interbuffer Dependencies* - delayed writes for all updates and have the cache write-back code enforce ordering on disk writes
	- Issue of circular dependencies and how to order writes which reverts back to synchronous writes.

**Ideal Solution**
 1. Applications should never wait for disk writes unless explicitly choose to do so
 2. System should propagate modified metadata to disk using the minimum possible number of disk writes
 3. The solution should minimize the amount of main memory needed to cache dirty metadata and related auxiliary info
 4. The cache write-back code and disk request scheduler should not be constrained in choosing what blocks to write to disk, beyond  the minimal restrictions for guaranteeing consistency
	 - Flexibility is important for scheduling algorithms to reduce positioning delays. (not sure if this applies as much anymore)

## Soft Updates
**Soft updates** - tracks dependencies among the updates to cached copies of metadata and enforces these dependencies, via update sequencing.
- When performing a metadata update, the in-memory copy of the relevant block is modified normally, and the corresponding dependency information is updated appropriately
	- The in-memory copy allows lets the application continue
- The dependency information is then consulted when dirty blocks are flushed to disk
	- Done in the background
- *Rollback* - For changes in memory that are not ready to migrate to disk, memory is rolled back to an original ready snapshot before it goes to disk.
	- Eg. file metadata is partially created
### Cases
- Block allocation
- Block deallocation
- Link Addition
- Link Removal

### Recovery
- Crash in conventional FS, leaves disk in unknown state due to out of order writes. To fix (fsck), you would need to scan the **entire disk**
- For soft updates, since soft updates uses the rollback/undo, it guarantees that the disk is always "consistent"
	- Can have "space leaks" - blocks marked as "in use" but not part of any file
	- doesn't corrupt data

### Metadata dependencies
Soft Updates keep track of dependencies in
