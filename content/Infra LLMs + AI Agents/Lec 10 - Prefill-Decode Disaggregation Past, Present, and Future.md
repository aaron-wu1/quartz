---
date: 2025-10-20
tags:
---
## Batching Prefill and Decode Together Cause Interference![[Screenshot 2025-10-20 at 9.15.26 AM.png]]
![[Screenshot 2025-10-20 at 9.16.37 AM.png]]


## Resource and Parallelism Coupling

## Challenges
1. Prefill and decode interference
2. Resource and Parallelism Coupling

## Solution
- Put prefill and decode on different workers

![[Screenshot 2025-10-20 at 9.22.03 AM.png]]

## DistServe - Parallelism Strategy
![[Screenshot 2025-10-20 at 9.25.20 AM.png]]