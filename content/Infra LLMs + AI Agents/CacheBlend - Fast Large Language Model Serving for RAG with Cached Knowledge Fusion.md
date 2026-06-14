---
date: 2025-11-30
tags:
- caching
- performance
- ai
title: CacheBlend - Fast Large Language Model Serving for RAG with Cached Knowledge
  Fusion
---

Source: https://arxiv.org/abs/2405.16444

## Summary
This paper presents CacheBlend, a scheme that blends the precomputed KVs and selectively recomputes the KVs of a small subset of impactful tokens. For each layer, CacheBlend blends reused and recomputed entries to match the attention patterns of a full prefill pass. This process reduces the cost of computing attention and speeds up inference.

## Questions
1. How does CacheBlend efficiently combine retrieved KV caches with the precomputed KV cache of a large text chunk without recomputing attention for the entire sequence?

CacheBlend combines precomputed KV caches of the retrieved chunks into a single KV buffer. For each layer, CacheBlend recomputes a small subset of tokens whose KV values are predicted to change the most and reuses the precomputed KV values for all other tokens. This avoids recomputing attention for the entire sequence.

2. How does Selective Recomputation decide which tokens to recompute versus which to blend?

Selected Recomputation selects tokens based on which token's KV have high KV deviation. The token's KV deviation is estimated based on a heuristic that predicts how much the token's KV would change if fully recomputed. Tokens with highest estimated influence are recomputed per layer, while low impact ones are blended.