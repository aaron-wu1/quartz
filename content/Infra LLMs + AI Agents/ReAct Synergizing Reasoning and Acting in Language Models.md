---
date: 2025-09-29
tags:
- operating-systems
- ai
title: ReAct Synergizing Reasoning and Acting in Language Models
---

## Abstract
Explores LLMs to generate both reasoning traces and task-specific actions in an interleaved manner, allowing for greater synergy between the two: reasoning traces help the model induce, track and update action plans as well as handle exceptions, while action allow it to interface with external sources, such as knowledge bases or environments, to gather additional information.

## ReAct Prompting
Consists of a few-shot task-solving trajectories, with human-written text reasoning traces and action, as well as environment observations in response to action. In short attempts to reconstruct first principals thinking

**HotpotQA example**
getting external information
![[Screenshot 2025-09-29 at 8.16.20 AM.png]]