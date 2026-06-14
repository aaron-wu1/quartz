---
date: 2025-10-15
tags:
---
## Summary

The paper presents Preble, a distributed LLM serving platform that targets and optimizes for prompt sharing since prompts are typically repetitive over a large amount of requests. It introduces the E2 algorithm that co-designs model computation load-balancing and prefix-cache sharing. E2 allows requests to exploit (reuse) computed prompt prefixes on the same GPU, but also gives chances for requests with shared prefixes to explore other GPUs to reduce load imbalances.

## Questions
1. What will happen if all requests are scheduled only based on where their matched prefix cache reside?

If all requests scheduled are only sent to their matched prefix cache then highly requested prefixes will incur more load. That means the GPU with the most popular prefixes will become a hotspot, while GPUs with less popular prefixes will become underutilized. This creates a load imbalance and isn't the best use of resources.

2. What does Preble do when a lot of requests share the same prefix (i.e., highly skewed workloads)?

If the load hitting a popular prefix increases over what GPUs can handle, Preble automatically replicates the prefix over multiple GPUs. Preble then would schedule the requests based on which GPUs have the "lightest" loads to reduce the imbalance.



## Abstract
Preable, first distributed LLM serving platform that targets and optimizes for prompt sharing.
- Prompts are repetitive over a large amount of requests
- Designed distributed scheduling system that co-optimizes KV state reuse and computation load-balancing with a new scheduling algorithm and a hierarchical scheduling mechanism

## Introduction
New developments in LLMs
1. prompts to LLMs are significantly longer than generated sequences
	- More recently models internally have built-in reasoning capabilities. Despite the end user's response being short, models internally add more context like chain-of-thought prompting and lengthening the total context length.
		- Often the longer the prompt is the better quality the model can generate
2. prompts are partially shared across requests
	- a long doc or video is often queried many times with different questions

## E2 (stands for exploitation + exploration)
co-designs model computation load-balancing and prefix-cache sharing. 
- E2 allows requests to *exploit* (reuse) computed prompt prefixes on the same GPU
- but also gives chances for requests with shared prefixes to *explore* other GPUs.

E2 chooses *exploitation* when the amount of recomputation saved is larger than new computation.
- when shared prefix tokens is larger than remaining non-shared token
Otherwise, E2 chooses *exploration* where it choose the GPU with the lightest "load" using a *prompt-aware load* definition that is configured
- the prompt-aware load has 3 parts all calculated as GPU compute time
	1. GPU's compute load in recent time window *H*
		- total prefill time and decode time incurred by all requests in H
	2. cost of evicting existing KVs on the GPU to make memory space to run the new request
	3. cost of running the new request on the GPU.

## Preble System
- **Global scheduler (E2 algorithm):** Assigns requests to GPUs based on cache reuse and load.
- **Local scheduler:** Manages request priorities, prefix trees, and batching on each GPU.
### System Design
- Built on top of **vLLM** and **SGLang**
- Maintains a **global radix tree** for prefix sharing and GPU cache mapping.
- Uses **priority-based local scheduling** for fairness, where requests with higher cache-hit ratios get higher priority but quotas prevent starvation.