---
date: 2025-10-31
tags:
---
## What is LLM reasoning?
![[Screenshot 2025-10-31 at 9.07.53 AM.png]]
## Example
![[Screenshot 2025-10-31 at 9.08.27 AM.png]]

## Overall design
![[Screenshot 2025-10-31 at 9.10.13 AM.png]]
## How "normal" LLMs are created
![[Screenshot 2025-10-31 at 9.10.53 AM.png]]![[Screenshot 2025-10-31 at 9.11.43 AM.png]]

## DeepSeek's Process
![[Screenshot 2025-10-31 at 9.12.29 AM.png]]

## What is different with R1?
They used a different post-training recipe on the base model!

![[Screenshot 2025-10-31 at 9.14.48 AM.png]]
Optimization solution score is fed back into the model for training

![[Screenshot 2025-10-31 at 9.20.31 AM.png]]
DeepSeek’s training is **entirely reinforcement-learning-based**, with no supervised fine-tuning.  
GRPO allows them to:
- Scale efficiently across massive reasoning models,
- Avoid instability from learning value functions,
- And use **relative, group-based rewards** to encourage better reasoning behaviors.
In short:

> **GRPO = PPO without the value model**, replacing learned baselines with group-based comparisons to stabilize and speed up RL for large language models.
## Prompt Used for Reasoning RL Training
![[Screenshot 2025-10-31 at 9.19.09 AM.png]]

## It learns to think!
![[Screenshot 2025-10-31 at 9.22.24 AM.png]]
The result of this RL process is that it's starts to spend more time reasoning through out training
![[Screenshot 2025-10-31 at 9.21.18 AM.png]]

## Purely RL is not enough (DeepSeek-R1-Zero)

![[Screenshot 2025-10-31 at 9.25.41 AM.png]]
DeepSeek-R1 uses some SFT data to help with readability and language mixing problems in Zero
![[Screenshot 2025-10-31 at 9.26.36 AM.png]]
## Demystifying Delays in Reasoning: A Pilot Temporal and Token Analysis of Reasoning Systems
## Reasoning and deep research study
![[Screenshot 2025-10-31 at 9.37.05 AM.png]]
![[Screenshot 2025-10-31 at 9.37.59 AM.png]]
## Implications
- Tool calling, especially web search, accounts for most of the latency for GPT-5 and Open Deep Research 
- Insignificant for o3 
- Tool calls can often be parallelized
- Higher token counts (e.g., longer reasoning chains) can improve generation quality, but comes with high latency and cost
- More on tool and agents next Monday