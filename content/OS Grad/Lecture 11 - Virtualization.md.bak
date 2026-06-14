---
date: 2025-10-30
tags:
---
## Containers  + VServer
**Planet Lab**
- compute platform
- distributed across university
- very resource constrained
**Docker**
- creating images for containers

 **Kubernetes**
- runtime environment for containers

**Context**:
- **Both docker and kubernetes being "higher level" than containers described here**

**VServer -> Linux containers today**
- namespace
- cgroups

"VM" has two meanings:
- hardware virtualization
- containers

### Container-Based OS virtualization (COS)
- Same OS, but gives the illusion for some processes that it's on their own OS
![[container based OS virtualization]]
- OS sees just a bunch of processes
- Processes within containers see themselves as OS

Comparison with hardware virtualization (e.g. Xen)

| Benefits of Containers                                                                                                                      | Drawbacks                    |
| ------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------- |
| lightweight, faster to start up                                                                                                             | no heterogenous OS selection |
| lower overhead, more efficient                                                                                                              | less isolation - shared OS   |
| more scalable -> enables overcommitment (allocates more resources than possible and hope users don't need that many resources all the time) | OS must be modified          |
### Isolation
- **resource isolation**
	- Don't want VM or container to impact allocation of another
		- eg:
			- **crosstalk**
			- **fork bomb**
- **fault isolation**
	- buggy or malicious container
- **security isolation**
	- limit info about other containers

### Contexts
- context = namespace
- user - UID/GID
- process - PIDs
- network - IP addresses, ports
- mount - files

### Filters
- only return entities in the same container
	- access control
- Ensure containers only see processes within its own namespace

### Resource Allocation
- CPU, memory, network, disks
- Extend resource allocation to support *groups* of processes
	- Need to define policies for allocation
- *token bucket filter*
	- CPU scheduling, network bandwidth
	- want to enforce consistent rate, but allow for bursts to happen
	- ![[token bucket filter]]
### File System
![[Container-based FS]]
For more efficiency, VServer use a CoW mechanism for redundant files that don't change, eg. `/bin`,  `/lib`
- in paper:
	- 500MB for 1 container
	- 700MB for 10 containers

### Evaluation
Microbenchmarks - Xen has higher overhead
- more hypercalls for updating page tables
Network and disk - Xen has high overhead
CPU/memory - similar to Xen

### Summary of Containers
- Containers - virtualization at OS level rather than HW level
- Uses namespaces and filters for isolation
- Resource allocation - requires policies and systems

## Core Slicing
Worried about **malicious hypervisors**
### Risks
- read memory, code, packets, or data in storage
	- break confidentiality
- limit resources - CPU, I/O, memory, etc
	- reduces availability
- modify memory, code, packets, etc.
	- breaks integrity of VM
- return incorrect values from hypercalls

### Causes
- malicious developer
- malicious administrator
- supply-chain attacks
	- companies depend upon other vendor, compromise third party vendor
	- huge trusted computing base
### Confidential VMs
- hardware support for confidentiality
	- AMD SEV-SNP
	- Intel TDX
	- ARM...
- Idea is run entire VM in trusted execution environment
	- **Trust Domain abstraction** - run VM in it
- **Memory encryption** -> confidentiality
	- trusted context switch
- optional authentication codes -> integrity
- Remote attestation
	- Want to make sure our VM is running what we want it to run


| Pros                        | Cons                                                    |
| --------------------------- | ------------------------------------------------------- |
| unmodified apps             | modify guest OS                                         |
| integrity & confidentiality | add overhead                                            |
| defends against hypervisors | have to trust HW                                        |
| available today             | still vulnerable (paper addresses side channel attacks) |

### Side-Channel Attacks
- Leveraging info about program to infer secrets
- vulnerable on CPU:
	- page table
	- caches
	- branch predictors
	- interrupts
- hard to avoid

### VMs in public clouds
- cores dedicated to VMs
- memory statically allocated
- I/O offloaded to hardware

### Core Slicing
- partition resources into guest slices
	- cores
	- range of memory
	- virtual I/O devices
- slice0 - management role
- similar to exokernel, where slices use the actual name of resources (like which core, etc)
- *lockable filter registers* - limit which physical resources that your slice can access
- *core-local reset* - secure way to reset lockable filter registers
- **Trusted components now:**
	- hardware
	- slicevisor
	- sliceloader

### Core Slicing Summary 
- Confidential VMs - aim for confidentiality and integrity
- Side-channel attacks
- Core slicing: slices - dedicated hw resources




