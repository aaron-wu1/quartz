---
date: 2025-10-05
tags: 
---
## Summary and Questions
The paper presents utilizing AWS Trainium, a new lower cost machine learning accelerator, to pretrain high quality LLM modes. They showcase 2 models (7B and 70B) trained with AWS Trainium and found that it was comparable to popular open source models at a fraction of cost of Nvidia A100 40GB GPUs. They also share best practices of utilizing NeuronX Distributed Training a custom training library for AWS Trainium.

1. How does HLAT determine its parallelism strategies and system optimizations, and how might these trade-offs evolve as model size or cluster scale increases?

HLAT determines it's parallelism strategies and system optimizations by optimizing based on the choice of activation checkpointing method, gradient accumulation steps and training precision to balance memory and communication costs. They found for a 7B model, trained with 64 nodes TP=8 and PP=1 provides the highest training throughput but not for their 70B model which was trained with 256 nodes and TP=32, and PP=8. As model size increases, there is going to be more pressure on the memory of the device, leading for more pipelining. With the increase of cluster size, it leads to more communication overhead and puts pressure to have more tensor parallelism. 

2. Which stage or component of pre-training do you consider most critical in practice, and why?

I think checkpointing/fault recovery mechanisms is the most important in practice. With the size of LLMs it can take a long time to pretrain and with more time, there's a higher chance of inevitable errors. By being able to resume intermediate training state and avoid errors increases the chance of successfully pretraining the model.
## Background
### What "parallelism" means in LLM pretraining
Training a huge model doesn't fit on one GPU, so there's a need to **split** the work across **many devices**

Three main kinds of parallelism
- **Data parallelism** - Split different batches of the data
	- Distribute the full model and average the computations
- **Tensor/Model parallelism** - Split different parts of the same layer
	- Split the model and each worker computes the chunk of the model
- **Pipeline parallelism** - Split different layers
	- Split the model's layers and each worker handles part of the layer

These can be mixed together, **hybrid parallelism**

### How HLAT decide which strategy to parallelize by

**AWS's Trainium** - AWS own chip, second-generation machine-learning accelerator design and optimized for training deep learning models
- Specs:
	- 32 NeuronCores - mini processing units for tensor math
- Software environment
	- rather CUDA uses Neuron SDK
- Goal:
	- more optimized and designed for training LLMs

At scale with thousands of these AWS chips, there becomes a need to an efficient communication system. Hence two main connection types:
- NeuronLink - used when two chips need to exchange large tensors many times per layer (eg. splitting a big matrix multiply)
	- **low latency, high bandwidth**
	- 800Gbps
	- connects chips within the **same instance**
- EFA (Elastic Fabric Adapter) - used when different chips just need to sync up occasionally (eg. after training step to average gradients)
	- **higher latency, lower bandwidth**
	- **connects different instances**
	- network interface with a uniquely designed OS that bypasses traditional HW interfaces to enhance performance and inter-node communication

Back to the planning parallelism:

|Strategy|Where HLAT uses it|Network it relies on|Why it fits|
|---|---|---|---|
|**Tensor Parallelism**|Within each NeuronLink pair|NeuronLink|Each layer’s math needs fast back-and-forth sharing.|
|**Pipeline Parallelism**|Across small groups of nodes|NeuronLink + EFA|Periodic activation passing, tolerates some delay.|
|**Data Parallelism**|Across the entire cluster|EFA|Only needs synchronization once per step.|

### Why this matters for scaling
As the model gets bigger:
- Need more **tensor parallelism**
- But you can only do that efficiently *within* fast NeuronLink, otherwise communication would overwhelm the compute
- Add **data parallelism** over EFA
This is **hardware-aware hybrid parallelism**
