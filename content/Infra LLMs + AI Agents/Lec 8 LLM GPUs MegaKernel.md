---
date: 2025-10-15
tags:
- computer-architecture
- concurrency
- performance
- caching
- programing-language
title: Lec 8 LLM GPUs MegaKernel
---

## Outline 
- GPU Revisited – Why do we need megakernels?
	- GPU Programming Model and Execution Model Revisited
	- Motivations and Enablers of Megakernel
- How to design mega kernels for modern GPUs?
	- Megakernel System Framework 
	- Megakernel Components
- Understanding the Performance Benefits of Megakernels

## GPU Heterogeneous Computing
- Terms:
	- Host - The CPU and its memory (host memory)
	- Device - The GPU and its memory (device memory)
- GPUs need some special programs to utilize code on the parallel compute of GPU
![[Screenshot 2025-10-15 at 9.06.06 AM.png]]

## Simple Processing Flow
1. Copy input data from CPU memory to GPU memory
2. Load GPU program and execute caching data on chip for performance
3. Copy results from GPU memory to CPU memory

![[Screenshot 2025-10-15 at 9.07.55 AM.png]]
Special code to start the kernel to load code onto GPU

## Moving to parallel
GPU computing is about massive parallelism
- so how do we program to make our code run in parallel on the device
- CPU-like code only compute one element at a time

### Vector Addition on Device
- With `add()` running in parallel we can do vector addition
- Terminology: the code of of `add()` is executed on massive parallel cores, each core we call it a thread
- The programming model is called **Single Instruction Multiple Threads (SIMT)**
	- Each invocation can refer to its block index using `ThreadIdx.x`
	- ![[Screenshot 2025-10-15 at 9.11.35 AM.png]]
- By using `ThreadIdx.x` to index into the array, each block handles a different index

### Concurrent thread Group (CTA) (todo)
- contains a set of threads that run concurrently

### Summary of GPU programming Model
- Programming model
	- SIMT - Single Instruction Multiple (Concurrent) Threads
		- concurrent - running at the same time, not necessarily parallel
		- Single function to instruct

## GPU Execution Unit (SM)
![[Screenshot 2025-10-15 at 9.14.35 AM.png]]
- A group of 32 threads in a thread block is called a **warp**
	- In a CTA, threads 0-31 fall into same warp
	- Each sub-core in the V100 is capable of scheduling and interleaving execution of up to 16 warps
- **Warp** is not part of CUDA programming interface but is an important CUDA implementation detail on modern NVIDIA GPUs

### warp as a parallel execution unit
Entire warp of CUDA threads is running this instruction stream


## Key Motivation
CPU-based control overhead and opaque hardware scheduling from the kernel overhead.
- CPU will launch kernel and wait for results 
	- causing GPU idle time
- ![[Screenshot 2025-10-15 at 9.23.54 AM.png]]
![[Screenshot 2025-10-15 at 9.25.11 AM.png]]

## MegaKernels
Combining multiple GPU kernel launches and interkernel communication.

### Building a Megakernel system
![[Screenshot 2025-10-15 at 9.32.51 AM.png]]