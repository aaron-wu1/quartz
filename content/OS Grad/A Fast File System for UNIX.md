---
date: 2025-11-19
tags:
  - OS
---
source: https://dl.acm.org/doi/pdf/10.1145/989.990

## Introduction

The paper introduces changes from the original 512-byte UNIX file system
- Motivations, methods, rationale

Original UNIX system ran on PDP-11 (old comp limited mem)
- File sys. I/O is buffered by the kernel
- No alignment constraints on data transfers
- All operations are made to appear synchronous

**Issue**
- On VAX-11, the original 512-byte UNIX filesystem is incapable of providing the data throughput that many applications requires

## Old File System
Structure:
- Disk drive is divided into one or more partitions
	- Each disk partition may contain one file system, a file system never spans multiple partitions
- *Superblock* - configuration, contains basic parameters of the file system
	- num datablocks, max files, pointer to *free list*, linked list of all the free blocks in fs
- *Inode* - file descriptor that contains information describing metadata of the file
	- contains an array of indices that point to data blocks for file
		- An inode may also contain references to indirect blocks containing further data block indices
**Issues**
- Original file systems segregates the inode information from the data.
	- As a result accessing a file incurs a long seek from the file's inode to its data
	- Inodes are also not allocated in consecutive slots -> causing many nonconsecutive blocks of inodes to be accessed when executing operations on inodes of several files in a directory
- Allocation of data blocks to files is also not optimal
	- Doesn't transfer more than 512 bytes per disk transaction
	- Often need to seek between 512 byte transfers
	- Huge overhead
- Free list originally was ordered for optimal access, but as files were created and removed, free list became entirely random
	- Blocks were allocated randomly over the disk
	- Forced a seek before every block access

**Previous improvements**
- Increasing the block size from 512 -> 1024

Even with previous improvements, only 4% utilization of disk bandwidth

## New File System Organization
- Each disk drive contains one or more file systems
	- file system is described by superblock, located at the beginning of the file system's disk partition
		- replicated to protect against loss
		- **RELIABILITY**
	- Minimum size of a file system block is 4096 bytes
- File system organization divides a disk partition into one or more areas called *cylinder groups* - logical subdivision of disk
	- A cylinder group comprised of one or more consecutive cylinders on a disk
	- Bookkeeping information that includes a redundant copy of the superblock, space for inodes, bit map describing available blocks in the cylinder group, summary information describing the usage of data blocks within the cylinder group
	- Superblock information spread out with a varying offset from the begining of the cylinder group 

### Optimizing Storage Utilization
- Larger blocks than original 1024 bytes -> 4096 bytes
- Larger blocks causes internal fragmentation, to fix this new FS allows blocks to be divided into 2,4, or 8 fragments, each of which is addressable
	- Lower bound of size of fragments is constrained by disk sector size
- ON file write:
	- if there's enough space on allocated block or fragmented, data is written there
	- if file contains no fragmented blocks and no sufficient space on last block. A full block is allocated and new data is written there.
	- if file contains one or more fragments, if data exceeds the size of a new block, a new block is allocated. Contents of the fragments are copied to the beginning of the block and the remained of the block is filled with new data.
- Result is same disk utilization when new file system's fragment size equals an old file system's block size

### File System Parameterization
- Parameterize the processor capabilities and mass storage characteristics so that blocks can be allocated in an optimum configuration-dependent way.
	- Parameters include:
		- speed of processor
		- hw support for mass storage transfers
		- characteristics of mass storage devices
- FFS computes how many sectors to skip after writing a block so the next block appears under the disk head in the expected amount of time.

### Layout Policies
Where should the data block reside for optimal seeks but keep system healthy for future allocations
Two parts:
- Global polices that use file system wide summary information to make decisions regarding the placement of new inodes and data blocks
- Local allocation routines that use locally optimal scheme to lay out data blocks
**Goals:**
- **Increase the locality of reference to minimize seek latency**
- **Improve layout of data to make larger transfers possible**

Tradeoffs:
 - Too much localization creates single huge cluster of data
	 - local cylinder group may run of space forcing data to be scattered to nonlocal cylinder groups
- Maintaining complete information is costly, implementation of global layout policy uses heuristics that employ only partial information

## File System Functional Enhancements
Implemented due to new FFS required everyone to dump and restore new file systems
- **Long file names**
	- nearly arbitrary length
- **File locking**
	- adds advisory shared and exclusive locks so processes can coordinate safe access to a file
- **Symbolic Links**
	- multiple directory entries in the same file system to reference a single file
- **Rename**
	- Rename system call does rename operation where it guarantees the existence of the target name
- **Quotas**
	- retricting amount of file system resources that a user can obtain
