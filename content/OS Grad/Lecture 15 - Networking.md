---
date: 2025-11-13
tags:
---
## RPC 
Network communication -> cast as a procedure call
### Goals
- Identical semantics as local procedure calls
	- example: timeouts
- efficiency - computation time on CPUs, # of messages
- security 
- high performance - small requests
- generality

![[RPC Flow]]

### RPC Example
- add 2 integers
![[RPC example add 2 ints]]
- supports many data types
	- marshaling, serializing - turning structured data into a buffer
- layer of indirection
	- format of buffer can be totally different from what the application is
	- as long as the client and server agree on the format of the message, this means that we can support different languages or architectures

### Optimizations in the RPC Runtime
- Transport protocol
	- piggyback ACKs with data
	- simple call vs complicated
	- ![[RPC Simple vs Complicated calls]]
- Processes
	- maintains pool of idle server processes
	- dispatch
	- many processes executing in parallel
	- process hints, response to client give hint for client to showcase which process can handle it
- Connections
	- trying to avoid **fanout**, (eg. one client to many servers)
	- no setup, no teardown (JUST send it)
		- need binding step beforehand

### Binding
- servers export, clients import interface
- Grapevine
	- client talk to grapevine to figure out how to communicate with server
- binding at runtime
	- local procedure calls would be in compile time

**Exceptions, errors**
 - Either the server or network fail independently of local machine

### Adoption
- IoT
- Datacenter applications
	- Google: gRPC
	- Meta: Apache Thrift
- Secure enclaves
- Browsers - HTTP

### Summary of RPC
- RPC make remote functionality look like local functionality
- Stubs, binding
- Performance optimizations

## Receive Livelock
### Motivated by
Applications:
- Network monitoring - passive
- packet processing in software - routing, firewall, VPNs, load balancers
- Network services - file server, web servers, DNS

Challenges
- high rates of request
- Traffic might not be rate controlled 
Easy for system to get overloaded


### Network Stack
![[Network Stack]]
Why multiple queues?
- Queues absorb temporary bursts, different apps have different runtimes
- Separate control over parts of the stack

### Receive Livelock
- overloaded -> system spending all of its time handling interrupts
	- throughput collapses
![[Livelock graph]]

### Polling
- software periodically checks if packet has arrived


| Polling                                                                    | Interrupt                                           |
| -------------------------------------------------------------------------- | --------------------------------------------------- |
| Con: can add overhead if too frequent                                      | cons: trigger receive livelock                      |
| pro: control over I/O processing<br>- fairness<br>- efficient at high load | cons: overhead from context switches                |
| con: can have high latency                                                 | cons: vulnerable to side-channel attacks (patterns) |
| con: could drop packets unnecessarily                                      | pros: work is proportional to packet arrival        |
| con: choose parameters, policies                                           |                                                     |
Polling -> best for high load
Interrupt -> best for low load and unpredictability

### Solutions
- hybrid approach: interrupts and polling
- reserve CPU time for applications
- drop packets early
- remove a layer of queuing
- round robin scheduling

### Summary of Receive Livelock
- Introduces receive livelock
- hybrid approach - polling and interrupts
- when system is overloaded drop packets as early as possible