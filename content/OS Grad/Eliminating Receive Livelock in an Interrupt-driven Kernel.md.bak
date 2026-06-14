---
date: 2025-11-13
tags:
  - OS
---
## Background
The key tradeoff discussed in network stacks that this paper discusses is:

**Should I/O events be handled via interrupts or via polling?**

Also tackles the challenge of *maintaining good performance even when the system is operating at full capacity*

Linux's network stack uses an approach called NAPI that was inspired by this paper


## Abstract
Most OS uses interrupts to schedule
- provides low overhead 
- good latency at low offered load
- But degrades at higher rates
*Receive livelock* - issue where the system spends all its time processing interrupts, to the exclusion of other necessary tasks

To avoid livelock and related problems an operating system must schedule network interrupt handling carefully
- The paper modifies an interrupt-driven networking implementation to eliminate receive livelock without degrading other aspects of system performance

## Goals
- Understand and characterize livelock
- Define what "good" behavior under overload looks like
- Design scheduling mechanism that avoid receive livelock

## Introduction
**Polling vs Interrupts**
- Interrupts are useful because they allow the CPU to spend most of its time doing useful processing, yet respond quickly to events without constantly having to poll for event arrivals
- Polling is expensive, especially when I/O events are relatively rare, as is the case with disks, which seldom interrupt more than a few hundred times per second. Polling can also increase the latency of response to an event.

## Requirements in Networks
Consider:
- Throughput - rate at which system deliver packets to their ultimate consumers
- *Maximum Lost Free Receive Rate (MLFRR)* - the point of offer load that the system could maintain a the maximum throughput

## Interrupt-driven scheduling and its consequences
Three kinds of problems caused by network input overload:
- *Receive livelocks* under overload
	- Delivered throughput drops to zero while the input overload persists
- Increase *latency* for packet delivery or forwarding
	- The system delays the delivery of one packet while it processes the interrupts for subsequent packets, possibly of a burst
	- link-level processing of entire burst before any higher-layer processing of the first packet
- *Starvation* of packet transmission
	- Even if the CPU keeps up with the input load, strict priority assignments may prevent it from transmitting any packets
	- *Transmission starvation* - when packets are awaiting transmission, but the transmitting interface is idle

### interrupt-driven systems
- Under heavy loads of incoming packets, the network device driver attempt to *batch* interrupts
	- Amortizes the cost of processing an interrupt over several packets

## Avoiding livelock through better Scheduling
### Limiting interrupt arrival rate
- When a system is about to drop a received packet because internal queue is full - **should disable input interrupts**
	- Allows the host to make process on the packets already queued
	- Need to then re-enable interrupts to prevent unnecessary packet loss
### Polling
Limiting the interrupt rate prevents system saturation but might not guarantee progress; the system must also fairly allocate packet-handling resources between input and output processing
- **Can provide fairness by carefully polling all sources of packet events, using a round-robin schedule**

Purely interrupt-driven system leads to livelock
Purely polling system leads to unnecessary latency
Hence, the paper proposes a hybrid design:
- During low loads, use interrupts
- During high loads, use polling

### Avoid Preemption
Making higher-level packet processing non-preemptable





