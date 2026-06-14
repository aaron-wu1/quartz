---
date: 2025-10-25
tags:
---
source: https://arxiv.org/abs/2402.01869
## Summary
The paper introduces InferCept, an efficient intercept support for augmented LLMs. LLMs are increasingly augmented with external tools that pause the LLM's decoding during inference. When that happens an LLM has three options: discard the context, preserve the context, or swap the context to CPU. Each of these options has GPU time and memory tradeoffs and InferCept is a system that is able to dynamically choose which option to take to minimize total GPU memory waste while maintaining throughput. It also improves the individual options to reduce and eliminate their memory waste.

## Questions
1. What are the three ways of dealing with KV cache when a model calls an API?

The three ways are discard, preserve, and swap. Discard drops the KV cache before relegating the task to the augmenting entity which requires recomputation afterwards. Preserve keeps the KV cache but by keeping the cache it increases memory usage and hence throughput. Swap moves the KV cache to the CPU but the limited GPU-CPU bandwidth could bottleneck the process.

2. Why does InferCept consider running requests that are not currently calling tools when calculating GPU memory waste?

InferCept considers running requests because when you discard the KV cache, it stalls the other running requests in the batch when you need to recompute the interrupted request. That means the other running requests are effectively idle and wasting time but still in memory. InferCept avoids the full stall but chunking the recomputation step to lower the GPU memory waste.

## Motivation
- LLMs are increasing augmented with tools like calculators, retrievers, or image generators
- During inference, these interaction **pause the LLM's decoding** (waiting for tool result) causing **repeated recomputation when resumed**
	- tool request can depend on human events (eg. waiting on human response)
- Current systems like **vLLM** treat each pause as a new request, wasting up to **40% of total compute time** recomputing already-processed tokens.

## Key Problem
When an LLM pauses mid-generation (for tool) has three options:
- *Discard*: drop old context, losing KV cache -> relegate task to augmenting entity -> recomputation overhead 
- *Preserve*: keep KV cache in GPU memory (alternative to Discard) -> memory waste, increased throughput
- *Swap*: Move context to CPU -> slow due to bandwidth limits
Each option wastes either GPU time or memory


## INFERCEPT's core idea
*min-waste interception* - dynamically choose among *discard*, *preserve*, or *swap* to **minimize total GPU memory waste** while maintaining throughput

It achieves this via:
1. **Waste models** for all three strategies.  
    Example:$$Waste_{Preserve​}=T_{INT}​×C_i​×M$$
    (intercept duration × context size × per-token memory)
2. **Dynamic scheduling** using these waste estimates.
3. **Optimized recomputation and swapping:**
    - **Swap pipelining:** overlap GPU–CPU transfers with layer-forward passes.
    - **Swap chunking:** split context swaps into chunks that fit the GPU–CPU link budget.
    - **Recomputation chunking:** overlap partial recomputation with decoding to balance compute/memory

## Scheduling Algorithm
At each iteration:
- Compute per-request waste using equations (1)–(5).
- Sort intercepted requests by potential waste.
- Assign a **swap budget** to the most wasteful ones.
- For others, choose **preserve or discard** adaptively.
- Resume swapped/discarded requests using **FCFS fairness** while ensuring GPU saturation



