---
date: 2025-10-25
tags:
- computer-architecture
- performance
- concurrency
title: Tomasulo’s algorithm
---

## Problem Tomasulo Solves
consider
```text
1. F1 = F2 + F3
2. F4 = F1 * F5   ← depends on #1
3. F6 = F7 + F8   ← independent, but stuck waiting!

```
In an in-order pipeline, instruction 3 can't start until #1 finishes. **Waste of parallelism**

Tomasulo's algorithm solves this by **allowing out-of-order execution**: instructions issue as soon as their operands are ready, not when earlier ones finish
- Works because the executed instructions are *not dependent*

## Key components
| Component                                    | What it does                                                                                                        |
| -------------------------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| **Reservation stations**                     | Small buffers in front of each functional unit that hold pending instructions. They track which operands are ready. |
| **Register renaming**                        | Eliminates _name dependencies_ (WAR, WAW) by giving each new result a unique tag rather than a fixed register.      |
| **Common Data Bus (CDB)**                    | Broadcasts computed results to all waiting stations — anyone who needs that value wakes up immediately.             |
| **Reorder buffer** (added in later variants) | Lets results commit in program order, maintaining precise exceptions.                                               |
## Flow
- **Issue** – When decoded, an instruction gets a reservation station.  
    If operands are ready → stored as values; if not → stored as _tags_ of the producing instructions.
- **Execute** – Once all operands arrive, the instruction begins execution.
- **Write result** – When it finishes, it broadcasts its value on the common data bus.  
    Any reservation station waiting on that tag grabs the value and can now execute.
- **Commit** – Finally, results are written to the architectural register file in order.