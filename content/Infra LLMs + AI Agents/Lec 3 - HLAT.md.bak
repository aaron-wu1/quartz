---
date: 2025-10-06
tags: 
---
## Background
- LLM is a major breakthrough for AGI, and pretraining is crucial
- LLMs trained on different chips
	- Nvidia GPU: GPT, Llama, Minstral
	- TPU: Gemini, T5, Open Llama
	- AMD GPU: OLMo
- Distributed training frameworks
	- GPU: Deepspeed, FSDP, Nemo, SageMaker (Rubik)
	- TPU: Jax, EasyLM, Tensorflow
	- Trn: Neuronx-Distributed, Neuron NeMO
- There is no paper or open sourced LLM trained on AWS trainium

## Contributions
- We pre-train HLAT(High-quality LLM pre-train on AWS Trainium)
- HLAT provides comparable perforance with 7B models trained on GPU (LLaMA-1, LLaMA-2) and TPU (OpenLLaMA-1, OpenLLaMA-2)
- provide best practices of pre-training processes
	- sharding strategies
	- training precisions
	- fault tolerance mechanism
- design a novel dataloader which performs both tokenization and example packing during training

## Distributed training on Trainium
- Cost of AWS trainium $21.50 vs p4d24xlarge $32.77 (Nvidia GPU)

## Training Setups
### HLAT Model Architecture
- adpots the decoder-only transformer architecture and applies same modifications used in LLaMA7B
	- pre-normalization with RMSNorm
	- SwiGLU activation function
	- Rotary Embeddings
	- 4k sequence length
- Dataset
	- use public datasets and train for 1.8T tokens

### Training Hyperparameters
- Cosine learning rate scheduler
	- maximum learning rate of $3e-4$
	- Minimum learning rate of $3e-5$
- Linear warmup of 2000 steps
- AdamW optimizer with $\beta = [0.9,0.95]$
- Weight decay value of 0.1 for all parameters, including normalization weights
- Gradient-norm clipping of 1.0
- 1.8 trillion token ~450k steps
- Goal:
	- try to train a comparable model with own hardware

### Orchestration
- model training, utilize a cluster with 64 trn 1.32xlarge instances (nodes) with totaling to 1024 AWS trainium accelerators
- cluster orchestrations using Amazon EKS
- utilize pre-fight burn-in tests and regular health check (nncom) to improve cluster stability
- Neuron Persistent Cache on Local Worker:
	- all instances share a same file system usign Amazon FSx for storing data, checkpoints, logs, etc
	- FSx may cause communication bottleneck because those cached graphs are frequently accessed
	- We store Neuron Persistent Caches in file system of each worker

### Training Efficiency Optimization
- Model parallelism: shard the model...

## Training Process
