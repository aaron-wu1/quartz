---
date: 2025-11-20
tags:
---
Windowes NTFS

NetApp - WAFL
- you can access files as they existed over the past, can't over write data
- LFS and FFS -> write over file block

## FFS
Minimizing seek to improve performance

issues:
- Random block placement
	- Layout of blocks random require long seek
	- inode and data apart constantly seeking
- Inode placement
- Low B/W util
- Small Max File Size
- Waste
	- internal fragmentation
- Recovery
- Device Oblivious 
	- support multiple differentdevices

FFS
- Random block placement
	- Solution Cylinder group
		- set of tracks at a certain radius across all the surfaces of a spinning disk
		- still use the terminology in SSDs
		- reduce distance of seek
- Inode placement
	- Solution Cylinder group
-  Low B/W util
	- Batch I/O
	- Increasing Block Size, more pointers can store in which indirect block = larger files and larger files transfers 
- Small max File size
	- Increasing files Block Size leads to more internal fragmentation :( 
		- Requires Fragments
- Waste
	- Takes last blocks of file and breaks it down to **smaller fragments**, smaller grained allocations
	- reduces internal fragmentation
- Recovery
	- Superblocks are allocated at every platter, in case one is broken
- Devices Oblivious
	- Hardware params, make it optimized to certain devices, also on disks blocks might rotate out of position, need to predict response time and rotation

How FFS managing hot spots but keeping localization performance
	- Global policy - choose cylinder group less utilized
	- Local policy - want to allocate files to same cylinder group as other files in directory

## LFS

### Trends
- Tech
	- CPU, increases
	- Mem, increases, File buffer cache increases (higher the I/Os that goes to disk is going to be writes (more hits to cache!))
	- Disk Latency, eh slight improvements
	- Disk Bandwidth, increases (function of disk density, improvement in density = improvement to bandwidth)
- Workload
	- small files, requires lots of metadata to access, can't amortize workload
		- bane of file system goals of maximizing performance
### Why?
- CPU is the bottleneck of FFS
- FFS still has to do seeks that limits performance 
- LFS  -> remove seeks
	- How? using LOGS!
		- Never move data blocks around

### LFS
Batch large files writes, with write buffer from logs

#### Achillies heel
- Cleaning RIP

What's cool about this paper?
- Both mechanism and policy paper
	- policy in cleaning

Cleanring policy:
- Cold data - long lived, unlikely than any data will get deleted
- Hot data - short lived/frequently used, wait to be clean them until their utilization gets low

Slower reads?
- LFS has to introduce inode maps, because there is no location for anything in FS


