---
date: 2025-10-17
tags:
---
Overview of [[Preble Efficient Distributed Prompt Scheduling for LLM Serving]]
## It's all about prompting
Prompt example![[Screenshot 2025-10-17 at 9.06.02 AM.png]]
Complexity of change vs task accuracy![[Screenshot 2025-10-17 at 9.07.39 AM.png]]
How we can increase the quality of our result through prompting
![[Screenshot 2025-10-17 at 9.05.53 AM.png]]

## LLM Caching vs Traditional Caching

| Traditional might have:                                           | LLM Serving Systems                                                                                          |
| ----------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| Separation of compute and storage<br>eg. DRAM and disk            | Co-location of compute and state                                                                             |
| Caching can be useful for any chunk of data<br>- any type of data | Sharing is only useful for prefix<br>- due to autoregressive nature, can only match from beginning of prompt |
| Computation and memory can be predictable                         | Computation and memory are unknown before execution                                                          |
## Example Prompt Tree Cache
![[Screenshot 2025-10-17 at 9.18.45 AM.png]]

## How are real-world prompts like?
High sharing degree
![[Screenshot 2025-10-17 at 9.21.14 AM.png]]

## Single GPU example of Prefix Tree
![[Screenshot 2025-10-17 at 9.27.45 AM.png]]

## Scheduling comparisons
![[Screenshot 2025-10-17 at 9.28.45 AM.png]]
## Exploration
![[Screenshot 2025-10-17 at 9.42.10 AM.png]]

## Preble Takeaways
- LLM Serving is getting more expensive using more complex prompting
- Workloads are longer and shared
- Preble(ICLR ’25) enables cache and load to be effectively utilized for performance
	- Utilizing E2 scheduler and fair waiting queue