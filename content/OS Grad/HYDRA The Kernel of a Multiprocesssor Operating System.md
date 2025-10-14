---
date: 2025-10-05
tags: 
---
## Questions
Q: How is a Hydra procedure different from the procedures we are familiar with in a typical language and runtime environment?

## Overview
- Developed for **C.mmp**, the _Carnegie-Mellon Multi-Mini-Processor_ (16 PDP-11s, shared 32 MB core).
- Represents an early attempt at a **kernel-based OS**—a minimal core of universal mechanisms from which different operating environments could be built.
- Primary design theme: **separate mechanism from policy** → the kernel provides primitives for protection, object management, and process control; higher-level systems define their own policies.
	- No built-in notion of priority, fairness or preemption
	- kernel gives generic tools

## Context and Goals
### Hardware environment
- **C.mmp architecture**:
    - Up to 16 independent PDP-11 processors.
    - Shared memory via a crossbar switch.
    - Each CPU → private memory, I/O devices, local disk.
    - Relocation hardware → virtual → physical mapping.
    - Global clock → unique name generation + time base.

## Introduction
Goals:
 1. To provide an environment for effective utilization of the hardware resources
 2. To facilitate the construction of such environments

## Design Philosophy
General mindset:
- "universal applicability" - extensible/modular
- "absolute reliability" - reliable primitives
Collection of basic programs required in OS called Kernel or nucleus 
- Specifically:
	- Multiprocessor environment
	- Separation of mechanism and policy - for flexibility
	- Integration of the design with implementation methodology - separation of interface and logic
	- Rejection of strict hierarchical layering for flexibility
	- Protection
	- Reliability
- separates mechanism and policy - allows multiple OSes to coexist

**What does an OS is or does? according to paper**
Two views:
- an operating system defines an "abstract machine" by providing facilities, or *resources*, which are more convenient than those provided by the "bare" hardware
- an operating system allocates (hard-ware) *resources* in such a way to most effectively utilize them
Both put emphasis on the central role of *resources* both physical and abstract

The mechanisms provided by the HYDRA kernel are all intended to support the abstracted notion of a resource(incarnations of a resource are called *objects*) - EVERYTHING IS AN OBJECT
- Object = encapsulated resource (state + behavior)
- Mechanisms like creation and representation of new *types* of resources and operations defined on them
- as well as protected access to instances of one or more resources within controlled execution domains
- controlled passing of both control and resources between execution domains

Three key object types provided by the kernel:
- procedure
- LNS
- Process
Used to create and manipulate an execution environment
## Execution Environment and Core Primitives
Hydra’s execution is built around three object types:

| Object Type                | Purpose                                                                                                                                                                                                                                                     |
| -------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Procedure**              | Code + static capabilities (list of objects it may access). Acts like a protected subroutine.                                                                                                                                                               |
| **LNS (Local Name Space)** | Environment object created when a procedure is invoked → holds actual capabilities and parameter bindings.                                                                                                                                                  |
| **Process**                | Dynamic execution thread = stack of LNSs (created by procedure calls).<br>- Each procedure call creates its own LNS with its own parameter bindings and capabilities<br>- Stack of LNSs is like a call stack but for both execution state and access rights |
|                            |                                                                                                                                                                                                                                                             |
