---
date: 2025-10-27
tags:
- virtualization
- operating-systems
- computer-architecture
- concurrency
- security
title: The Origin of the VM 370 Time-Sharing System
---

source: https://cseweb.ucsd.edu/classes/fa25/cse221-a/papers/vm370.pdf
## Question 
What was VM/370's motivation for virtualizing the hardware?
Trying to make a personal computer dedicated to a user so by extending time-sharing of a dedicated machine to with more isolation, to the user it seems like they own the computer. This lead to the idea of a virtual machine.
## Introduction
VM/370 is an OS which provides its multiple users with seemingly separate and independent IBM System/370 computing systems.
- Contains three different OSes:
	- Control Program (CP)
		- OS that uses a computing machine to simulate multiple copies of the machine itself
	- Conversational Monitor System (CMS)
		- OS that supports the interactive use of a computing machine by one person, the typical OS used within each virtual machine (VM)
	- Remote Spooling and Communications Subsystem (RSCS)
		- OS used to provide information transfer among machines linked with communication facilities
**Key idea:** perfect hardware compatibility at the ISA boundary
- privileged operations trap to CP
- problem-state code runs natively
- Multiple different OSes run concurrently, isolated from each other

## Design Goals
- Production of VM identical to its real counterpart
- Meant to be a learning experience
- Modularity: split "resource control" (CP) from "user experience/tools" (CMS)
- VM cannot be compromised by the operation of any other VM
	- private secure and reliable computing environment for its users

## Control Program
General multiprogramming system that uses virtual machines to organize independent job streams
- Each VM is identified by an entry in the CP directory
- basically the *hypervisor*:
	- created illusion of private CPU(s), memory, disks, and devices for every user
	- S/370's hardware *Dynamic Address Translation (DAT)* to map guest physical memory to real physical memory
	- Trapped privileged instructions (I/O) and emulated their effects
	- Scheduled multiple VMs concurrently, switching context between them'

- **Privileged instruction trapping**
	- Any s/370 privileged instruction caused a trap (exception), and CP emulated its effect safely

- **Device virtualization**  
	Virtual devices mapped to either:
	- real hardware (dedicated), or
	- spool files (simulated card reader/printer/tape).

- **Scheduler & dispatcher**  
    CP’s scheduler gave each VM CPU time slices, switching among them.
    
- **Shared disks and communication**  
    CP allowed controlled sharing via “minidisks” (sub-volumes of real disks) and message passing.
    
**Key feature of CP/CMS design**: *independence of each virtual machines*
- all connections between VMs are explicitly defined and controlled by CP

## Conversational Monitor System 
Disk-file-oriented OS to support personal use of a dedicated computer
- *Guest operating system* to run in side VM