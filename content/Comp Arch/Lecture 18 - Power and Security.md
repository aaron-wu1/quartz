---
date: 2025-12-04
tags:
- security
- computer-architecture
- caching
- performance
title: Lecture 18 - Power and Security
---

## Power-Aware Architecture

### Background
- CMOS circuits were designed to only dissipate power when they switch values.
- That's no longer completely true, but dynamic (switching) power still dominates static (leakage) power


DVFS, clock gating and power gating


## Security

### Prime and probe
- side channel attack, check when mem user access
- assume shared cache, but no shared memory
- works by observing conflicts in particular set (or sets) of cache
	- fill a set with data
	- user access mem, kicks out set
	- count cycles to read blocks set
		- if same, all blocks still in set
		- else a miss due to user block eviction

### Flush and Reload
 - Assume you have access to some read-shared memory
 1. Attacker flushes A from cache  
 2. Victim conditionally reads A  
 3. Attacker reads A, speed determines hit or miss in shared cache, and thus reveals condition.

### Defenses
- Flush all the cache
- Partition the cache
- No real solution that has minimal defenses

### Transient Execution Attacks
Speculation or transient attacks
- Meltdown and Spectre
- Basic problems:
	- If you can influence control flow of another domain (eg kernel), you have control of what data is touched
	- Speculative execution is not subject to usual memory protections
#### Spectre v1
- ![[Screenshot 2025-12-04 at 2.58.23 PM.png]]
- If x is large enough, can execute any part in memory

`<TODO> what is constant time programming?`

- fix:
	- put a fence before a potentially vurnable load in kernel
#### Spectre v2
- BTB track past jump destinations
- Processor predicts based on BTB and executes speculatively
- More freedom for the attacker - billions of possible destinations

### Meltdown
- read speculative data illegally
- more a bug, Spectre downfall of speculation

`<virtual caches tradeoffs>`