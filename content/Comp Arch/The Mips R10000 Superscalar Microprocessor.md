---
date: 2025-10-25
tags:
---
## Background
R10000 was MIP's attempt to compete with mid-1990s high-end CPUs

It targeted high performance servers and workstations:
- Superscalar execution
- Out-of-order issue and completion
- Large on-chip caches
- Scalability to multiprocessor systems

## Design Rationale
Memory bandwidth and latency limit performance

MIPS implement:
- register mapping
- nonblocking caches

If an instruction misses in the cache, it must wait for its operand to be refilled, but other instructions can continue out of order.
- Increases memory use but reduces effective latency
- "nonblocking" because cache refils do not block subsequent accesses to other cache lines

## Pipeline Overview
*Four-way superscalar* - up to four instructions can be issued per cycle

Three broad phases:
- *In-order front end* - Fetch -> Decode -> register rename; fills instruction queues
- *Out-of-order execution* - Integer, FP, load/store units issue dynamically when operands are ready
- *in-order commit* - Results retire in program order (to preserve precise exceptions)

## Dynamic Scheduling
- *Instruction queues* - for integer, FP, and load/store ops
- *Register renaming* - to remove false dependencies (WAR/WAW)
- *Scoreboarding* - logic that tracks operand readiness
  
It behaves like [[Comp Arch/Tomasulo’s algorithm]]:  
→ rename → issue when ready → execute → writeback → commit.

### Software vs Hardware Dynamic Reordering
- **Compiler** → helps arrange code to use the cache well (especially for predictable arrays).
- **Hardware** → dynamically handles unpredictable stalls and overlaps misses via nonblocking caches.
  
Compilers can reorder some instructions (called _static scheduling_), but:
- They can’t predict which specific memory access will miss the cache.
- Integer programs with pointer-heavy or unpredictable accesses (like linked lists) make it even harder.

## What is the problem this paper is trying to solve?
MIPS redesigned to support out-of-order scheduling to lower pipeline stalls. It also had non-blocking caches to prevent wasting memory bandwidth so a miss doesn't block the access to a cache. It was also a four-way superscalar which worked with out-of-order scheduling to further increase parallelism.

## What is the intuition behind their solution?

The R10000 includes hardware that dynamically reorders instruction execution based on operand availability. Whenever cache misses delay instructions, the hardware immediately adapts. The processor looks ahead up to 32 instructions to find possible parallelism.

## What does this paper do well?

It's goes in depth about how they implemented the hardware with a lot of detail. I also like how they had a design rationale section to motivate their design choices.

## What don't they do well?

What they don't do well is providing background context and evaluation. For context, it's not clear if out-of-order superscalar processors are novel at the time and what the market looks like for them. For evaluation, I found the performance section a bit weak. It would be more informative if there was some relative performance metrics. 

## If you had written this paper, what do you think would be your next paper/research idea?

I would run an overview of all the other architectures in the market and do a comprehensive overview to evaluate tradeoffs between them.