---
date: 2025-10-03
tags: 
---
## Neural Network Training
- Feedforward and back propagation gradient descent
![[Screenshot 2025-10-03 at 9.05.15 AM.png]]
## Batch Gradient Descent
![[Screenshot 2025-10-03 at 9.05.24 AM.png]]

## Stochastic Gradient Descent
![[Screenshot 2025-10-03 at 9.06.36 AM.png]]

## Minibatch-Based SGD
![[Screenshot 2025-10-03 at 9.07.37 AM.png]]
## Model Training Cost
![[Screenshot 2025-10-03 at 9.08.17 AM.png]]

## Distributed Training is Necessary
- Developers / Researchers’ time are more valuable than hardware . 
- If a training takes 10 GPU days • Parallelize with distributed training 
- 1024 GPUs can finish in 14 minutes (ideally)! 
- The develop and research cycle will be greatly boosted

## Introduction to Distributed Training
### Data Parallelism
- Train by splitting the training data over a bunch of GPUs
![[Screenshot 2025-10-03 at 9.10.33 AM.png]]

**Scaling Distributed Machine Learning with the Parameter Server**
- All worker nodes synchronize to a single point
- ![[Screenshot 2025-10-03 at 9.12.10 AM.png]]
- Two different roles in framework:
	- Parameter Server: receive gradients from workers and send back the aggregated results
	- Workers: compute gradients using splitted dataset and send to parameter server
- Problems
![[Screenshot 2025-10-03 at 9.13.35 AM.png]]

### Distributed Communication
![[Screenshot 2025-10-03 at 9.18.11 AM.png]]
![[Screenshot 2025-10-03 at 9.20.03 AM.png]]
![[Screenshot 2025-10-03 at 9.22.32 AM.png]]
![[Screenshot 2025-10-03 at 9.24.41 AM.png]]
*Note:* last two are typically used in industry atm

