---
date: 2025-11-15
tags:
- performance
- operating-systems
- virtualization
- concurrency
- security
- distributed-systems
title: IX - A Protected Dataplane Operating System forHigh Throughput and Low Latency
---

Source: https://www.usenix.org/system/files/conference/osdi14/osdi14-paper-belay.pdf

## Abstract
Conventional wisdom is aggressive networking requirements, such as high packet rates for small messages and microsecond-scale tail latency, are best addressed outside the kernel, in a user-level networking stack.

IX breaks this wisdom by using HW virtualization to separate management and scheduling functions of the kernel (control plane) from network processing (dataplane).
- The dataplane architecture builds upon a native, zero-copy API and optimizes for both bandwidth and latency by:
	- Dedicating hardware threads and networking queues to dataplane instances
	- Processing bounded batches of packets to completions
	- By eliminating coherence traffic and multi-core synchronization

IX is a *dataplane operating system* that provides high I/O performance while maintaining the key advantage of strong protection offered by existing kernels

## Introduction
Datacenter applications such as, Search, social networking, and e-commerce platforms, require hundreds of software services that are deployed on thousands of servers. This creates a need for networking stacks that provide more than high streaming performance (throughput), but high packet rates for short message, microsecond-level responses with tight tail latency guarantees, and support for high connection counts and churn.
- Also important to have strong protection model and elastic in resource usage

**Dataplane** - component of a system responsible for **network processing** and running the **networking stack and application logic**
- Originated from the design of high-performance middleboxes like firewall, load-balances, and software routers. 
- Aim low latency, high packet rates
## Datacenter challenges
- **Microsecond tail latency**
	- To enable interactions between a large number of services without impacting overall latency experienced by the user
	- ~ few tens of $\mu s$
- **High packet rates**
	- request and replies are often quite small, need a high packet rate to maintain speeds
- **Protection**
	- Multiple services share servers in both public and private datacenters, requires isolation between applications
- **Resource efficiency**
	- Ideally, each service node will use the fewest resources needed to satisfy packet rate and tail latency requirements at any point.

**Hardware and OS mismatch - OS is bottlenecking the optimal performance of HW**

## IX Design Approach
- **Microsecond latency** and **high packet rates** have been addressed in the design of middleboxes such as firewalls, load-balancers, and software routers
	- They integrate the network-stack and the application into a single *dataplane*
- **Proection** and **resource efficiency** are not addressed in the middleboxes because they are single-purpose systems (not exposed directly to users) 

**Middle boxes design principles that differ from OS**
- *Run each packet to completion*
	- OS decouple protocol processing from application itself to providing scheduling and flow control
- Optimize for *synchronization-free operation* to scale well on many cores
	- OS tend to rely on coherence traffic and are structured to make frequent use of locks and other form of synchronization
IX extends the dataplane architecture to support untrusted, general-purpose applications and satisfy all datacenter challenges requirements

### IX Key design principles
- **Separates the control and data plane, but maintains protections**
	- Control plane dedicates entire cores to data planes and memory is allocated at large page granularity
	- Similar to [[Lecture 9 - Extending the OS#Exokernel|Exokernel]], each dataplane runs in a single application in a single address space
		- use modern virtualization hw to provide three-way isolation between the control plane, the dataplane, and untrusted user code
		- dataplanes are given direct pass-through access to NIC queues through memory mapped I/O
			- certain physical device registers or queue descriptors are exposed at fixed physical addresses
	- **key idea**
		- dataplane runs in protected memory space (VMX non-root ring 0)
		- application can only view incoming data buffers as read-only, preventing the application from corrupting the networking stack
		- Application sents an "immutable contract" of memory locations that it sends over to dataplane that it promises not to change until transmission is acked.

- **Run to completion with adaptive batching**
	- All stages to receive and transmit a packet are run to completion, protocol processing (kernel mode) and application logic (user mode) are interleaved
	- This leads to no need for intermediate buffering between protocol stages or between application logic and the networking stack
	- **IX polls all the time because everything is run to completion, also avoid livelock**
	- **batching adaptively at every stage of the network stack**
		- never wait to batch request and batching only occurs in the presence of congestion
		- set an upper bound on the number of batched packets
	- **Key idea**
		- workers process a small, bounded batch of packets through all stages before moving to next batch for tight interleaving and locality benefits
- **Native, zero-copy API with explicit flow control**
	- Tags messages as read-only that's passed between dataplane kernel and application, until either is done.
- **Flow consistent, synchronization-free processing**
	- Multi-queue NICs with receive-side scaling
	- **key ideas:**
		- **flow-consistent hashing to direct package to specific queue**
		- **Synchronization-free** because the hashing ensures that packages belonging to a specific source are routed to the same worker
## Implementation
**IX control plane components** 
- full Linux kernel 
	- ran on VMX(hypervisor) root ring 0
	- applications run in VMX non-root ring 3
- *IXCP* - user level program that monitors resources usage, dataplane performance, and implements resource allocation policies

Each IX control plane 
- Supports a single, multithreaded application
- Operates as a single address-space OS
- Supports two thread types within shared, user-level address space
	- *Elastic threads* - interact with IX dataplane to initiate and consume network I/O
		- Each makes exclusive use of an allocated core or hardware thread
	- *Background threads*
		- May timeshare an allocated hardware thread

### IX Dataplane
- Specialized for high performance network I/O
- runs a single application
- similar to a library OS, but with memory isolation
- Memory:
	- Each memory pool is structured as arrays of identically sized objects, in provisioned in page-sized blocks
		- Accepts some internal memory fragmentation to reduce complexity and improve efficiency
	- *Mbufs* - storage object for network packets are stored as contiguous chunks of book keeping data and MTU-sized buffers
	- Manages its own virtual address translations
	- Large pages (2MB), due to reduced address translation overhead
	- Maintains a single address space
		- kernel pages are protected with supervisor bits
### Dataplane API and Operation
- Elastic threads of an application interact with IX dataplane through three asynchronous, non-blocking mechanisms
	- issue *batched system calls* to the dataplane
	- consume *event conditions*
	- direct, safe access to *mbufs* containing incoming payloads
- Build user-level lib called `libix` that abstracts away the complexity of IX's low-level api

### Multi-core Scalability
- Elastic threads operate in synchronization and coherence free manner in common case
	- Exclusive use of allocated hw thread
	- How?
		- System calls can only be synchronization-free if the API itself is commutative and IX API is commutative between elastic threads
			- through having flow identifier namespaces
		- API implementation is carefully optimized
			- each elastic thread manages its own memory pools, hardware queues, event condition array, and batched system call array
		- Flow-consistent hashing at NICs
			- each elastic thread operates on a disjoint subset of TCP flows

### Security
- Application code in IX runs in user-mode
- Dataplane code runs in protected ring 0