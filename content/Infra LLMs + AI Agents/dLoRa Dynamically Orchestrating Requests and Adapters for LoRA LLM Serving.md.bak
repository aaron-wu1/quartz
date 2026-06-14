---
date: 2025-10-23
tags:
---
source: https://www.usenix.org/conference/osdi24/presentation/wu-bingyang

## Summary

The paper presents dLoRA for efficiently serving LLMs fine-tuned with LoRA adapters. Its novelty is that dynamically merge and unmerge adapters are adjusted based on throughput to better increase throughput and GPU utilization. It does it with three key parts: dynamic batching requests of the same adapter, adaptive threshold tuning based on merge/unmerge throughputs, and preventing starvation.

## Questions
1. What is the pros and cons of merged and unmerged adapter in LoRA inference?

The pros for merged are that it's faster due to the adapter weights merged with the base model. The cons for merged is high memory footprint and low GPU utilization. The pros for unmerged is when serving different types of requests, it can batch the shared base LLM computation to increase efficiency. The con for unmerged is it adds extra computation overhead.

2. Can Algorithm 2 in the paper lead to request starvation? If so, how does dLoRA solve it?

Yes, Algorithm 2 prefers processing requests with the most loaded LoRA adapter type because they form big batches and yield higher merge throughput. That means it may starve other types of requests. dLoRA introduces a credit-based dynamic batching mechanism. It allocates a credit to each LoRA adapter and this credit is transferred to any preempted adapter. When the credits of an adapter exceed a threshold, the algorithm prioritizes the adapter.

## Background
LLMs with *LoRA (Low-Rank Adaptation)* allows each user or task to have its own adapter (small fine-tuned weight deltas) instead of full model copies.
- Basically fine tuning for specific domains

**The challenge: serving many adapter efficiently**

**Two modes of serving LoRA adapters:**
- *Merged*
	- The LoRA adapter weights are _merged_ into the base model weights before inference (so it behaves like a single model).
- *Unmerged*
	- The adapter is kept separate; LoRA contributions are applied dynamically at inference time.

TLDR:
- **Merged** = fast but memory-hungry.
- **Unmerged** = memory-efficient but can be slower or unbalanced.

## dLoRA
dLoRA dynamically _switches_ between merged and unmerged execution depending on runtime workload:
- If many requests use the same adapter → merge it to improve throughput.
- If requests are diverse (many adapters, few requests per adapter) → keep them unmerged to save memory and avoid merge overhead.

It also **groups requests** with the same adapter and **schedules them** intelligently.

2 key parts:
- Dynamic Batching
- Memory management

## Dynamic Batching
Within a replica, dLoRA uses a local cross-adapter batching technique to process requests from the global scheduler. The replica maintains a queue to buffer incoming requests and schedules a batch of requests to the execution engine with dynamic batching to achieve optimal tradeoff between merged and unmerged inference.

