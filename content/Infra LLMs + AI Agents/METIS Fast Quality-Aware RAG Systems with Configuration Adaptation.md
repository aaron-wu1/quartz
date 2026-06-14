---
date: 2025-11-11
tags:
- performance
- concurrency
- computer-architecture
- ai
title: METIS Fast Quality-Aware RAG Systems with Configuration Adaptation
---

Source: https://arxiv.org/abs/2412.10543

## Summary
This paper presents METIS, a RAG system that jointly schedules queries and adapts key RAG configurations of each query. METIS is able to do this by creating a system with two components. The first component is an LLM query profiler that estimates the query profile, decides how many chunks are needed, and how to use those chunks. The second component is the best fit scheduler which uses the pruned config set to pick the largest config that fits in GPU memory.

## Questions
1. How does METIS's LLM profiler's data inform the adaptation mechanism's scheduling decision at query time?

The LLM profiler creates a query profile by estimating four high-level dimensions for each query: query complexity (high/low), joint reasoning requirement (yes/no), pieces of information required (1-10), and length of summarization (30-200). With the query profile, METIS performs a rule-based mapping to generate values for RAG configuration knobs. These configuration knobs are then put through the scheduler to find the best configuration.


2. Consider an agent that must perform both RAG and tool use. How could the core principles of METIS be extended to create a "quality-aware scheduler" for this type of agents?

The query profile can also create attributes for tool use like "is the tool needed" or "the estimated latency of the tool". There could be an attribute that decides if a tool use is required just like how the "joint reasoning requirement" is implemented. Additional metadata on the tool's performance would be needed to be dumped in with the query to properly estimate attributes for tool use. There could also be an additional configuration knob that weighs in the tool latency.