---
date: 2025-10-10
tags:
- distributed-systems
- caching
- performance
- concurrency
- ai
title: Efficient Memory Management for Large Language Model Serving with PagedAttention
---

Source: https://arxiv.org/pdf/2309.06180

## Summary
This paper presents PagedAttention, an attention algorithm that addresses the issue of dynamic memory *usage* in KV cache which causes internal/external fragmentation. PagedAttention also aims to provide a solution to provide memory sharing within the KV cache. Lastly, the paper also introduces vLLM, a high-throughput distributed LLM serving engine built on top of PagedAttention.

## PagedAttention
PagedAttention divides the request's KV cache into blocks, each of which can contain the attention keys and values of a fixed number of tokens. In PagedAttention, the blocks for the KV cache are not necessarily stored in contiguous space.

## vLLM
High-throughput distributed LLM serving engine on top of PagedAttention that achieve near-zero waste in KV cache memory
- uses block-level memory management and preemptive request scheduling that are co-designed with PagedAttention

## Background
### LLM Service and Autoregressive Generation
- LLM Service: 
	- Once trained, LLMs are often deployed as a conditional generation service (e.g., completion API or chatbot). A request to an LLM service provides a list of input prompt tokens ($𝑥1,...,𝑥𝑛$),and the LLM service generates a list of output tokens ($𝑥𝑛+1,...,𝑥𝑛+𝑇$). We refer to the concatenation of the prompt and output lists as *sequence*.

- Autoregressive: 
	- The LLM can only sample and generate new tokens one by one, and the generation process of each new token depends on all the *previous tokens* in that sequence, specifically their key and value vectors. In this sequential generation process, the key and value vectors of existing tokens are often cached for generating future tokens, known as *KV cache*.

## Memory Challenges in LLM Service
The serving system's throughput is *memory-bound* and overcoming this memory-bound requires addressing the following challenges in the memory management:
- **Large KV cache**
- **Complex decoding algorithms**
- **Scheduling for unknown input and output length**