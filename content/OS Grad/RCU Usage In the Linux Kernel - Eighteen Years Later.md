---
date: 2025-11-29
tags:
- concurrency
- operating-systems
- performance
title: RCU Usage In the Linux Kernel - Eighteen Years Later
---

## Issues that RCU solves
- Concurrent reads even on updates
- Low overhead in both memory and execution time
- Deterministic completion time
	- Important for real-time response and software engineering

## Other synchronization primitives and their tradeoffs
- Spin lock
	- Readers are blocked by other readers
- Read/Write locks 
	- not scalable due to overhead of maintaining locks
	- But readers can skip locks
	- implemented by
		- reader count lock
		- and writer lock

## What is RCU?
Read-Copy-Update, a scalable high performance synchronization mechanism implemented in Linux kernel

Two primitives:
- Readers access data structures within *RCU read-side critical sections*
- Updaters use *RCU synchronization* to wait for all pre-existing RCU read-side critical sections to complete