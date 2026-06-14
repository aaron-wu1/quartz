---
date: 2026-01-21
tags:
title: C1 - Introduction
---
## Shared Objects
Runs into collision issues, how can access to share objects be *mutually exclusive*.

## Coordination Problems as Physics Problems
Coordination problems (such as mutual exclusion) modeled as real life problems.

*Coordination protocol* - procedures to decide what to do.
How can we *prove* coordination protocols are correct? 

Properties to consider:
- *Mutual Exclusion*
- *Deadlock-freedom* - no deadlocks
- *starvation-freedom* - no lockouts
- *Waiting* - are nodes forced to wait, sequential ordering?
- *Fault-tolerance*

## Communications in Concurrent Systems
Two main kinds:
- *Transient* communication requires both parties to participate at the same time
	- eg. Shouting, gestures, or cell phone calls
- *Persistent* communication allow the sender and receiver to participate at different times.
	- eg. Posting letters, sending email, or leaving notes under rocks.

To get another thread attention in OSes, a common way is to use *interrupts*. The issues with interrupts is it can end up in a *livelock* where more time is spent processing interrupts rather than the expected work.

## Producer-Consumer Problem