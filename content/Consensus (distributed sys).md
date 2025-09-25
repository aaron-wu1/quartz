---
title: "Consensus (distributed sys)"
date: "2025-09-25"
---
## Definition
Fulfills two conditions:
1. agreement on shared state
2. recovers from server failures autonomously

## Use case
To build a **replicated state machine**

replicated state machine is where:
- all servers execute the same commands in the same order
- uses replicated log to do so
- **consensus module** ensures proper log replication