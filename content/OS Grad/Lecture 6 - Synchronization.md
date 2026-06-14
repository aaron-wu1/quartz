---
date: 2025-10-14
tags:
- operating-systems
- concurrency
- programing-language
title: Lecture 6 - Synchronization
---

## Monitors
Process ~ thread

```
Monitor {
	private data
	A() { <- acquire inserted by compiler
	...
	wait
	...
	} <- release inserted by compiler 
	B() {
	...
	signal
	..
	}
	C() {
	...
	}
}
```
- Only one thread can execute in the monitor at once
	- How? Monitor provides mutual exclusion, compiler inserts calls to acquire and release (lock)

### 2 main uses for synchronization
- Mutual exclusion (1 at a time)
- coordination (order of when to run)
**Producer and Consumer** - example of coordination
Imagine if we had a pool of resources that we want to share among threads
![[Producer Consumer]]

### Condition variables
- Goal: allow threads inside a monitor to wait
- **wait** - suspend the thread, releases the lock
- **signal** - wakes up a waiting thread, thread reacquires the lock (lock to monitor)

### Hoare vs Mesa Semantics
#### Hoare Semantics
- wait - puts the thread on a queue
- signal - wake up a waiter, context switch to it
![[Hoare Semantics for Monitors]]

*Invariant I* - consistency of data structures managed by the monitor 
- data structures might not be in a consistent state
- when you exit the monitor, it has to all be in a consistent state (need to restore the invariant)
- when can a program leave the monitor?
	- exit
	- wait
	- signal
- Assume I is true:
	- when you can enter the monitor
	- return from wait or signal
*Condition B* - the situation that the waiter is waiting for change
	- different from condition variable (primitive for synchronization), condition B - abstract idea of what's blocking the waiter
	- when can we assume that the condition is true?
		- thread returns from wait
		- when a thread calls signal

Invariant:

| Before         | op     | After          |
| -------------- | ------ | -------------- |
| Invariant True | wait   | Invariant True |
| Invariant True | signal | Invariant True |
|                |        |                |
| Before         | op     | After          |
|                | wait   | B True         |
| B True         | signal |                |
Note:
- before signal waiter is waiting to be signaled
- after calling wait, waiter should be waiting
- B = isWaiting

## Mesa Semantics
- Weakens the semantics, from Hoarce
- wait - puts the thread on a queue (same)
- signal (notify) - puts the thread on the runnable queue, continues running 

![[Mesa Lamport]]
### Mesa Semantics Differences from Horace
- When we return from wait the condition might not be true anymore

**Horace Semantics:**
```
if (!condition)
wait
```

**Mesa semantics:**
```
while (!condition)
wait
```

What we know to be true:

| Before           | op     | After           |
| ---------------- | ------ | --------------- |
| Invariant True   | wait   | Invariant True  |
|                  | signal |                 |
|                  |        |                 |
| Before condition | op     | After condition |
|                  | wait   |                 |
|                  | signal |                 |
- The signal will check is it possible to wake up a thread or not, so the condition doesn't necessarily need to be true
- Condition doesn't necessarily have to be true with wait because other threads might have ran while waiting.
- When you leave the monitor you need to restore the state, that's why wait has Invariant True before and after.

### Semaphores vs Monitors
Hoare established that they are equivalent. Hoare establish that you can implement both with each other 

## Mesa
Types of methods:
- entry - entering monitor
- internal - modifies state
- external - don't modify state

|                     | Hoare                                               | Mesa                                                              | Java                                                                                                                                                                |
| ------------------- | --------------------------------------------------- | ----------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Monitor lock        | All methods                                         | entry methods                                                     | synchronized keyword <br>(it will behave like a monitor method)                                                                                                     |
| condition variables | explicit                                            | explicit                                                          | implicit CVs<br>(associated with the class itself)<br>explicit CVs                                                                                                  |
| wait                | Hoare Semantics<br>(if cond)                        | Mesa Semantics <br>(while cond)                                   | Mesa Semantics<br>(while cond)                                                                                                                                      |
| signal              | Hoare Semantics                                     | Mesa Semantics<br>(notify, broadcast)                             | Mesa Semantics<br>(notify, notifyAll)                                                                                                                               |
| graunlarity         | coarse (like entire file systems, big chunks of os) | monitor record (more fine grained)                                | multiple different granularities<br>(static methods that are synchronized, non static methods with synchronized keyword, or synchronized keyword for block of code) |
| abort               | ? didn't consider                                   | unwind handler<br>(restore data structures to a consistent state) | exception handlers                                                                                                                                                  |
| nesting             | ? didn't consider                                   | let first call hold lock                                          | similar (let programmer decide)                                                                                                                                     |
Broadcast will not be possible with Hoare Semantics because the process will need to context switch between locks/monitors
Nesting: Mesa Semantics let programmer decide
![[Nesting Monitors]]

### Trends over time
Hoare and Mesa 
- rely on compiler support 
Java 
- compiler support - implicit CVs, using synchronize
- programmer-managed locks with explicit CVs
C++, Rust, Python
- no monitors
- but do have CVs and locks
- programmer must acquire locks
	- but compiler can handle release
		- makes it easy for programmer if you had a function that exits in many different ways and you want to make sure that a release is conducted

## Summary
- language support for synchronization with monitors
- Hoare vs Mesa Semantics
- Practical Challenges
	- aborts, nesting etc.