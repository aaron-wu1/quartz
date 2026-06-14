---
date: 2026-02-18
tags:
title: autotemplate
---
Ref: 
- https://martinfowler.com/articles/patterns-of-distributed-systems/two-phase-commit.html
- https://en.wikipedia.org/wiki/Two-phase_commit_protocol

## Usage
When data needs to be atomically stored on multiple nodes.
## Steps
1. Prepare phase asks if other node is ready to commit and promises to commit
2. Commit phase where both nodes store the data.

If any node is ready, the transaction is aborted.

## Visual
![[Pasted image 20260218150028.png]]
## Disadvantage
It's a blocking protocol which means it's slow. Needs to wait for all participants to respond with prepared to commit.



