---
date: 2025-10-11
tags:
- computer-architecture
title: Lecture 5 - Pipeline Cont.
---

## Pipeline example
![[Screenshot 2025-10-11 at 2.40.09 PM.png]]

## Control Hazards
- Result from *branch* or *control dependencies*
- Instructions are not only dependent on instructions that produce their operands, but also on all previous control flow (branch, jump) instructions that lead to that instruction
### Branch Hazards
 - Impact: ![[Screenshot 2025-10-11 at 2.53.33 PM.png]]
### Four Simple Branch Hazard Alts
- Stall until direction clear (branch resolved)
- predict branch not taken
- predict branch taken
- delayed branch slot:![[Screenshot 2025-10-11 at 2.56.25 PM.png]]
	- One instruction after the branch is always executed - delay branch for 1 instruction
		- effects of branch is seen after that instruction
		- to not need to stall and fill utilization
	- Where to get instructions to fill branch delay slot?
		- Before branch instruction - not dependent on branch
		- From the target addresses (within branch): only valuable when branch taken
		- From fall through (not take branch): only valuable when branch not taken
		- Cancelling branches allow more slots to be filled (too complex)
	- **Compiler effectiveness for single branch delay slot**
		- now compiler is responsible for scheduling this
		- fills about 60% of branch delay slots
		- about 80% of instructions executed in branch delay slots useful in computation
		- about 50% (60% x80%) of slots usefully filled
			- has to have instruction in delay slot because in ISA (typically ended up with NOPs)
	- **Why it's bad**
		- worked okay if the branch hazard is one cycle
		- now branch hazards is multiple cycles and multi scalar machines
		- still would need to add NOP to the delay slot

### Predict Not Taken
By default the pipeline already does that, if pipeline has no idea what a branch is and treats it like any instruction
### Delay Branch
What can you put in branch delay slot?![[Screenshot 2025-10-11 at 4.20.38 PM.png]]
add R2, R5, R8 at label (target)
- R2 is a dead register, not being used

### Static Branch Prediction
- Form of branch prediction that makes the same decision for every branch
	- typically done at compile time (note: dynamic branch prediction during program execution)
- "Predict not taken" is a form
- Other types too...
- Typically requires some ISA support (eg branch_likely)
- static bp done by software, dynamic bp done in hardware
- How to make static branch predictions?
- Compilers sometimes do static BP even in the absence of ILP (instruction-level parallelism) support for it. This is because static branch prediction enables
	- more effective code scheduling around hazards
	- more effective use of delay slots
	- (more effective instruction scheduling in general)
- **fundamental flaw**
	- if you don't have a branch that is really biased it's not going to do well
	- it's capped by the max of taken or not taken count

## Exceptions and Interrupts
- Transfer of control flow (to an exception handler) without an explicit branch or jump
- often unpredictable
- examples:
	- I/O device request
	- OS system call
	- arithmetic overflow/underflow
	- FP error 
	- Page fault
	- ... [[OS Crash Course#Context Switch and Timer Interrupts (Fairness)]]

## Classes of Exceptions
- synchronous vs. asynchronous
- user-initiated vs coerced
- user maskable vs nonmaskable
- within instruction vs between instructions
- resume vs terminate

## Handling Multicycle Operations
- unrealistic to expect all operations take same time to execute
- eg
	- FP, some memory operations will take longer 
- multiple execution pipeliens
- **introduces new problems**
	- structural hazards
		- divide unit 
		- WB stage
	- WAW hazards are possible
	- out-of-order completion (exceptions?)
	- WAR hazards still not possible


## Key Pipelining Points
- Pipeline improves throughput rather than latency
- Pipelining gets parallelism without replication
- $ET = IC * CPI * CT$
- Keeping the pipeline full is not easy
	- consider structural hazards, data hazards, control hazards
- Data Hazards require dependent instructions to wait for the producer instruction
	- most can be handled by forwarding (bypassing) with pipeline registers
	- sometimes stall is still required
- Control hazards require control-dependent (post-branch) instructions to wait for the branch to be resolved
	- Branch hazards can be reduced by early computation of:
		- condition and target
		- branch delay slots
		- branch prediction
- Data hazard and branch hazard reduction require complex compiler support
- Exceptions are hard
- variable-length instructions introduce structural hazards, WAW hazards, and more RAW hazards