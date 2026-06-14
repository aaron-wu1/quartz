---
date: 2025-10-28
tags:
---
![[Virtualization]]

## [[The Origin of the VM 370 Time-Sharing System|VM 370]]
### Why VM?
- OS development
- Isolation
- An alternative to batch processing
- Management of multiple processes
- Emulating new hardware
	- Trying out new instructions and see what kind of new functionality would it enable
- Continuous operation

### Structure
**Control program**
- hypervisor
**CMS** 
- Guest OS
**RSCS**
- communications

![[vm360]]

### Virtualization in VM/370
**Challenge**: handling privileged instructions
- eg. Modifying TLB entries or halting CPU
- **What's done:**
	- Trap to CP and CP emulates the behavior
	- called "trap and emulate"
## Xen

### Influential
- Released open source
- research, experimentation
- industry -> Amazon AWS

### Why VMs (in 2000s)?
- VMWare - similar motivations as VM/370
- Xen - datacenters
	- Goal: rent parts of a server

### Requirements for datacenter VMs
- Isolation - security, performance
	- users are paying for x resources, unhappy if not getting x resources
- Scalability - number of users per machine they can support
- Performance - minimize VM overhead as possible, close to bare metal as you can
- Heterogeneous operating systems
	- Don't want to constrain users to os
- Resource accounting

### Alternatives at the time?
- none really
- no containers, no FaaS

### Xen
![[Xen]]
**Challenge**: virtualizing x86 hardware
- Hardware-managed TLBs (x86 and ARM)
	- no hypervisor intervention to choose TLB entries
- Doesn't trap on every privileged instructions
	- Some x86 instruction behaves differently at user level vs kernel
	- Eg. `popf` instruction
- I/O overheads
### Xen's Approach: Paravirtualization
- *Paravirtualization*: modify the Guest OS
	- Replace privileged instructions with *hypercalls* into Xen
### VMWare's Approach: Binary Rewriting(aside from paper)
- Support all kinds of operating systems
- *Binary rewriting* - rewrite privileged instructions -> call into hypervisor
	- check if there's privileged instructions coming and then trap to hypervisor. Special software that does it at runtime

### Xen vs VMWare
- Xen -> user change code
- VMWare -> special software

### CPU
- key approach: paravirtualization
- how does Xen handle: 
	- syscall, exceptions, interrupts
		- Xen routes to guest OS
		- optimization for syscalls
			- create a trap table in guest OS to skip having to route to Xen 
- scheduling
	- Timeslice VMs on CPUs

### Memory
![[Xen Memory]]
- Page tables - read only for guest OS
- Xen validates and updates PTEs
- Uses Xen to translate to hardware/machine memory
- Similar to Exokernel where both call in privilege to validate memory
#### VMWare approach
![[VMWare]]

### I/O
- Disk, network
- Too many devices drivers to modify

![[Xen IO]]

### Hardware Support for Virtualization
#### CPU
- ring 3 - applications -> trap to ring 0
- ring 0 - guest OS -> trap to root ring 0
- root ring 0 - hypervisor
#### Memory
Intel's Extended Page Tables (EPT)
- Hardware can walk both sets of page tables
#### I/O
- steering I/O
- manage memory properly
- SR-IOV
	- for each device, expose various slice of it
	- eg. network card multiplex requests from VMs
	- "one device pretends to many different devices"

## Virtualization Summary
- Trap and Emulate
- x86 - hard to virtualize
	- paravirtualization
	- binary translations
	- hardware extensions (hw support)