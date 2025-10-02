---
date: 2025-05-29
tags:
---
## 1. Round Robin
Distributes requests in a cyclic order
### Pros
- Equal distribution
- Easy to understand
- Works well when servers have similar capacities
### Cons 
- No load awareness
- No session affinity
- Performance issues with different capacities
- Predictable distribution pattern (security issue)

### Use Cases
- Homogenous Environments: servers have similar capacity and performance that allows for round robin to be efficient
- Stateless Apps: round robin doesn't support sessions

## 2. Least Connections
Assigns incoming requests to the server with the fewest active connections. Ensures more balanced distribution.

### Pros
- Load awareness
- Dynamic distribution
	- Adapts to traffic
- Efficiency in heterogenous environments
	- Performs well when servers have varying capacities and performaces

### Cons
- Higher complexity
- Requires state of server connections -> overhead
- Requires rebalancing with bursty data

### Use Cases
- Heterogenous Environments
- Variable traffic patterns
- Stateful operations