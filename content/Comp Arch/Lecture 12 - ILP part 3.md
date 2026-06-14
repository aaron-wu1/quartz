---
date: 2025-11-04
tags:
- computer-architecture
- performance
- concurrency
title: Lecture 12 - ILP part 3
---

## ILP in real code

## Exposing More ILP
- Original motivated by VLIW, but useful for *superscalar/ooo/speculative* processors too
- Software Techniques
	- **Software Pipelining**
	- **Trace Scheduling**
	- **(Other techniques that strive to create big basic blocks)**
- Hardware/Software Techniques (in use)
	- **Predicted execution**
		- Trading off branch hazards and control flow constraints for increased instruction bandwidth
	- Simultaneous Multithreading
- Other hardware/sw techniques (not in use)
	- Value prediction

### Compiler support for ILP - Software Pipelining
- **Observation**: If iterations from loops are independent, then can get ILP by taking instructions from different iterations
- Problems with loop unrolling: not regular (overlaps some iterations but not others), inflates code, quickly exhausts all registers
- **Software pipelining: reorganizes loops so that each iteration (of the new loop) made from instructions chosen from different iterations of the original loop**
- **Goal**: get the effect of massive loop unrolling without the massive code unrolling.

### Compiler support for ILP - Trace Scheduling
... TODO

### HW Support for more ILP - Predication
- Avoid branch prediction by turning branches into *conditionally executed instructions* (aka *predicated* instructions)
	- New instructions
- Drawbacks to conditional instruction
	- still takes a click cycle and alu even if "annulled"
	- stall if condition evaluated late
	- requires more operands! often only available as a *conditional move*
- Advantages
	- eliminate prediction, misprediction
	- longer basic blocks
- Critical technology for VLIW, SW pipelining.
	- Why? 
	- TODO

### Value Prediction
- Once we...
	- Eliminate false dependences through register renaming
	- Have large instruction windows (instruction queues, ROBs, etc.)
- Then our primary problem becomes true dependencies
	- Some of them large (long latencies)
- Can we execute faster than true dependencies allow
-