---
date: 2025-11-06
tags:
---
source: [MemGPT: Towards LLMs as Operating Systems](https://arxiv.org/abs/2310.08560)
## Summary

This paper presents MemGPT, a system that manages different storage tiers to provide extended context within the LLM's limited context window. It utilizes a virtual context management, to "page" in relevant history into the main context and "evict" less relevant context to the external context. MemGPT is designed with a multi-level memory architecture consisting of two memory types: main context or the LLM's context size, and external context or information that is outside the LLMs fixed context window.

## Questions

1. What's the memory-hierarchy architecture proposed in MemGPT? What are the tradeoffs this architecture introduces in terms of latency?

MemGPT uses a hierarchy of: main memory that represents the active prompt context and external memory that represents larger, persistent stores available via function calls. The model itself decides when to page information in and out of the main memory which introduces more latency from the retrieval and summarization calls.

2. How would you redesign the memory hierachy for throughput-oriented tasks?

For throughput-oriented tasks, I’d shift MemGPT’s design from LLM paging to a system-managed cache hierarchy. The system would prefetch and batch retrievals so multiple documents or inputs are processed in parallel, reducing pauses from recall calls. The prefetch would be based on a semantic vector retrieval in the query like names or topics or anything that localizes the meaning of the tasks the LLM can decide if they work or if it's a miss. Intermediate caches could hold frequently used chunks to minimize further function calls. The quality would dip, but it would reduce the work that the LLM does in paging.


