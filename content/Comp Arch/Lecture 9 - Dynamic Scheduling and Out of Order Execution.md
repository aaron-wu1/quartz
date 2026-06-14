---
date: 2025-10-26
tags:
- computer-architecture
- performance
title: Lecture 9 - Dynamic Scheduling and Out of Order Execution
---

## Dynamic Scheduling

![[Screenshot 2025-10-21 at 2.55.08 PM.png]]

- If ID stage remains in-order, then need a way for instructions to leave ID whether or not operands ready
- This requires storage for instructions waiting for operands
- We also need a way to signal when missing operands are ready
- And we need a way to put things back in order at the end of pipeline (exceptions, branch recovery, etc)

Somehow create some storage between ID and EX stages

### History
First machine CDC 6600 scoreboard
- Instruction storage added to each functional execution unit  
- Instructions issue to FU when no structural hazards, begin execution when dependences satisfied. Thus, instructions issued to different FUs can execute out of order.  
- “*scoreboard*” tracks RAW, WAR, WAW hazards, tells each instruction when to proceed. 
	- What the scoreboard tracks:
		1. Which **functional units** are busy
		2. Which **registers** are waiting for a value
		3. Which **instructions** are ready to issue or execute
	- How it works:
		- Each cycle, the scoreboard decides:
			- **Issue stage:** Can the instruction’s operands be read safely?
			- **Read stage:** Are operands ready?
			- **Execute stage:** Can the functional unit start?
			- **Write-back stage:** Can we safely write the result?
- No forwarding  
- No register renaming
**Tomasulo** (IBM 360/91) or *reservation stations*
**instruction Queue** (MIPS R10000, Alpha 21261)

## Tomasulo Algorithm
- **Goal**: High performance without special compilers
- Differences between IBM 360 and CDC 6600 ISA
	- IBM has only 2 register specifiers/instr vs 3 in CDC 6600
	- IBM has 4 FP registers vs 8 in CDC 6600
	- **implications?**
		- false dependencies all over the place
- **Features:**
	- Put instructions in **reservation stations** - control and inst/operand buffers
	- Register names in instructions replaced by pointers to reservation station buffer
		- Tomasulo => reservations stations as **operand storage**
	- Reservation stations replace registers names
	- **HW renaming of registers** to avoid WAR, WAW hazards
		- Tomasulo => each register read as soon as available. When possible, they are read at dispatch. If not, grabbed off the... TODO
	- Common Data Bus broadcasts results to all FUs
		- RS's (FU's), register file, etc responsible for *collecting own data off* CDB
	- Load and Store queues treated as FUs as well
### Reservation Station Components
- Stores instruction/operand buffers associated with function units
- Instruction schedule themselves
- ![[Screenshot 2025-10-26 at 1.56.49 PM.png]]
- Need another table - Register result status
	- indicates which functional unit will write each register, if one exists. 
		- blank when there are no pending instructions that will write that registers
	- used so the reg file knows which results to read and so that decoded instructions know where to find their operands
### Three Stages of Tomasulo Algo
1. *Dispatch* (issue in book) - get instruction from FP instr queue
	- If reservation station free, the IQ dispatches instr & sends operands (renames registers)
2. *Execution* - operate on operands (EX)
	- When both operands ready and functional unit free then execute ("issue to the execution unit")
	- if not ready, watch CDB for result
3. *Write result* - finish execution (WB)
	- Write on Common Data Bus to all waiting units;
	- Mark reservation station available
### Tomasulo Summary
- prevents register file as a bottleneck
- avoids WAR, WAW hazards of scoreboard
	- register renaming as a side effect (logical register names replaced by reservation station pointers)
- *dynamic scheduling* of instructions
- limited to basic blocks

## Speculative Tomasulo Algorithm
### HW support for more ILP
- *Speculation* - allow an instruction to issue that is dependent on branch, *without* any consequences (including exceptions)
	- if branch is predicted incorrectly ("have HW undo")
- typically combined with dynamic scheduling
- Tomasulo: allow *speculative* bypassing of results
	- when instruction no longer is speculative, write results (instruction *commit* or instruction *retire*)
		- 100% sure that you don't have to HW undo the instruction
	- execute out-of-order but commit in order
	- requires some kind of intermediate storage that is ordered

### HW speculative Execution
![[Screenshot 2025-10-26 at 2.45.57 PM.png]]
Need HW buffer for results of uncommitted instructions: *reorder buffer*
- Reorder buffer can be operand source
- Once operand commits, result is found in register
- 3 fields: inst. type, destination, value
- Use *reorder buffer index* instead of reservation station as "name" of result
- As a result, it's easy to undo speculated instructions on mispredicted branches or on exceptions
### 4 steps of Speculative Tomasulo Algorithm
(ADDED commit)
1. *Dispatch* (issue in book) - get instruction from FP instr queue
	- If reservation station free, the IQ dispatches instr & sends operands (renames registers)
2. *Execution* - operate on operands (EX)
	- When both operands ready and functional unit free then execute ("issue to the execution unit")
	- if not ready, watch CDB for result
3. *Write result* - finish execution (WB)
	- Write on Common Data Bus to all waiting units;
	- Mark reservation station available
4. *Commit* - update register with reorder result
	- When instruction at head of reorder buffer & result present, update register with result (or store to memory) and remove instruction from reorder buffer.

### Flushing
- Assuming some checkpointing of the register result status table after branch mispredict
	- that can be in the re-order buffer

### Summary of Speculative Execution
- the **re-order buffer** and **in-order commit** allow us to flush the speculative instructions from the machine when a misprediction is discovered
- ROB is another possible source of operands
- ROB can provide *precise exceptions* in an out-of-order machine
- ROB allows us to *ignore exceptions* on speculative code