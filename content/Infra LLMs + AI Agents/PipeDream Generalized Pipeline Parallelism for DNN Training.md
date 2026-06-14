---
date: 2025-10-02
tags:
- distributed-systems
- performance
- concurrency
- ai
title: PipeDream Generalized Pipeline Parallelism for DNN Training
---

Questions:
1. By making the pipeline more smooth (less pipeline bubbles), what tradeoff does PipeDream make? i.e., in what aspect is GPipe better than PipeDream?
2. What type of parallelism do you think is most widely adopted in practice? Why?

## Abstract
Deep Neural Networks (DNNs) training is extremely time-consuming, necessitating efficient multi-accelerator parallelization
 - **intra-batch parallelization**, single iteration of training is split over available workers, diminishing returns at higher worker counts

Paper presents PipeDream, a system that adds inter-batch pipelining to intra-batch parallelism to further improve parallel training throughput, helping better overlap computation with communication and reduce the amount of communication when possible

DNN training is bi-directional with a forward and backward pass. PipeDream is able to handle this unique requirement and trains models up to 5.3x times faster

## Introduction
Frame: 
- DNNs are getting bigger and training them requires more memory
- current approaches on parallelizing each iteration of optimization algo:
	- data parallelism. Copy the model on multiple GPUs and train with different data sample. 
		- challenge: if model is too big can't copy it
	- Model parallelism partitions operators across workers
	- Hybrid partition both
- All suffer from high communication costs at a large scale
	- as high as 90% due to `all_reduce`

Solution:
- PipeDream - uses *pipeline parallelism* to enable faster DNN training by combining intra-batch parallelism with *inter-batch* parallelization
	- GPUs handle different parts of the model and multiple minibatches flow through at once
	- PipeDream divides the model among available workers and assigning a group of consecutive operators (layers) in the operator graph to each of them. Then overlaps the computation and communication of different inputs in a pipelined fashion
		- Slices model into chunks that get pipelined to GPUs
	- Since the GPUs have orderings, instead of all reducing, GPUs only exchange small pieces (layer outputs/gradients) with their immediate neighbors
	- communication is peer-to-peer as opposed to all-to-all
	- no pipeline stalls in steady state
- pipelining ideas:
	- Naive
		- pipeline forward then pipeline backward
		- issue: harms learning, model learns too slowly.
	- From GPipe:
		- run a few minibatches before updating the weights instead of whole epoch
		- frequent pipeline flushes
-