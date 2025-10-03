---
date: 2025-10-02
tags: 
---
## The Instruction Set Architecture
![[Screenshot 2025-10-02 at 2.04.20 PM.png]]

## Crafting an ISA
- ISA design involves dealing in an extremely rare resource
	- instruction bits! (size of instruction representation)
- Some things we want out of our ISA
	- completeness
		- are you able to specify everything you want to do
	- orthogonality
		- are you able to separate responsibilities and have them work together
	- regularity and simplicity
		- consistency
	- compactness
	- ease of programming
	- ease of implementation
## Key ISA Decisions
- Operations
	- how many?
	- which ones
- operands
	- how many?
	- location
	- types
	- how to specify?
- instruction format
	- size
	- how many formats?

## What enables performance in today's machines
- Parallelism!!
	- superscalar
		- multiple instructions running at once
	- pipelining
		- instructions split into stages by HW and ran parallel based on HW
	- multicore
	- multithreading

## Choice 1: Operand Location
- Accumulator
- Stack
- **Registers**
- **Memory**
- We can classify (historically) most machines into 4 types:
	- accumulator
		- machine with one register
	- stack
	- register-memory (most general)
	- load-store (arithmetic operations must have register operands)! -> RISC architecture
## Choice 1B: How Many Explicit Operands?
![[Screenshot 2025-10-02 at 2.16.32 PM.png]]
Load/store can't do both add and load in single instruction

![[Screenshot 2025-10-02 at 2.21.32 PM.png]]
Load/store -> need to get everything out of memory before using

## Choice 1: Tradeoffs
- Stack
	- cons: hard to do stuff in parallel because every instruction changes stack pointer
		- dependent on stack pointer for every instruction, serialized 
- Accumulator
	- pros: small register file
	- cons: hard to parallelize everything reads and writes from accumulator
- GPR
	- pros: can operate on directly on memory, faster
	- pros: parallelism, split on memory
- Load-store
	- ...
## Aside: Stack ISA
- 2 recent ones: WASM, Java byte code

## Choice 2: Addressing modes
How do we specify the operand we want? 
Different ways to defining an operand
![[Screenshot 2025-10-02 at 2.31.13 PM.png]]
 - Displacement 
	 - good for structures (defined object/schema whatever)
	 - only need one pointer loaded into a register to access the whole object because we know the offset off of the structure definition
### How many addressing modes are we actually using?
![[Screenshot 2025-10-02 at 2.36.24 PM.png]]
![[Screenshot 2025-10-02 at 2.37.06 PM.png]]
Conclusion 16 bits is usually enough. if not just use another instruction


## Choice 3: Instruction Format
![[Screenshot 2025-10-02 at 2.39.42 PM.png]]
- Tradeoffs
	- Variable/ hybrid: can't decode them in parallel, no random access

## Choice 4: Which Operations?
- Arithmetic
	- add, subtract, multiply, divide
- logical
	- and, or, shift left, shift right
- data transfer
	- load word, store word
- control flow

### Types of branches (control flow)
- conditional branch
	- hardest to handle, later in the pipeline to figure out
	- most common too
- jump
- procedure call
- procedure return
![[Screenshot 2025-10-02 at 2.44.35 PM.png]]

### Conditional Branch
- How do you specify the destination (target) of a branch/jump?
- How do we specify the condition of the branch?
**Branch Distance**
![[Screenshot 2025-10-02 at 2.46.11 PM.png]]
Most condition's destination are not too far (not too many bits) so the specification is typically an offset from the src

**Branch Condition**
![[Screenshot 2025-10-02 at 2.50.15 PM.png]]
Parallelism issue - dependency on condition

## The Customer is Always Right
- Compiler is the primary customer of ISA
- features the compiler doesn't use are waster
- register allocation is a huge contributor to performance
- compiler-writer's job is made easier when ISA has
	- regularity
	- primitives, not solutions
	- simple trade-offs
- summary ->simplicity over power

## Our desired ISA
- Registers, Load-store
- Addressing modes
	- immediate (8-16 bits)
	- displacement(12-16 bits)
	- register deferred (register indirect)
- support a reasonable number of operations
- don't use condition codes
- fixed instruction encoding/length for performance
- regularity (several general-purpose registers)

## MIPS ISA
- 32 64-bit general-purpose registers
	- R0 always equal zero
	- 32 FP registers
- immediate and displacement addressing modes
	- register deferred is a subset of displacement
- 32-bit fixed-length instruction encoding
- ![[Screenshot 2025-10-02 at 2.57.46 PM.png]]

## RISC-V ISA
![[Screenshot 2025-10-02 at 2.58.06 PM.png]]![[Screenshot 2025-10-02 at 2.58.11 PM.png]]

## RISC-V vs MIPS
- surprisingly similar. fixed a few flaws in early RISCs
- suport for bgt, blt, etc
- no branch delay slot
- 7-bit opcodes
- one format with larger immediate

## ARM vs MIPS
- ARM originally targeted at small embedded processors
	- Priorities: energy efficiency, small instruction footprint
- The most visible difference between ARM and all other RISC ISAs is that nearly all instructions can be conditionally executed (predicated)
	- ability to execute either path of the conditional 
		- although using executing both is not better than guessing
	- prediction is useful for performance

## RISC vs CISC
- MIPS and RISC-V are classic RISC architectures (as are SPARC, Alpha, PowerPC,…)
- RISC stands for Reduced Instruction Set Computer. RISC architectures are load-store, few formats, minimal instruction sets.
- They were in contrast to the 70s and 80s which proliferated **CISC** ISAs (VAX, Intel x86, various IBM), which were characterized by complex and comprehensive instruction sets, and complex instruction decoding.
- RISC architectures thrived not because they supported fewer operations, but because they **enabled parallelism**.

## Intel x86
- CISC architecture (does not parallelize or pipeline well)
- variable length instruction set architecture (1 byte to 15 bytes)
- has an instruction for  "find the matching words in two strings of arbitrary size"
- most instructions are two operand
	- Add eax, ebx => eax = eax + ebx
- **How do they compete with RISC ISAs?**
	- **Micro-ops!**
	- TODO readup

## MIPS
- Read on your own and get comfortable with instructions and formats

## Ongoing Research
### Evolution of On-chip Heterogeneity
Multiple different ISA multicore architectures
- uses best of different ISAs

###  Mobilizing the Micro-Ops
Exploiting Translated ISAs
...

## ISA Key Points
- Modern ISA’s typically sacrifice power and flexibility for regularity and simplicity; code density for parallelism and throughput.
- instruction bits are extremely limited, particularly in a fixed-length instruction format.
- Registers are critical to performance – we want lots of them, and few strings attached.
- Displacement addressing mode handles the vast majority of memory reference needs.
- There are a fair number of design choices even between similar (eg, RISC) ISAs