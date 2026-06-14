---
date: 2025-10-27
tags:
- virtualization
- performance
- operating-systems
- computer-architecture
title: Xen and the art of virtualization
---

source: https://dl.acm.org/doi/abs/10.1145/1165389.945462

## Question
Microkernels and virtual machine monitors are two different ways to support the execution of multiple operating systems on modern hardware. How does the microkernel approach in L4 compare and constrast with the VMM approach in Xen?

Microkernel in L4 uses a shadow page table to have a complete copy of the user space page table for consistency. In Xen they disregard that idea for performance and instead only verify if the page updates are not breaking. 
## Abstract
In prior virtualization systems, there is a tradeoff between performance and functionality. 

The paper presents Xen, an x86 virtual machine monitor which allows multiple commodity operating systems to share conventional hardware in a safe and resource managed fashion, but without sacrificing either performance or functionality
- Achieved by providing an idealized virtual machine abstraction where OSes can be *ported* with minimal effort

Targeted at hosting up 100 virtual machines instances simultaneously on a modern server.

## Design Goals
- Separate policy from mechanism wherever possible
	- hypervisor itself only provides basic control operations
		- Initial domain *Domain0* is responsible for hosting the application-level management software
			- eg. create and terminate other domains

## Introduction
**Requirements of successful partitioning of a machine for OSes (VMs)**
- VMs must be isolated
- High support for a variety of OSes to accommodate for heterogeneity of popular applications
- Performance overhead introduced by virtualization should be small

Admission control when starting new VMs?
VM to *pay* in some fashion for resources it requires?

Naive solution:
- Deploy one or more hosts running a std OS (windows, linux) and then allow users to install files and start processes
	- Issues:
		- Ensuring *all* resource usage is accounted to the correct process
			- Interactions between applications due to buffer cache or page replacement algos
			- "QoS crosstalk" - quality of service communication 
**Xen**:
- Multiplexes physical resources at the granularity of an entire OS
- Provides performance isolation between them
- aka running a full OS

## XEN: Approach and Overview
Different virtualization approaches
- *Full virtualization* - allowing unmodified OSes to be hosted.
	- Drawbacks:
		- Certain supervisor instructions must be handled by VMM for correct virtualization (need trap for perms)
		- x86 MMU not built for virtualization
- *paravirtualization* - what Xen does
	- some modifications for improved performance
	- don't change application binary interface (ABI), no need to modify guest applications
- **key design principals:**
	- Support for unmodified application binaries
	- Support for full multi-application OSes
	- Paravirtualization is necessary for high performance and strong resource isolation for difficult architectures, x86
	- Completely hiding the effects of resource virtualization from guest OSes risks both correctness and performance

**Scaling**
- Intended to scale to approximately 100 virtual machines running industry standard applications and services

### Paravirtualization
![[Screenshot 2025-10-28 at 10.54.38 AM.png]]

## Virtual Machine Interface
### Memory Management
Design decisions based on x86 not having a software-managed TLB:
1. Guest OSes are responsible for allocating and managing HW page tables, with minimal involvement from Xen to ensure safety and isolation
2. XEN exists in a 64MB section at he top of every address space, thus avoiding a TLB flush when entering and leaving the hypervisor.
	- To distinguish entries from different addr spaces and when VM traps into XEN, CPU doesn't need to switch to a new addr space

Each time a guest OS requires a new page table, it allocates and initializes a page table from its own memory reservation and registers it with XEN
- XEN validates updates

### CPU
Big problem: inserting hypervisor below the OS violates that the OS is the most privileged entity in the system
- Guest OSes must be modified to run at a lower privilege level

Many processor architecture only provide two privilege levels
- Guest OSes would share privilege level with application
- To protect itself, guest OSes would run in separate address spaces from its applications
x86 has 4 levels (Rings) so not a problem

Exceptions are handled by a table registered with XEN, think like trap table

Typically only two types of exceptions occur frequently enough to affect system performance: system calls and page faults
- For system calls:
	- Each guest OS registers a "fast" exception handler without indirecting via ring 0. This is validated before installing it in the hardware exception table
	- Doesn't work for page faults because code executing in ring 0 can read the faulting address
- For page faults:
	- Always must be delivered via XEN so that register value can be saved for access in ring 1
**safety for exception handlers**
- Only required check is that the handler's code segment does not specify execution in ring 0

### Device I/O
I/O is transferred to and from each domain via Xen, using a shared-memory, asynchronous buffer-descriptor rings. Provide high communication mechanism for passing buffer information vertically through the system.

## Design
### Control Transfer
Two mechanisms exist for control interactions between Xen and an overlying domain
- **Hypercalls** - allows domains to perform a synchronous software trap into the hypervisor to perform a privileged operations
	- eg requesting for list of page table updates
- Communication from Xen to a domain is provided through an asynchronous event mechanism, which replaces the usual delivery mechanisms for device interrupts and allows lightweight notifications of important events such as domain-termination requests

### Data transfer: I/O Rings
Just copying data across from Xen to guest OS is expensive, need **zero-copy communication**, where data is shared not duplicated.

**Shared-memory Ring Buffers**
- Each guest OS shares with Xen a **ring buffer**
	- Circular queue started in memory that both sides can access
	- like a mail box, where mail are descriptors
	- requests and response on the same queue that dictate either Xen and guest OS as producer/consumer or vice versa

Two main factors have shaped the design of our I/O-transfer mechanism:
- **resource management** 
	- minimize demultiplexing overhead, managing buffers for domains
	- Each guest OS has their own domain ringbuffer
- **event notification** - put response in shared queue

## Subsystem Virtualization
### CPU scheduling
- Borrowed Virtual Time (BVT) scheduling algorithm
	- Work-conserving and special mechanism for low-latency wake-up (or dispatch) of domain when it receives an event
	- Fast dispatch is particularly important to minimize the effect of virtualization on OS subsystems that are designed to run in a timely fashion
	- **uses virtual-time warping** - algo that temporarily violates "ideal" fair sharing to favor recently-woken domains
### Virtual Address Translation
Xen is only involved in page table *updates*, to prevent guest OSes from making unacceptable changes. No need for *shadow page tables* like in an full virtualization setup.
- Page table updates are passed through Xen via hypercall and validated before applied (can be batched)
- Guest OS typically flush TLB before new mapping