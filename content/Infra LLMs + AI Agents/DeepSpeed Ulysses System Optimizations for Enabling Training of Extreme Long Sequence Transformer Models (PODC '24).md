---
date: 2025-10-21
tags:
---
## Summary
The authors present DeepSpeed-Ulysses a novel, portable and effective methodology for enabling highly efficient and scalable LLM training with extremely long sequence length. Longer sequences increase memory and communication costs in attention. In order to speed up inference, the authors decided to partition the long sequence. Right before attention computation, it employs all-to-all communication collection on the partitioned queries, keys, and values such that each GPU receives the full sequence but only for a non-overlapping subset of attention heads. This allows for GPUs to compute attention for different attention heads in parallel. Lastly an all-to-all to gather the results along the attention heads while re-partitioning along the sequence dimension

## Questions
1. Can DeepSpeed-Ulysses work when the number of GPUs is higher than the number of heads? Why or why not?

Yes, but the extra GPUs won't be doing anything. DeepSpeed-Ulysses parallelizes over attention heads, specifically non-overlapping subset of attention heads, to prevent conflicts. Any extra GPUs will sit idle because the maximum useful degree of parallelism is limited by the number of non-overlapping attention heads.

2. What is the latency impact for one transformer layer caused by DeepSpeed-Ulysses?

DeepSpeed-Ulysses adds two all-to-all operations per transformer layer. The first all-to-all operation for QKV projections has an aggregate message size of 3Nh and the second all-to-all for the output context projection with a size Nh. The overall communication impact is 4Nh/P where N is sequence length, h is hidden size, and P is the degree of parallelism.


## Abstract
Computation in Transformer model is characterized by:
- Batch size,
- Hidden dimension
- number of layers
- sequence length
Previous work has been focusing on the first three dimensions: 
- data parallelism for batch size
- tensor parallelism for hidden size
- pipeline parallelism for model depth or layers.

These are not targeted or optimized for long sequence Transformer models.

The authors introduce DeepSpeed-Ulysses, a novel, portable and effective methodology for enabling highly efficient and scalable LLM training with extremely long sequence length.

## Problem
Longer sequences increase memory and communication costs in attention, because every token talks to every other token
Traditional parallelism limits:
- Tensor/model parallelism: split matrices -> fine for big models, not for long sequences
- Pipeline parallelism: splits layers -> no help for long context
- Megatron sequence parallelism: splits token across GPUs, but each still needs all tokens' keys/values for attention, causes large all-gathers

## What is DeepSpeed Ulysses?
DeepSpeed Ulysses asks: "What if we shared the **sequence dimension** and keep communication scalable"

The big idea is:
- partition sequence among GPUs
- Right before attention computation, it employs all-to-all communication collection on the partitioned queries, keys, and values such that each GPU receives the full sequence but only for a non-overlapping subset of attention heads.
	- Allows for GPUs to compute attention for different attention heads in parallel
	- Lastly an all-to-all to gather the results along the attention heads while re-partitioning along the sequence dimension

Attention works, but traffic scales to $sequence\ length / number\ of\ GPUs$ now
