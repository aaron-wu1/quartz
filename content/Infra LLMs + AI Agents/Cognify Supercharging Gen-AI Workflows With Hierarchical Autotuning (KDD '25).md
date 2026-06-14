---
date: 2025-11-09
tags:
- performance
- computer-architecture
- ai
title: Cognify Supercharging Gen-AI Workflows With Hierarchical Autotuning (KDD '25)
---

source: https://arxiv.org/abs/2502.08056
## Summary

This paper presents Cognify, an autotuning framework that uses AdaSeek to optimize AI workflows. AdaSeek is a hierarchical search algorithm that adaptively tune with three tuning method types: architecture, step, and weight adjustments. By doing with hierarchical steps, Cognify lowers both the cost and runtime of optimizing AI systems.


## Questions
1. What's the pros and cons of Cognify compared to RL-based agent tuning methods?

Cognify’s search algorithm, AdaSeek, is far more sample-efficient than RL-based tuning. It’s able to find good configurations in magnitudes less steps than traditional RL. It’s also simpler to run because it doesn’t require training an agent or reward model. However, unlike RL, Cognify doesn’t learn a reusable policy or adapt to changing inputs over time. It only optimizes a fixed workflow once. So if a higher level layer skips a promising option in its search space, later stages can't recover it.

2. How does Cognify decides the size (number of samples) of each layer? Do you think that's reasonable?

AdaSeek divides the total search budget among its three layers. It allocates more samples to higher layers to quickly cut down the scope of tuning. This helps to reduce less impactful sample sizes at the weight step. I think this is reasonable, because the goal of AdaSeek is to optimize AI workflows given a small budget and to do so it avoids wasting resources on lower impact steps.