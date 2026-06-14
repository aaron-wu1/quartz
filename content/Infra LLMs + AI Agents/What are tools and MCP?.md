---
date: 2025-11-02
tags:
- security
- performance
- distributed-systems
- ai
title: What are tools and MCP?
---

source: [What are Tools?](https://huggingface.co/learn/agents-course/en/unit1/tools) and [Introducing the Model Context Protocol](https://www.anthropic.com/news/model-context-protocol)
## Summary
AI Agents uses tools to interact. A tool is a function given to the LLM and the function should fulfill a clear objective. LLMs decide whether to use a tool and return a curated response for an agent. The agent parses the response a calls its tool and returns the tool response for the LLM. The LLM uses the context to enhance its response to the user. MCP is an open standard that enables developers to build secure, two-way connections between their data sources and AI-powered tools. MCP provides a standardized way for LLMs to get the context they need.


## Questions

1. For tool-based AI systems, do you believe we should have more autonomy (more agent like) or less autonomy (more workflow like)? Find a use case to justify your answer.

It depends on the use case. If I knew the exact workflow I would want less autonomy so I could guide the model to do exactly what I want it to do with its tools. For example, searching for data on the web is simple to do but at scale is something that AI would do better. I would want to calibrate the model to say search with certain categories in mind and not predict too much on what it thinks I would want. But I also wouldn't want AI to be prompting me over and over about all the potential calls to a web search tool. It should have autonomy to understand some context and make decisions based on that.

2. Can you think of some challenges of benchmarking and ensuring robustness in agents that depend on external tools?

There's now a dependency on the performance of the external tool. You're now benchmarking the model plus the tool. If the benchmark is compared to another model without the tool, it raises the question on whether the model itself is better or whether it's the tool that enhances the model.
## What are Tools?
AI Agents uses *tools* to interact. 
A **tool is a function given to the LLM** and the function should fulfill a **clear objective**

### Types
| Tool             | Description                                                         |
| ---------------- | ------------------------------------------------------------------- |
| Web Search       | Allows the agent to fetch up-to-date information from the internet. |
| Image Generation | Creates images based on text descriptions.                          |
| Retrieval        | Retrieves information from an external source.                      |
| API Interface    | Interacts with an external API (GitHub, YouTube, Spotify, etc.).    |

**Scenarios for tool use**
- Require better results than native capabilities of the model
- Requires up-to-date data

 **A Tool should contain:**
	- A **textual description of what the function does**.
	- A _Callable_ (something to perform an action).
	- _Arguments_ with typings.
	- (Optional) Outputs with typings.

### How do tools work?
- Provide tool for LLM
- LLM decides from user query whether to uses tools given and returns a call to the tool
- Agent reads the response, identifies that a tool call is require, execute the tool on LLM's behalf, retrieves the data and sends it to the LLM
- LLM takes this extra context and generates a natural-sounding response for the user

## MCP
An open standard that enables developers to build secure, two-way connections between their data sources and AI-powered tools. 

Devs can either:
- Expose their data through MCP servers
- Build AI applications (MCP clients) that connect to these servers

![[Screenshot 2025-11-02 at 12.51.10 PM.png]]