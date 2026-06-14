---
date: 2025-11-17
tags:
- operating-systems
- performance
- concurrency
- virtualization
- computer-architecture
title: Snap - a microkernel approach to host networking
---

source: https://dl.acm.org/doi/abs/10.1145/3341301.3359657

## Abstract
Snap - microkernel-inspired approach to host networking called Snap.
- Userspace networking system
- Snap enables fast development and deployment of new networking features

## Goal
- Performance - high performance networking system in userspace
- Dev experience - able to develop networking system without needing kernel devs or bundling with app devs
## Background
- Intuition:
	- needs with kernel-based networking was hampered by lengthy dev and release cycles
	- Move networking functionality out of the kernel and into userspace modules through a common framework -> Snap
- Snap Components
	- Dataplane interaction occurs over custom interfaces that communicate via lock-free shared memory queues
	- *Pony Express* - new communication stack that implements a custom reliable transport and communications API
	- Architecture:
		- Composition of recent ideas in userspace networking, in-service upgrades, centralized resource accounting, programmable packet processing, kernel-bypass RDMA functionality, and optimized co-design of transport, congestion control and routing
			- **High rate of feature development with microkernel-inspired approach of developing in userspace with transparent software upgrades**
			- **custom kernel packet injection driver and custom CPU scheduler that enable interoperability without requiring adoption of new application runtimes
				- Interoperability between kernel function and application thread schedulers
			- **Encapsulates packet processing functions into composable units called "engines", which enables modular CPU scheduling, and incremental and minimally disruptive state transfer during upgrades**
			- **Minimizes I/O** by tuning Snap and Pony Express transport
				- 3x better transport processing efficiency than baseline Linux kernel

## Snap as a Microkernel Service
Snap implements host networking functionality as an ordinary Linux userspace process.

![[Screenshot 2025-11-17 at 3.06.25 PM.png]]
Note: Snap differs from [[IX - A Protected Dataplane Operating System forHigh Throughput and Low Latency|library OS approach]] to networking with shared memory queues to communicate interprocess and separating network from app in user-level

Benefits:
- Decouples release of networking functionality from both kernel and application binary release cycles
- Decouples application threading and CPU provisioning from network services. This enables managing networking latency and spin-polling capability as a system-level resource
	- Scale network module independently of application

### Snap Architecture Overview
![[Screenshot 2025-11-17 at 3.13.48 PM.png]]
- *Engines* - unit of encapsulation for data plane operations
	- ex:
		- packet processing for network virtualization
		- pacing and rate limiting for bandwidth enforcement
		- stateful network transport
- Control plane and data plane interact through specialized uni-directional RPC called *engine mailbox*

### Engine Design
Engines are stateful, single-threaded tasks that are scheduled and run by a Snap engine scheduling runtime
- never blocks, never waits, never mutexes

### Modules and Control-to-Engine Communication
Snap modules are responsible for setting up control plane RPC services, instantiating engines, loading them into engine groups, and proxying al user setup interactions for those engines.
- Control components synchronize with engines lock-free through an *engine mailbox*
	- Mailbox is a queue of depth 1 on which control components post short sections for work for synchronous execution by an engine, on the thread of the engine, and in a manner that is non-blocking with respect to the engine.

### Engine Groups and CPU scheduling
Bundles engines into groups with a specific scheduling *mode* which dictates a scheduling algorithm and CPU resource constraints. Called *engine groups*

**Modes:**
- **Dedicating cores**
	- Engines are pinned to dedicated hyperthreads on which no other work can run
- **Spreading engines**
	- Scales CPU consumption in proportion to load, with focus on minimizing scheduling tail latency
- **Compacting engines**
	- Collapses work onto as few cores as possible, combining the scaling advantages of interrupt-driven execution with the cache-efficiency advantages of dedicating cores
![[Screenshot 2025-11-17 at 3.36.34 PM.png]]

### MicroQuanta Kernel Scheduling Class
Snap uses *MicroQuanta*, new lightweight kernel scheduling class, to dynamically scale CPU resources
- MicroQuanta provides a flexible way to share cores between latency-sensitive Snap engine tasks and other tasks
- Makes sure Snap wake threads immediately
- Each Snap engine gets a guaranteed budgeted variable time slice
	- Weighted fair queueing
- Used to allow Snap engines to run with real-time-like latency without starving the rest of the system

## Pony Express: A Snap Transport
Reliable transport and communications stack

![[Screenshot 2025-11-17 at 4.08.44 PM.png]]
- When an application wishes to invoke an operation, it writes a command into the command queue. Application threads can then either spin-poll the completion queue, or can request to receive a thread notification when a completion is written.
	- Non blocking to application

## Transparent Upgrades
Snap Upgrades
![[Screenshot 2025-11-17 at 4.19.57 PM.png]]
- Ability to release new versions of Snap without disrupting running applications
	- Afford developers maximum flexibility in making substantial changes between releases
- Upgrade is two-phased to minimize *blackout* period (network stack is unavaliable)
	- Initial *brownout* phase performs a preparatory background transfer that has minimal perf impact
	- Running version of Snap serializes all state to an intermediate format stored in memory and shared with new version
- Target blackout period - 200ms or less!
- Steps:
	- Snap "master" daemon launches second instance of Snap
	- Old Snap connects to new Snap
	- Old Snap cuts out control plane Unix socket connections and transfer them in the background along with shared emmory file descriptor handles
	- New Snap reestablishes shared memory mappings and initiates structures
	- Once that's done, old engines begins blackout period by ceasing packet processing, detaching NIC receive filters and serializing state.
	- New engines attach to NIC filters and deserialize states
	- Once all engines are transferred this way, old Snap is terminated