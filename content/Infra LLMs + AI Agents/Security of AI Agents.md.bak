---
date: 2025-11-25
tags:
---
source: https://arxiv.org/pdf/2406.08689

## Summary
The paper introduces that traditional LLM defenses (alignment, prompt filtering, jailbreak detection) don't secure AI agents, because agents are stateful, action-oriented and uses tools. Once an LLM's output triggers a tool, the threat surface is expanded to that tool. The authors categorize vulnerabilities into three buckets: state leakage across sessions, model pollution and privacy leakage via training, and malicious or hallucinated actions executed by agent programs. They found in their experiments that alignment as a protection stops harmful text but it does not stop harmful actions.

## Questions
1. How do stateful, action-oriented vulnerabilities render traditional LLM defenses (like standard alignment or prompt filtering) insufficient?

LLM shares one context window for all users and tools. Due to that shared context window, alignment/prompt filtering can't stop state bleed, mis-assigned actions or accidental training pollution. Also actions break the text-only threat model. If LLMs have tool capabilities, the threat surface expands to the tool since unexpected LLMs outputs now can lead to potential misuse of tool calls.

2. Can you think of an example where a particular agent we've introduced in the course has a vulnerability?

In the SimpleDoc paper, they use a reasoning agent to verify if there's enough context to answer the query and if there isn't it updates the memory and retrieves more context. A malicious user can pollute the model state to update memory with misleading or malformed information, which is used in later reasoning steps. This is an example of the paper's model-pollution vulnerability where the agent state is corrupted across turns.
