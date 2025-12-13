---
date: 2025-10-28
tags:
---
source: https://arxiv.org/abs/2504.02263v1
## Summary

This paper presents MegaScale-Infer, an efficient and cost-effective system to serve mixture-of-experts models. In mixture-of-expert models, the FFN part of a transformer is replaced with many possible FFNs (experts) and each with their own weights. This shifts FFNs to be memory-intensive during inference and lowering GPU utilization. MegaScale-Infer introduces ping-pong pipeline parallelism that partitions batches into micro batches and pipelines the micro batches between attention and FFNs steps.

## Questions
1. Why can the disaggregation of attention and FFN improve the GPU utilization during MoE serving?

Attention scales differently from FFN. Attention is *latency-bound* and *sequential* and FFN are *compute-bound* and *parallel*. Thus having separate scaling strategies for each workload improves GPU utilization.

2. Does the ping-pong pipeline impose any inherent constraints on the model architecture? If yes, what problems will arise when such constraints are not satisfied?

Yes. Ping-pong pipeline requires that attention and FFN computation times be roughly balanced so that communication time be smaller than compute time. If batch sizes are too small or workloads are imbalanced, one side of the pipeline becomes idle, reducing utilization and increasing latency.




## Abstract
- Mixture-of-Experts (MoE) has huge potential to scale LLMs with enhanced perf. and reduced computational complexity
- Issue: 
	- Sparsely activated architecture shifts feed-forward networks from compute-intensive to memory-intensive during inference
- Paper presents MegaScale-Infer, an efficient and cost-effective system to serve MoE models
	- Disaggregates attention and FFN modules within each model layer, enabling independent scaling, tailored parallelism strategies, and heterogeneous deployment for both modules
	- Introduces *ping-pong pipeline parallelism* - partitions request batch into micro-batches and shuttles them between attention and FFNs for inference

## Mixture-of-Experts (MoE)
LLMs have multiple transformer layers and each transformer layer consists of two key parts:
- Attention -> mixes information between tokens (context)
- Feed-Forward Network (FFN) -> transforms each token independently
Attention is about relationships between tokens, FFN is about interpreting each token's new meaning

**MoE**
- replaces the FFN part of a transformer with many possible FFNs (experts) and each with their own weights
- 
```text
Attention (same as usual)
↓
Router → chooses top-k experts (e.g. top-2)
↓
Send token’s hidden vector to those experts’ FFNs
↓
Combine results (weighted by router’s softmax scores)
```


Because of many possible FFNs -> memory bottleneck
- Storage - more FFNs
- Communication overhead - choosing FFNs

## Problem
MoE is inefficient when attention and FFN share the same GPU pool
- Attention is *latency-bound* and *sequential*
- FFN experts are *compute-bound* and *parallel*

During the decoding phase (dominates LLM inference process)
- GPU utilization of attention modules remains low because they must access the intermediate states (KV cache) of all previous tokens
- Conversely, FFN modules achieve high GPU utilization as the number of tokens involved in computation increases.


## Solution: *Disaggregated MoE Serving*
*Disaggregated expert parallelism* - disaggregates the attention and expert modules, assigning them to separate GPUs
**Mega-Scale-Infer** splits the work into two dedicated clusters
- A-nodes: handle all attention computation
- E-nodes: host experts(FFNs)
Tokens **ping-pong** between these clusters:
1. A-nodes run attention for a micro-batch
2. Sends activations to E-nodes
3. E-nodes execute expert FFNs
4. Send results back for the next layer
While A-nodes are computing, E-nodes are communicating
