---
date: 2025-10-08
tags: 
---
## Goals
- Re-examine the design decisions and shortcomings of existing systems and software stacks
	- wide-spread security vulnerabilities
	- unexpected interactions among applications
	- failures caused by errant extensions
	- lack of robustness
- New software architecture based on software isolation of process
	- using lang, Sing# for verifiable, first-class support for OS communication primitives
- What would software platform look like if it designed from scratch with the primary goal of improved dependability and trustworthiness

## Strategy
- Pervasive use of safe programming languages
- Use of sound program verification tools
- Improved system architecture stops the propagation of runtime errors

## Architectural foundation
Three architectural features
- software-isolated processes (SIP)
	- environment for program execution to be protected from external interference
	- SIPs do not share data, all communications occurs through exchange of *messages* over message-passing conduits called *channels*
	- Singularity adds the rigor of statically verifiable *contracts*
	- SIPs access primitive functions (eg. send and receive messages) through an Application Binary Interface (ABI) to the kernel
	- **Closed object spaces** - a linear type system and a special area of memory known as the *exchange heap* allows lightweight exchange of even very large amounts of data, but no sharing
- contract-based channels
	- fast, verifiable message-based communication between processes
	- *contract* - specifies the messages and protocol for communication across all channels of a given type
- manifest-based programs
	- code runs within software-isolated processes and specify its verifiable behavioral properties

## Software-Isolated Processes
- SIPs rely on programming language type and memory safety for isolation, instead of memory management hardware. Through a combination of static verification and runtime checks, Singularity verifies that user code in a SIP cannot access memory regions outside the SIP
- SIP can be created without page tables or flushing TLBs
	- TLBs  is a memory [cache](https://en.wikipedia.org/wiki/CPU_cache "CPU cache") that stores the recent translations of [virtual memory](https://en.wikipedia.org/wiki/Virtual_memory "Virtual memory") [addresses](https://en.wikipedia.org/wiki/Memory_address "Memory address") to [physical memory](https://en.wikipedia.org/wiki/Physical_memory "Physical memory") addresses

## Contract-Based Channels
- channel is a bi-directional message conduit with exactly two endpoints
- Provides a lossless, in-order message queue
- **Channel contracts are declared in the Sing# language**
	- A contract consists of message declarations and a set of named protocol states
	- Message declarations state the number and types of arguments for each message and an optional message direction
		-  interface? thinking GRPC and proto files
- Singularity has static checking

## Manifest-based Programs (MBP)
- A MBP is a program defined by a static *manifest*
	- Constraints:
		- no code is allowed to run on a Singularity system without a manifest
		- To start execution, a user invokes a manifest, not an executable file as in other systems
	- A manifest describes an MBP’s code resources, its required system resources, its desired capabilities, and its dependencies on other programs.
		- a machine-checkable, declarative expression of the MBP's expected behavior

## Singularity Kernel
- Provides base abstractions of: software-isolated processes, contract-based channels, and manifest-based programs.
	- most code is type-safe except for garbage collection which is 48% of unsafe
- **ABI**
	- access to kernel primitives such as send and recv messages