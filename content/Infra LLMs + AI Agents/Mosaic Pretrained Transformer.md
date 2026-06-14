---
date: 2025-09-30
tags:
- performance
- ai
title: Mosaic Pretrained Transformer
---

Source:
https://www.databricks.com/blog/mpt-7b

Open source transformer

Perks as of Our MPT model series is:
- **Licensed for commercial use** (unlike LLaMA).
- **Trained on a large amount of data** (1T tokens like LLaMA vs. 300B for Pythia, 300B for OpenLLaMA, and 800B for StableLM).
- **Prepared to handle extremely long inputs** thanks to [ALiBi](https://arxiv.org/abs/2108.12409) (we trained on up to 65k inputs and can handle up to 84k vs. 2k-4k for other open source models).
- **Optimized for fast training and inference** (via [FlashAttention](https://arxiv.org/abs/2205.14135) and [FasterTransformer](https://github.com/NVIDIA/FasterTransformer))
- **Equipped with highly efficient open-source training code.**