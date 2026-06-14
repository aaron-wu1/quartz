---
date: 2025-10-07
tags: 
---
Source: https://dl.acm.org/doi/pdf/10.1145/775265.775268

## Introduction
Protection is a general term for all mechanisms which control the access of a program to other things in the system.

**Motivation**
- Originally keep user's malice or error from harming other users
	- harm = 
		- by destroying or modifying another user's data; 
		- by reading or copying another user's data without permission
		- by degrading the service another user gets, e.g. using up all the disk space or getting more than a fair share of the processing time. 
- Now it's not just user, but programs. Two main directions to enforce protections
	- enforcing the rules of modular programming, to guarantee that errors in one module will not affect another
	- support of proprietary programs, so that a user can buy a service in the form of a program to call but not read

## Protection Domains
Different protection environments or contexts and depending on the context the process is in, it has different permissions.

"What rights I have right now"
- eg. sudo switching to root domain or process doing a syscall (user to kernel)

**implementation**
- message system - processes share nothing and communicate with each other by means of messages. Each message contains an identification of the sending process and data. The id is supplied by the system to prevent forgery
	- Each process is it's own domain and can choose what to send out
	- inefficient
	- Issues:
		- impossible to retain control over a runaway process, nothing to force a process to do anything
		- elaborate system of conventions is required to get processes to cooperate
			- need other processes to agree on identification and interpretation of messages
## Objects and Access Matrices
- To provide apis for controlling processes from the outside, need to differentiate of controlling access to one process from the other.
- Simple way: Access to processes can be defined by a tree structure 
- Paper proposed way:  object system
	- set of objects, X
	- set of domains, D
	- access matrix or access functions, A
- Now objects can be shared between domains
	- each domain owning objects agrees by convention that it will do certain things with these objects upon demand from some other domain
	- access rules below will be enforced by the underlying machinery which implements the system
- Domains are objects and that objects do not 'live in' or 'belong to ' domains, not 1:1 anymore
- Element *A \[i, j\]* specifices the access which domain *i* has to object *j*
- Each element consists of a set of strings called access attributes
	- R/W/wake up
	- A domain has 'x' access to an object if 'x' is one of the attributes in that element A
	- copy flag: attached to each attribute, controls the transfer of access. Which attributes can other domains copy from, guessing typically not "owner"
		- Justification: if no copy flag, there's nothing stopping a domain from giving up all access to objects
- Entries in the access matrix are made and deleted according to certain rules.
	- domain $d_1$ can modify the list of access attributes for domain $d_2$ and object $x$ as follows:
		- $d_1$ can remove access attributes from $A [d_2,x]$ if it has 'control' access to $d_2$
		- $d_1$ can copy to $A[d_2,x]$ any access attributes it has for $x$ which have the copy flag set, and say whether the copied attribute shall have the copy flag set or not
		- $d_1$ can add any access attributes to $A[d2,x]$, with or without the copy flag, if it has 'owner' access to $x$.

 In modern systems, the idea survives in two forms:
- Access Control Lists - store by column, per object list of who can access
	- object defines access
	- object owner manages this list
- Capabilities - store by row (per domain list of what it can access)
	- domain defines access
	- each domain has collection of capability tokens that grant access to specific objects, think bearer tokens
	- makes decentralized authorization possible(authority can be safely delegated and verified locally, without global visibility)
		- no need for global ACLs

Differentiation between protection mechanism and policy
- Mechanism should be general and flexible and not tied to any specific one policy. 
- Eg. In AWS IAM, the mechanism is the JSON policy eval machine. The policy is whatever JSON rules you write, changes per configuration and pluggable
## Some Implementation Techniques
- Impractical to use global table t
	- memory protection provided by hardware which does not use T
	- inconvenient to keep all of T in fast-access memory
	- object and/or domains may be grouped where T is wasteful of storage, sparsity
	- obtain a list of the objects which a given domain d can access or at least the objects for which d is responsible or is paying for
- Another approach is connecting protection information to the object rather than the domain
	- "access lock list" for the object - list of access values per object
## Memory protection
- Memory protection HW is usually closely related to mapping or relocation hardware
	- memory which is not in the range of the map cannot be named and is therefore protected
	- in paged or segmented systems, each page or segment in the map has protection information associated with it.