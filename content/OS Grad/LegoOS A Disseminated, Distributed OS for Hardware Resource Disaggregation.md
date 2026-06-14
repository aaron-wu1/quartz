---
date: 2025-10-21
tags:
- distributed-systems
- operating-systems
- computer-architecture
- performance
- virtualization
- caching
title: LegoOS A Disseminated, Distributed OS for Hardware Resource Disaggregation
---

source: https://www.usenix.org/conference/osdi18/presentation/shan

## Abstract
**Current:**
Software layers for distributed applications
- Distributed systems on monolithic servers/OS
- Customize servers for different functionalities
**overhead of layering constrained when customizing**
![[Screenshot 2025-10-21 at 11.30.33 AM.png]]

**Research:**
- To improve resource utilization, elasticity, heterogeneity, and failure handling in data centers, the paper proposes that datacenters should break monolithic servers into *disaggregated, network-attached hardware components*.
- Propose a new OS model called the *splitkernel* to manage disaggregated systems
	- Splitkernel disseminates traditional OS functionalities into loosely-coupled *monitors* (manager for component not OS monitor) each of which runs on and manages a hardware component.
	- Splitkernels also performs:
		- resource allocation
		- failure handling
- *LegoOS* uses this splitkernel
	- user applications can span multiple processors, memory, and storage hardware components
	- comparable to monolithic Linux servers


## background
Hardware is becoming more heterogeneous
![[Screenshot 2025-10-21 at 12.33.42 PM.png]]
New proposal:
![[Screenshot 2025-10-21 at 12.33.59 PM.png]]

**Limitations of Monolithic servers**
- inefficient resource utilization
- poor hw elasticity
- coarse failure domain
- bad support of heterogeneity
## Problems
1. *bin-packing problem* - trying to fit applications to physical machines. Since processes can only use process and memory in the same machine it is hard to achieve full memory and CPU resource utilization
2. After packaging hardware devices in a server, it is difficult to add, remove, or change hardware components in datacenters
3. modern datacenters host increasing heterogeneous hardware. However, designing new hardware that can fit into monolithic servers and deploying them in datacenters is painful and cost-ineffective
## Solution
Datacenters should break monolithic servers and organize hardware devices like CPU, DRAM, and disks as *independent, failure-isolated, network-attached components*, each having its own controller to manage its hardware
- aka Hardware Resource Disaggregation
## HW Resource Disaggregation
Other kernels:
- Monolithic - build for localized HW
- Multi-kernel - networked kernels but still monolithic HW per kernel
So need to design new kernel, *splitkernel*, a new OS architecture for hardware resource disaggregation
- *When hardware is disaggregated the OS should be also*

### Splitkernel
Breaks traditional operating system functionalities into loosely-coupled *monitors* each running at and managing a hardware component.
- All monitors in a splitkernel communicate with each other via *network messaging only*

Monitors in a splitkernel can be heterogeneous and can be added, removed, and restarted dynamically without affecting the rest of the system

**There are only two global tasks in a splitkernel: orchestrating resource allocation across components and handling component failure**

Four key concepts of Splitkernel:
- *Split OS functionalities* - breaks traditional OS functionalities into *monitors*
	- Monitors are loosely-coupled and communicate with other monitors to access remote resources
- *Run monitors at hardware components*
	- each non-processor HW component is in a disaggregated cluster to have a controller that can run a monitor.
- *Message passing across non-coherent components*
	- runs over a general-purpose network layer like Ethernet
	- neither the underlying hw or splitkernel provides cache coherence across components
		- cache coherence still applies to an individual HW component like cores in CPU
- *Global resource management and failure handing*
	- only involves global resource management occasionally for coarse-grained decision, while individual monitors make their own fine-grained decisions.

### LegoOS
Distributed OS that appears to applications as a set of virtual servers (called *vNodes*). A vNode can run on multiple processor, memory, and storage components, and one component can host resources for multiple vNodes.

LegoOS separates OS functionalities into three types of *monitors*: process monitor, memory monitor, and storage monitor

Uses x86-64 architecture

Targets three types of hardware components: 
- processor - called *pComponent*
- memory - called *mComponent*
- storage - called *sComponent*

**Design goals:**
- Clean separation of process, memory, and storage functionalities
- Monitors run at hardware components and fit device constraints
- Comparable performance to monolithic Linux servers
- Efficient resource management and memory failure handling, both in space and in performance
- Easy-to-use, backward compatible user interface
- Supports common Linux system call interfaces

#### Abstractions
LegoOS exposes a distributed set of *virtual nodes* or *vNodes* to users

From users' point of view, a vNode is like a virtual machine. Each vNode has a unique ID, unique virtual IP addr, and a its own storage mount point. 
- LegoOS protects and isolates the resources given to each vNode from others. 
- Internally a vNode can run on multiple pComponents, multiple mComponents, and multiple sComponents

#### HW architecture
- *Separating process and memory functionalities*
	- LegoOS moves all hardware memory functionalities to mComponents (eg. page tables, TLBs) and only leaves caches at the pComponent side![[Screenshot 2025-10-21 at 1.19.52 PM.png]]
- *Processor virtual caches*
	- pComponents will only see virtual addresses and have to use virtual memory addresses to access its caches
	- pComponent caches as *virtual caches*
		- 2 problems:
			- *synonyms* - physical address maps to multiple vaddrs
				- LegoOS does not allow writable inter-process memory sharing
			- *homonyms* - 2 addr spaces use the same vaddr for different data
- *Separating memory for performance and for capacity*
	- *ExCache* - another layer in memory hierarchy between Last-Level Cache (LLC) (in processor) 
		- used to serve hot memory access fasts, while mComponents can focus on providing capacity
#### Process Management
- LegoOS *process monitor* runs in the kernel space of pComponent and manages pComponent's CPU cores and ExCache

**Process Management and Scheduling**
- At every pComponent, LegoOS uses a simple local thread scheduling models that targets datacenter applications

**ExCache Management**
When an ExCache miss happens, process monitor fetches corresponding line from mComponent and inserts it to ExCache
- supports 2 eviction policies:
	- FIFO
	- LRU

#### Memory Management
*memory monitor* manges both the virtual and physcial memory addr spaces:
- allocation
- deallocation
- memory addr mapings
- reads
- writes

**Memory space management**
- *Virtual memory space management*
	- two level approach:
		- home mComponent of a process makes coarse-grained, high-level virtual memory allocation decisions
		- other mComponents perform finegrained virtual memory allocations
	- At higher level split each virtual memory address space into coarse-grained, fixed-sized *virtual regions* or *vRegions* (eg. 1 GB)
		- each vRegion that contains allocated virtual memory addrs is *owned* by an mComponent
	- lower level stores user process *virtual memory area (vma)* information, such as virtual addr ranges and permissions![[Screenshot 2025-10-21 at 1.36.08 PM.png]]
- *Physical Memory Space management*
#### Global Resource Management
Uses two-level resource management mechanism
- perform coarse-grained global resource allocation and load balancing

LegoOS allocates hard-ware resources only *on demand*, when applications actually create threads or access physical memory


#### Reliability and Failure Handling
LegoOS maintains a small append-only log at the secondary mComponent and also replicates a vma (virtual memory area) tree there