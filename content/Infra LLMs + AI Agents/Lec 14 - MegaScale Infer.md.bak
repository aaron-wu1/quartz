---
date: 2025-10-29
tags:
---
## Components of Transformer-Based LLMs
- Each layer contains two modules
	- Attention
	- FFNs
- ![[Screenshot 2025-10-29 at 9.04.08 AM.png]]
## Mixture-of-Experts (MoE)
- Replace FFNs with multiple FFNs each called "expert", an expert in a domain
- Each token is only sent to top-k experts
- increases sparsity
![[Screenshot 2025-10-29 at 9.04.22 AM.png]]

## Latest Large-Scale LLMs
- Doubao-Seed-1.6 
- DeepSeek v3.1
- GPT-OSS 
- Gemini 2.5 Pro
All use MoE
![[Screenshot 2025-10-29 at 9.07.58 AM.png]]
## Roofline Model
- Operational Intensity: the number of operations per byte of memory traffic
- Memory-bound vs. Compute-bound
![[Screenshot 2025-10-29 at 9.06.57 AM.png]]

## Characteristics of two phases in LLM serving
![[Screenshot 2025-10-29 at 9.13.05 AM.png]]

## Disaggregate Attention and FFN
- Independent scaling: Aggregating multiple attention requests can improve the computational efficiency of FFN
- Heterogeneous deployment: Adopt more cost-effective hardware for each module
![[Screenshot 2025-10-29 at 9.17.13 AM.png]]

### Challenge 1: Idle Resource Due to Dependencies
- Sequential computation of a batch will result in only a portion of the resources being utilized at the same time
![[Screenshot 2025-10-29 at 9.18.05 AM.png]]

### Challenge 2: Requirement of High-Performance M2N Communication
- High overhead in existing libraries and instabilities
![[Screenshot 2025-10-29 at 9.19.20 AM.png]]

## MegaScale-Infer
- Disaggregated expert parallelism
- Ping-pong pipeline parallel
- High-performance M2N communication library
![[Screenshot 2025-10-29 at 9.19.58 AM.png]]