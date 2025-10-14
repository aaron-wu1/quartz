---
date: 2025-10-12
tags: 
---
## Instruction-level parallelism (ILP)
Usage of pipelining to over the execution of instructions and improve performance
**Two largely separable approaches to exploit ILP**
- Hardware to help discover and exploit the parallelism dynamically
- Software to find parallelism statically at compile time
Processors in desktops and servers currently dominate using the dynamic, HW based approach. Personal mobile devices (PMD) require more enery efficiency and designers exploit lower levels of instruction-level parallelism. So in 2011, most processors use static approaches (ARM Cortex-A8).

### Pipeline CPI
$Pipeline\ CPI = Ideal\ pipeline\ CPI + Structural\ stalls + Data\ hazard\ stalls + Control\ stalls$
*ideal pipeline CPI* is the measure of the maximum performance attainable by the implementation

### What is loop-level parallelism
parallelism among iteration of loops, most common way to increase the ILP
```
for (i=0; i<=999; i=i+1)
	x[i] = x[i] + y[i]
```

Every iteration of the loop can overlap with any other iteration.

An alternative method is SIMD (Single Instruction, Multiple Data) in both vector processors and GPUs

### Name Dependencies
A name dependence occurs when two instructions use the same register or memory location, called a name, but there is no flow of data between the instructions associated with that name. 
Two types:
- *antidependence* between instruction i and instruction j occurs when instruction j writes a register or memory location that instruction i reads. The original ordering must be preserved to ensure that i reads the correct value.
- *output dependence* occurs when instruction i and instruction j write the same register or memory location. The ordering between the instructions must be preserved to ensure that the value finally written corresponds to instruction j.

