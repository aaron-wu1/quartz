---
date: 2025-10-30
tags:
- performance
- concurrency
- ai
title: Reasoning Models
---

Sources:
 [DeepSeek-R1: Incentivizing Reasoning Capability in LLMs via Reinforcement Learning](https://arxiv.org/abs/2501.12948) and [Demystifying Delays in Reasoning: A Pilot Temporal and Token Analysis of Reasoning Systems](https://cseweb.ucsd.edu/~yiying/2025_NIPS_ERW_Deep_Research_Perf_Study.pdf)

## Summary
The DeepSeek paper introduces that it's possible to use reinforcement learning (RL) to help lengthen and improve chain-of-thought (COT). They introduce two systems: DeepSeek-R1-Zero that's purely RL, and DeepSeek-R1 that's RL plus cold start data that consist of human readable CoTs.

The second paper, demystifying delays, they found that tool latency and retrieval design are the primary levers for speeding up reasoning end-to-end. In their study, they found that web search dominates latency and answer generation consumes most of the token budget from long context.


## Questions
1. What are the main advantages and risks of using this purely RL-based approach (without supervised fine-tuning) to incentivize chain-of-thought reasoning in LLMs?

The advantages of using RL is that it's more scalable. For supervised fine-tuning, the expense of a high quality human-labeled dataset makes the process of developing a model less scalable. The risks with purely RL from DeepSeek-R1-Zero is that it struggles with poor readability and language mixing. The second iteration DeepSeek-R1 uses a small amount of CoT data to fine-tune the model and tackle the challenges with DeepSeek-R1-Zero.

2. What implications does the study results have for designing efficient large reasoning systems? Any proposal for improving request latency?

The study found that web search dominates end-to-end request latency and that the final answer generation consumes most tokens due to lengthy retrieved context. This means that tool latency and retrieval design are the key parts in designing for performance. To reduce latency, the suggestions were lowering "verbosity" for less generated tokens or parallelizing web search requests.



## DeepSeek-R1
- "reasoning-first" LLms trained largely with **reinforcement learning** to lengthen and improve chain-of-thought (CoT), plus a variant (R1-Zero) trained with **pure RL from base model**
	- DeepSeek-R1-Zero did it without supervised fine-tuning (SFT) as a preliminary steps and still has good reasoning capabilities
	- but had challenges: poor readability and language mixing
	- DeepSeek-R1 fixes these by incorporating multi-stage training and cold-start data before RL.