---
date: 2025-11-15
tags:
---
Source: https://arxiv.org/abs/2503.16416

## Summary

This paper surveys the landscape of evaluating LLM-Based agents. These systems are different from single turn LLMs because they plan, use tools and maintain memory. Therefore, these abilities require new evaluation methods. Currently, there's a shift towards more realistic, continuously updated, and interactive benchmarks. But the authors also highlight benchmark gaps in cost-efficiency, robustness and safety.

## Questions

1. How might an agent's effective use of tools (e.g., code execution, web search) potentially obscure the evaluation of its true underlying reasoning or planning abilities?

An agent can offload its reasoning to a tool to do the work and makes it hard to differentiate between tool error or agent error. The tool can abstract away the logic that the agent accepts as truth even if the tool may or may not be wrong due to errors. In order to properly use a tool, the agent needs to reason the output and its usage of tools.

2. How would you design an interactive evaluation for computer-use agents?

I would create a sandboxed desktop environment with a logging service that logs every action (UI or tool action). The benchmark tasks would be complex tasks that require multiple chains of actions that are not inherently visible at the start to promote adaptability, reasoning, and adding unpredictability. This would prevent macros that would obscure the reasoning process of agents. Because we have a service that logs every action, we can measure the efficiency at each step and whether it was the best action to take.

## Evaluation Grouping
### Core agent abilities - fundamental skills that make agents useful
- Planning and reasoning
	- math reasoning, multi hop QA, puzzle solving, etc
- Tool use and function calling
	- stateful APIs, nested functions, multi step calls, etc
- Self reflection
	- Can agents correct their own mistakes through feedback
- Memory
	- long context management, episodic memory

### Application specific agents - benchmarks for specific tasks
- Web agents
- Software engineering agents
- Scientific agents
- Conversational agents
### Generalist agents - judge everything at once
- Test agents inside realistic computer environments or enterprise style tasks. 
	- The frontier resembles evaluating a junior employee.
- GAIA, AgentBench, OSWorld, AppWorld, OmniACT, CRM-Arena, and TheAgentCompany

### Evaluation Frameworks
| Framework                       | Stepwise Assessment | Monitoring | Trajectory Assessment | Human in the Loop | Synthetic Data Generation | A/B Comparisons |
| ------------------------------- | ------------------- | ---------- | --------------------- | ----------------- | ------------------------- | --------------- |
| **LangSmith (LangChain)**       | ✓                   | ✓          | ✓                     | ✓                 | ×                         | ✓               |
| **Langfuse (Langfuse)**         | ✓                   | ✓          | ×                     | ✓                 | ×                         | ✓               |
| **Google Vertex AI evaluation** | ✓                   | ✓          | ✓                     | ×                 | ×                         | ✓               |
| **Arize AI’s Evaluation**       | ✓                   | ✓          | ×                     | ✓                 | ✓                         | ✓               |
| **Galileo Agentic Evaluation**  | ✓                   | ✓          | ×                     | ✓                 | ×                         | ✓               |
| **Patronus AI**                 | ✓                   | ✓          | ×                     | ✓                 | ✓                         | ✓               |
| **AgentsEval (LangChain)**      | ×                   | ×          | ✓                     | ×                 | ×                         | ×               |
| **Mosaic AI (Databricks)**      | ✓                   | ✓          | ×                     | ✓                 | ✓                         | ✓               |

## Key Trends
- Realistic and Challenging Evaluations
	- shift away from simplified, static environments
	- low scores for even top-performing agents
- Live Benchmarks
	- more adaptive and continuously updated
- Advancing Granular Evaluation
	- Current benchmarks rely on coarse, end-to-end success metrics that obscure the root causes of failure
- Cost and Efficiency Metrics
	- Current evals prioritize accuracy over efficiency
- Safety and compliance
	- Significant shortcoming in current benchmarks on safety, trustworthiness, and policy compliance