---
date: 2025-11-01
tags:
- computer-architecture
title: Branch Predictors and Dynamic Scheduling
---

## Types
### Correlating Branch Predictors
**Correlating predictors / two-level predictors** - branch predictors that use the behavior of other branches to make a prediction

- Predictors can have a size of *n-bits* or it's span of possibilities
### Tournament Predictors
Using multiple predictors and combining them with a selector
- Usually one based on global information and one based on local information
## Overcoming Data Hazards with Dynamic Scheduling
**Issue**:
- For data dependencies that cannot be hidden, the hardware needs to stall the pipeline starting with the instruction that uses the result
- No new instruction can be fetched or issued until the dependence is cleard
**Solution** - *dynamic scheduling*
- Hardware rearranges the instruction execution to reduce the stalls while maintaining data flow and exception behavior, promotes *out-of-order execution* which implies *out-of-order completion*
	- exceptions: divide by zero, page faults, etc
- **Advantages**
	- Allows code that was compile with one pipeline in mind to run efficiently on a different pipeline
	- Enables handling some cases where dependencies are unknown at compile time
	- Allows processor to tolerate unpredictable delays like cache misses
**Out-of-order execution** - introduces WAR (*antidependence*) and WAW hazards which don't exist in five-stage int pipeline and in-order floating-point pipeline.

| Data Hazard | Name              | Alt       | Scalar pipelines |
| ----------- | ----------------- | --------- | ---------------- |
| RAW         | True dep          |           | can occur        |
| WAR         | antidependence    | false dep | cannot occur     |
| WAW         | output dependence | false dep | cannot occur     |

### Scoreboarding
Technique for allowing instructions to execute out of order when there are sufficient resources and no data deps.
- stall one instruction for another to run
### Tomasulo's Approach
- Tracks when operands for instructions are available to minimize RAW hazards
- Introduces *register renaming* in HW to minimize WAW and WAR hazards
	- provided by *reservation stations* - which buffer the operands of instructions waiting to issue
	- can be more reservation stations than real registers -> eliminate hazard arising from name dependencies that can't be eliminated by a compiler
- *common data bus* (CBD)
#### Steps
1. *Issue*
	- Get the next instruction from the head of instruction queue
2. *Execute*
	- If one or more of the operands is not yet available, monitor the common data bus while waiting for it to be computed
	- When an operand becomes available, it is placed into any reservation station awaiting it.
	- When all operands are available, the operation can be executed at the corresponding functional unit
3. *Write result*
	- When the result is available, write it on the CDB and from there into the registers and into any reservation stations (including store buffers) waiting for this result

#### Data structures
- *tag field* - denotes which reservation station or which load buffers

Each reservation station has seven fields:
- Op - Operation to perform on source operands S1 and S2
- Qj, Qk - The reservation stations that will produce the corresponding source operand; a value of **zero** indicates that the source operand is already available in Vj or Vk or is unnecessary
	- holds a tag
- Vj, Vk - The value of the source operands.
	- Note that only one of the V fields or the Q field is valid for each operand. For loads the Vk field is used to hold the offset field.
- A - used to hold information for the memory address calculation for a load or store
	- initially the imeediate field of the instruction is stored here
	- after the address calculation, the effective addr is stored here
- Busy - indicates that this reservation station and its accompanying functional unit are occupied.
The register file has a field, Qi:
- Qi - The number of the reservation station that contains the operation whose result should be stored into this register. If the value of Qi is blank (or 0), no currently active instruction is computing a result destined for this register, meaning that the value is simply the register contents.