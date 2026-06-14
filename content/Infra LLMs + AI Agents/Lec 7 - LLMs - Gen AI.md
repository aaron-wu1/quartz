---
date: 2025-10-13
tags:
- performance
- computer-architecture
- ai
title: Lec 7 - LLMs - Gen AI
---

## LLM Inference
![[Screenshot 2025-10-13 at 9.16.18 AM.png]]
LLMs generate the best next token
## Prefill vs Decode
![[Screenshot 2025-10-13 at 9.05.06 AM.png]]
Decode is autoregressive

## Compute vs Memory Bound
![[Screenshot 2025-10-13 at 9.05.42 AM.png]]
Roofline graph

## Approximation Model
- model should be order(s) of magnitude smaller
	- E.g. 7B and 68M
	- Either fewer layer, smaller hidden dimension size, fewer attention heads
- Also called  "small specialized model (SSM)" or "draft model"
- Same vocabulary as the LLM (also called "target model")
- Ideally trained on the same data

## Speculative Decoding
1. Drafting
	- The overhead is magnitudes smaller in draft model that system can tolerate performance wise
2. Verification
	- Decide how many accept and reject
![[Screenshot 2025-10-13 at 9.08.42 AM.png]]

## Results
![[Screenshot 2025-10-13 at 9.11.29 AM.png]]

## Cost of Speculation
![[Screenshot 2025-10-13 at 9.14.33 AM.png]]
$M_p$ is target, $M_q$ is draft
- As speculative depth increases, so does overhead
	- if TAR is too low, this overhead can dominate
- **instead, we can sample a tree from the draft model**

## Sampling
![[Screenshot 2025-10-13 at 9.18.16 AM.png]]
Greedy decoding would select the token with the highest probability
Stochastic decoding would be random selection

## Tree Attention
1. sampling
![[Screenshot 2025-10-13 at 9.19.21 AM.png]]
2. Construct token tree
3. Linearize and construct mask
![[Screenshot 2025-10-13 at 9.19.56 AM.png]]
4. Verification with mask
![[Screenshot 2025-10-13 at 9.20.44 AM.png]]

Stems beam search (TODO lookup)

## Stochastic Decoding
![[Screenshot 2025-10-13 at 9.26.53 AM.png]]

## Results
![[Screenshot 2025-10-13 at 9.33.48 AM.png]]

## Tradeoffs
![[Screenshot 2025-10-13 at 9.34.04 AM.png]]

## EAGLE
- used currently
- Data at the token/LM head level is very uncertain and not as rich
- Instead, train an auto-regressive head right before the LM head
	- 1 fully-connected linear layer
	- 1 transformer decoder layer
- Drafting overhead is negligible
	- Reduced kernel launch overhead
	- Autoregressive head << draft model size

![[Screenshot 2025-10-13 at 9.35.16 AM.png]]