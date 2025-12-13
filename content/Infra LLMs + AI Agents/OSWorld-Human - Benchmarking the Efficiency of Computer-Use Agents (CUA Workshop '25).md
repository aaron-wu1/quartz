---
date: 2025-11-18
tags:
---
source: https://arxiv.org/abs/2506.16042
## Summary
This paper presents a study on performance of computer-use agents on OSWorld. The authors created a new benchmark OSWorld-Human that is derived from OSWorld dataset. It contains manually constructed, optimal human trajectories for tasks, establishing the gold standard. They found that even the 16 leading CUAs were inefficient, with the top agents performing 1.4 to 2.7 longer trajectories than the human benchmark.

## Questions
1. What is the fundamental limitation of using human efficiency as the "gold standard" for an AI agent?

The fundamental limitation of using human efficiency as the "gold standard" is the physical limits of humans. Say for an experiment a human user had to move a list of specific files to various new folders. A human would be limited to sequentially moving every file one by one to new folders. An agent could parallelize itself to parallelize its workload. The gold standard defined by the human here only applies if the agent has the same limited capabilities which they don't.

2. Can you think of a way to reduce the end-to-end CUA latency?

A way to reduce end-to-end CUA latency is potentially adding predictors for common actions. Say in their task of changing their document to double-space, a predictor could be a map with a keyword match for "double-spaced" and context of steps to navigate to the line spacing UI button. They can save the LLM from reasoning how to get to the double-spaced UI button.

