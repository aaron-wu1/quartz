---
date: 2025-10-07
tags: 
---
source: [Orca: A Distributed Serving System for Transformer-Based Generative Models (OSDI'22)](https://www.usenix.org/conference/osdi22/presentation/yu)

## Summary
This paper introduces Orca, a distributed serving system for transformer based generative models. Orca contains two key new features: iteration-level scheduling and selective batching. Previous systems had request-level scheduling which meant that whole batches needed to be ran through execution engine before the inference receives a response. With iteration-level scheduling, after each iteration a response is passed back. Selective batching helps keep batches as filled as possible by batching operations that can handle mismatched tensors and split up the batch during the attention op, allowing for more flexibility in batch selection.

Questions:
**

1. List one benefit and one drawback of iterative scheduling (as compared to request-level scheduling).
Iterative scheduling helps mitigate longer queries in a batch from blocking shorter ones communicating with the inference server after every iteration. This is in relation to request-level scheduling which communicates to the inference server only after the batch is complete. The drawback of iterative scheduling is the overhead of additional communications. If the sent queries were closer to the same size then the benefit would be more negligible.  


2. How would you decide the batch size (number of request) for an LLM inference system you are building? List all the factors you would consider.



## Background
### Inference
- Multi-iteration characteristic
	- generate one token at a time
- Initiation phase (1st iteration)
	- process all input tokens at once
- Increment phase (2nd-last iterations)
	- process a single token generated from the previous iteration
	- use attention keys and values of all previous tokens
- Save attention keys and values for following iterations to avoid recomputation

## System Components for Inference
![[Screenshot 2025-10-07 at 9.08.33 PM.png]]
Inference server schedules request
![[Screenshot 2025-10-07 at 9.09.03 PM.png]]
Request is passed to execution engine
![[Screenshot 2025-10-07 at 9.09.46 PM.png]]
Engine output is passed to server
![[Screenshot 2025-10-07 at 9.10.16 PM.png]]
### Problems 1: Request-level scheduling
Execution Engine only sends response to inference server when batch is completed
x2 is stalled until batch is done, waiting on x1![[Screenshot 2025-10-07 at 9.11.31 PM.png]]
x3 is blocked until batch is done
![[Screenshot 2025-10-07 at 9.12.55 PM.png]]
**Problem inference server and execution engine only interact once a batch is done**

### Their solution is iteration-level scheduling
x1 and x2 queued in pool
![[Screenshot 2025-10-07 at 9.14.08 PM.png]]
new request x3
![[Screenshot 2025-10-07 at 9.14.30 PM.png]]
x1 and x2 return to pool and x3 is added
![[Screenshot 2025-10-07 at 9.15.40 PM.png]]
x1, x2, x3 are all sent to execution engine
![[Screenshot 2025-10-07 at 9.16.06 PM.png]]
suppose new request x4, x5
![[Screenshot 2025-10-07 at 9.16.55 PM.png]]
x2 is done and sent to client
![[Screenshot 2025-10-07 at 9.17.18 PM.png]]
now process x4
![[Screenshot 2025-10-07 at 9.17.39 PM.png]]

With iteration-level scheduling, we can handle early-finished or late-arrived requests much more efficiently. 
- Parallels to multi-cycle processors in comp arch where instructions are broken down into stages to lower cycle time  (here it's by iterations to lower batch latency)

### Problem 2: Batching
![[Screenshot 2025-10-07 at 9.25.40 PM.png]]

Batching is only applicable when
- requests are in the same phase (they are all in the initiation phase or all in the increment phase)
- requests have the same length

![[Screenshot 2025-10-07 at 9.26.35 PM.png]]

Different phases
![[Screenshot 2025-10-07 at 9.27.33 PM.png]]
**CANNOT COALESCE TENSORS OF DIFFERENT SHAPES**

Different lengths
![[Screenshot 2025-10-07 at 9.28.24 PM.png]]
**Attention op doesn't have identically-shaped tensors, no batching**

### Solution: Selective batching
![[Screenshot 2025-10-07 at 9.30.05 PM.png]]
![[Screenshot 2025-10-07 at 9.30.22 PM.png]]

### Orca
Distributing serving system
#### Architecture
![[Screenshot 2025-10-07 at 9.31.31 PM.png]]
#### Execution Engine
![[Screenshot 2025-10-07 at 9.31.48 PM.png]]
Can horizontally or vertically partition and distribute across gpus
Example partitioned system:![[Screenshot 2025-10-07 at 9.32.39 PM.png]]
#### Scheduling
- FCFS 



## what might be important?
- what did the authors think that was important?
	- new scheduling mechanism called **iteration-level scheduling** that schedules execution at the granularity of iteration (instead of request) where the scheduler invokes the execution engine to run only a single iteration of the model on the batch
	-  In addition, to apply batching and iteration-level scheduling to a Transformer model at the same time, we suggest selective batching, which applies batching only to a selected set of operations.
- what is different and new from prior work?
	- generating next token in an autoregressive manner is difficult for existing system for inference due to their inflexible scheduling mechanism that cannot change the current batch of requests being proccesed
	- cost of 400 GPT3 175 B instances = $190.6M/year
		- down with Orca to $5.7M / year
- do i see these concepts in use today? or why weren't these ideas adopted?
- is there anything generalizable?
	- ideas that you can apply in a different domain 
		- applicable to any transformer based model
	- protection paper example is very generalizable
- new abstraction, algorithms, techniques, frameworks?
	- generalizable typically
- identify a new problem space
- what is unlikely to be important?
- specific example
- specific \#s in evaluation
- implementation
- proofs
- discussion section