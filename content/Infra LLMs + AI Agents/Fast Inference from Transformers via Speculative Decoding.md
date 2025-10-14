---
date: 2025-10-12
tags: 
---


Source: https://arxiv.org/abs/2211.17192
## Summary
This paper presents an idea to speed up inference by utilizing additional compute resources to run a smaller or draft model in parallel and utilizing its results as a guess of what the larger model might generate. The larger model can verify the results at a much faster time than generating its own result, saving inference time. If the draft model's result is rejected, the larger model will then run to generate the best next token. This is called *speculative decoding* and it's possible because hard language-modeling tasks often include easier subtasks that the smaller model can solve.

## Questions
1. List two drawbacks of speculative decoding.
    One drawback is latency is improved through increased concurrency but at the cost of increasing arithmetic operations. It requires additional computational resources to run the smaller model. The second drawback is that the models have to be similar. In the paper they only tested approximation models of the same architecture as the target models and using the same probability standardization. 
2. In an agentic setting where LLMs are repeatedly called, can you think of a way to speculate output tokens without using a draft model (Mq in the paper)?
	One way would be caching and embedding queries and then doing a semantic search as a way to speculate the output tokens. In an agentic setting, it's even more likely that very similar requests are going to be made hence leading to the idea to try to generalize them. For example, say an AI agent is made to interface with google drive. There are a limited amount of primitive actions that you can do like open doc, delete doc, and edit doc. You can have premade responses for the query to reference and speculate as endings to the request.
    

## Abstract
- Inference from large autoregressive models like Transformers is slow.
	- Decoding K tokens takes K serial runs of the model
- Introducing *speculative decoding* - an algorithm to sample from autoregressive models fasters *without any changes to the outputs*, by computing several token in parallel.
- Observations:
	- hard language-modeling tasks often include easier subtasks that can be approximated well by more efficient models
	- using speculative execution and a novel sampling method, we can make exact decoding from the large models faster,
		- by running them in parallel on the outputs of the approximation models
		- potentially generating several tokens concurrently
		- without changing the distribution

## Introduction
Observations:
- some inference steps are "harder" and some are "easier"
- inferences from large model is bottlenecked on memory bandwidth and communication
The idea is to increase concurrency to accelerate inference without changing the model architectures, training-procedures or needing to re-train the models. (*speculative execution*)

**Speculative execution** is an optimization technique, common in processors, where a task is performed in parallel to verify if it's actually needed -- the payoff being increased concurrency.
- Commonly used in branch prediction, [[Computer Arch Crash Course#Branch prediction]]
- In the paper, they generalize speculative execution to the stochastic (random) setting - where a task *might be* needed with some probability
	- sample generations from more efficient *approximation models* as speculative prefixes for the slower *target models*
		- called *speculative sampling*
	- *speculative decoding* accelerate decoding

## Speculative Sampling
Speculative sampling is using smaller models to quickly generate next tokens and verifying it with the larger (original) model.
- Verification is **probabilistic acceptance**, designed so that the _final distribution_ matches what the big model alone would produce
	- Checks whether the larger model would more likely accept the result than the smaller model
	- $$min(1,\frac{p_{big​\ model}(w)}{p_{small\ model​}(w)}​)$$
	- Let $q(x)$ = probability of token with small model
	- Let $p(x)$ = probability of token generated with target (big) model
	- Accept if $q(x) \leq p(x)$, else reject with the probability of $1-\frac{p(x)}{q(x)}$

## Speculative Decoding
Chooses the speculative sampling tokens if it passes verification. Else corrects it by waiting for the big model to generate.