---
date: 2025-11-22
tags:
- distributed-systems
- concurrency
- performance
- security
- storage
- ai
title: Amazon Bedrock AgentCore
---

## Summary

Amazon Bedrock AgentCore is a platform for deploying and operating AI agents at scale. It handles infrastructure and security while letting developers control over the agent's logic. The goal to abstract away the complexity of AI at scale and let developers focus on developing agents for their domain.

## Questions
1. Can you think of some new challenges or opportunities when serving agents in a serverless way from traditional serverless services like AWS Lambda?

Agents require context and sometimes session state. Typically in serverless models like AWS Lambda, its best suited for stateless tasks which Agents are not. The opportunities could be that agents can have bursty tasks. With a serverless model, horizontally scaling is a natural solution to handle bursty tasks that agents incur.

2. What do you think are the key requirements for agent hosting?

The key requirements for agent hosting is a low-latency and persistent state. Low latency is important for fast access to context and tool calls. Persistent state is important for maintaining coherency throughout the agent's lifetime.