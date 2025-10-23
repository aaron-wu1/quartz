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
| **LNS (Local Name Space)** | Environment object created when a procedure is invoked → holds actual capabilities and parameter bindings.<br>- acts a controlled scope for procedures                                                                                                      |
| **Process**                | Dynamic execution thread = stack of LNSs (created by procedure calls).<br>- Each procedure call creates its own LNS with its own parameter bindings and capabilities<br>- Stack of LNSs is like a call stack but for both execution state and access rights |
|                            |                                                                                                                                                                                                                                                             |

## Protection model
### Capability: rights and types
Every _capability_ in Hydra isn’t just “a pointer” — it’s a triple:

`(object ID, type, rights)`

So a capability says:
- **what** object it refers to,
- **what kind of thing** that object is (e.g., segment, procedure, file),
- and **what you’re allowed to do** (read, write, invoke, walk, etc.).
Hydra checks both **type safety** and **right safety** whenever you use a capability.

### Amplification: safe rights passing
Sometimes, a procedure needs _extra rights_ to do its job (like an OS utility needing admin privileges).  
Hydra’s solution is **amplification**.
- A **procedure’s template** can specify certain **amplifiers**, which let that procedure temporarily **extend its rights** — but _only for specific capabilities_ and _only inside that call_.
- The key idea: the caller doesn’t gain those rights, only the callee while it runs.
```
Procedure B: EditFile
template allows "write" amplification for files owned by system
```
When invoked, Hydra gives B _amplified_ write access — but that privilege disappears when B returns.

That means _least privilege_ is baked into the call structure.

###  Type checking
When a call is made:
1. Hydra checks that the _types_ of the passed capabilities match the template.
2. It verifies the caller’s rights are sufficient (and applies amplification if permitted).
3. Then it builds the new LNS and runs the code.
If anything doesn’t match, the call is rejected.


### Example
- IF you own a *capability* with high rights, you permanently gain those rights, like a master key.
- A *template* can amplify rights even the caller doesn't have the capability or rights. But it only extends to that singular callee or within the call.

### Overarching design principle
HYDRA lets programmers build their own protected subsystems safely (eg. file systems, window manager). **If only the kernel had privileges then all those subsystems would have to live inside the kernel**. This makes the kernel small and the user code can do privileged work safely isolated.

“**Mechanism in the kernel; policy in user space.**”
- Mechanism - implantation of logic to handle rights, primitives to utilize resources
- Policy - subsystems themselves determines how those mechanism are used

