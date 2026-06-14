---
date: 2025-10-21
tags:
- performance
- ai
title: Attention
---

Traditional RNN, Attention optimizes model performance by only going through needed decode stages rather than all (reduces path length)
![[Screenshot 2025-10-21 at 7.12.29 PM.png]]
Transformer Architecture
![[Pasted image 20251021191556.png]]
Feed entire sentence and target output to input and output respectively to get probability of output. Back propagation only on one step (one word) rather than whole sentence
- Positional encoding: position of words
- Attention: choose which words to look at the most to feed over to output