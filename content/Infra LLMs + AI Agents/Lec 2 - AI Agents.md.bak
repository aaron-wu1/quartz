---
date: 2025-09-29
tags:
  - "#operating-systems"
  - "#file-system"
  - "#artificial-intelligence"
  - "#machine-learning"
  - ai-agents
---
## AI Agents

TODO

## Multi-agent system
LLM agents can interact with each other in a collaborative or competitive manner. This enables them to achieve adcancement through teamwork or adversarial interactions. 

In these system, agents can work together to...


## Human-Agent Cooperation
LLM agents can *interact with humans*, providing them with assistance and performing tasks more efficiently and safely

Humans to verify and correct agent

## Agent-to-Agent (A2A) Protocol
- A protocol enabling standardized communication across agents
	- Support agents using different frameworks to communicate
	- A client (local) agent can discover agents by fetching "Agent Card" of available remote agents
	- And then delegate a task to the chosen remote agent
- Supports streaming and asynchronous push notifications for long tasks

## What is LLM Agents
**Planning**: (TODO)
 - 


## MCP (Model Context Protocol)
- Connecting (N) LLMs to (M) external tools/resources to be a NxM problem
- MCP standardizes the LLM-tool communication into N->1->M process
- Build with a client-server model
	- MCP client: the agent that needs to call tool/data
	- MCP server: a service to expose external tools and data sources

## AI Agent/Workflow Frameworks
- Frameworks initially proposed to standardize AI workflows, provide some out-of-box design patterns and abstractions
- Some examples
	- LangChain
	- LlamaIndex: Good RAG support
	- CrewAI and Camel: multi-agent framework for more complex tasks
- But a lot of necessary, adding complexity for agents, harder to customize
- Prof opinion for most tasks today:
	- No framework (pure Python)
	- No MCP (can just write your own functions or hooks)
		- if low amount of tools
	- No A2A (no need for multi-agents)
	- Why? 
		- LLMs are so good that you don't need human made processes
		- If you give LLMs enough tools, it's usually sufficient
		- Focus on prompts, templates from open source

## What is AI Agent Infra?
- Agent testing and evaluation
	- Unit + e2e test, metrics, benchmarks, human-in-the-loop
- Agent autotuning and optimization
	- Automated prompt tuning, model selection, tool selection, workflow optimization
- Agent hosting
	- serverless or long-running?
	- stateful or stateless
- tooling, memory and data
- monitoring and observability