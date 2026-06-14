---
date: 2025-10-01
tags:
- computer-architecture
- concurrency
- performance
- caching
title: Computer Architecture A Quantitative Approach
---

## Fundamentals of Quantitative Design and Analysis

### Classes of Computers
#### Classes of Parallelism and Parallel Architectures
1. Data-Level Parallelism (DLP) arises because there are many data items that can be operated on at the same time
2. Task-Level Parallelism (TLP) arises because tasks of work are created that can operate independently and largely in parallel

Computer hardware can exploit this application parallelism in 4 ways:
1. Instruction-Level Parallelism - data-level parallelism with compiler help
2. Vector Architectures and Graphic Processor Units (GPUs) - single instruction to a collection of data in parallel
3. Thread-Level Parallelism - either data-level or task-level in tightly coupled hw models that allows for interactions between parallel thread
4. Request-Level Parallelism - parallelism among largely decoupled tasks specified by the programmer or the operating system.

### Defining Computer Architecture
Originally just ISA but it's more than just that now... architecture covers ISA, organization or microarchitecture, and hardware

**ISA**
refer to the actual programmer-visible instruction set

**Designing the Organization and HW to Meet Goals and Functional Requirements**
- *Organization* - includes the high-level aspects of a computer's design
	- memory system
	- memory interconnect
	- design of internal processor or CPU
- *microarchitecture* is also used instead of organization
- ex: AMD Opteron and Intel Core i7 use x86 instruction set but have different pipeline and cache organizations. Same ISA, diff organization
### Measuring, Reporting, and Summarizing Performance