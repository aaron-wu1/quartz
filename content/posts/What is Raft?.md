---
date: 2025-01-20
tags:
- distributed-systems
title: What is Raft?
---

## Background
Raft is a [[Consensus (distributed sys)|consensus]] algorithm designed to improve the reliability and fault tolerance of distributed systems. It's used as a consensus module for building replicated state machines. It utilizes a leader and follower model to maintain state.

Traditional consensus algorithms like Paxos, utilizes a voting mechanism to determine the outcome of the cluster. These algorithms are complex and the designers of Raft aimed to find a simpler approach to identify consensus.

Key idea here when thinking about how everything ties together is to keep in mind, these nodes/servers are communicating over network. Network conditions all apply here, like trying to talk to someone in a chat room, there can be time differences, latency, dropout, etc.

## How Raft works
Terms to be familiar with:
- **Leader**: The node that defines the state for all nodes in the cluster
- **Term**: The period in which a node is a leader
- **Log**: A list of all the changes made by nodes in the cluster, strictly ordered. Nodes with longest logs have the most recent data
- **Term number**: determines temporality of data, division of time 

## Why Leaders?
In simple terms, it's a lot easier to reason about. It's more intuitive to have a leader determine the state of the group/cluster. 
More details:
- Simple decomposition of state: 
	- **Leader election**: When a leader node becomes unavailable, a new leader election process is initiated
	- **Normal operation**: Nodes are communicating with leader to commit requests, 1 leader, N-1 followers
- Simplifies normal operations, just ask leader for state

## Server States
- **Leader**: handles all client interactions and source of truth for most up-to-date log state
- **Follower**: completely passive (does not initiate any actions of it's own), responds to RPCs calls from leaders and candidates
- **Candidate**: used to elect a new leader, potential leader for next term

## RPC OPs:
- **AppendEntries**()
	- The leader uses this to "push" new operations to replicated state machine
	- Also used by the leader to notify other nodes that it's the leader
- **RequestVote()**
	- Used in three cases:
		- when the system starts up to select leader
		- when the leader fails to select leader
		- when the leader is unreachable
## Raft Overview
1. **Leader election**: One of the nodes is selected to act as the leader of the cluster. Must adhere to these [[#Election Properties|election properties]].
	1. A node is selected to be a candidate, if it can't reach a leader within a timeout period and increments it's current term.
	2. It then notifies other nodes that itself should be a leader and polls for votes with **RequestVote()**
	3. Other follower nodes submit their vote according to [[#Safe Voting Decisions|voting decisions]]
	4. If it receives a majority of votes from all the nodes in the cluster, then it becomes the leader. 
	5. Elif, there is a split vote among the candidates, start new election. More on [[#Liveness|timeout here]]
	6. Elif, it either runs another poll to other nodes or a newer(higher term) candidate takes over. If another node timed out.
	7. Else, receives a RPC from a valid leader, turn to follower state
2. **Log replication**: The new leader node replicates the current log entries from its peers to ensure that all nodes have the same version of the log. This is **normal operation**. See more at [[#Log replication|log replication]].
3. **Heartbeats**: Each node sends periodic "heartbeats" to indicate its presence and readiness for leadership
4. **Term transition**: When a node receives multiple heartbeats, it knows that the previous leader has been unavailable for more than the configured term duration. This triggers a new term, and the node becomes the new leader.

## Additional Details 
### Election Properties
- **Safety**: allow at most one winner per term
	- each server votes only once per term (persists on disk)
	- two difference candidates can't get majorities in the same term
- **Liveness**: some candidate must eventually win
	- Each choose election timeouts randomly
	- One usually initiates and wins elections before others start
	- Timeout > network round trip time
### Safe Voting Decisions
Servers only vote for a candidate if:
- It's their first vote for the term (persistent on disk)
- If the candidate's term is higher than it's own
- If candidate's term is the same, it must have a longer or equal log length

### Liveness 
Check the health of nodes
- Severs start as followers
- Leaders send out **heartbeats** (empty **AppendEntries** RPCs) to maintain authority
- If **electionTimeout** elapses with no RPCs, follower assumes that leader has crashed and starts new election
	- Nodes are set with randomized timeouts to prevent looping of state

### Log Replication
The replication of state across cluster.

#### Log Structure
Array of log entries that are structured as:
- Log idx
- Term
- Command
Logs are stored on stable storage to survive crashes
An entry is **committed** iif it's known to be stored on majority of servers

#### Log Operations Properties 
- **highly coherent**
	- log entries on different servers have the same index and term will have these properties:
		- Store the same command
		- if given entry is committed, logs are identical in all preceding entries
- **consistent check**
	- append entries has <idx, term> of entry preceding new ones
	- follower must contain matching entry; otherwise rejects
	- implements induction step to ensure coherency, follower shifts it's log back to position that matches leader
	- cannot commit any new changes unless all entries prior matches the leader


#### Entry Commit Check (TODO)
#### Leader Changes (TODO)

*TODO add some images*