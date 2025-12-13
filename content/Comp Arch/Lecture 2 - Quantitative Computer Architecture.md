---
date: 2025-09-30
tags: 
---
## Idea
How to measure, analyze, and specify computer system performance

## Performance Measurement and Analysis in Computer Architecture
![[Screenshot 2025-09-30 at 2.07.20 PM.png]]
State diagram of the iterative development lifecycle in computer architecture

## Performance
### What is Performance?
Metrics:
- Execution time (**main metric**)
- Throughput
- Of what input/program?
- What is relative performance? (against baseline)

### What is Execution Time?

```
% time program  
... program results ...  
160.7u 19.9s 4:15 71%  
%
```
Explanation of numbers in order: `u = user CPU time, s = system CPU time, wall-clock time (actual real world time that passes), percent of CPU time`
- Why is wall clock time not matching CPU time?
	- I/O, Swaps

### Relative Performance
Most of the time in computer arch, we refer to relative performance because it provides more value to the end user than an absolute time. With absolute time, there's no baseline to know whether if the time is fast or not.

Definition:
$$ Relative Performace = \frac{Performace_x}{Performance_y}= \frac{Execution Time_y}{Execution Time_x} = n $$


### How to Specify Performance?
With relative performance, performance metrics only has meaning in the context of a program or workload. What about performance of a single machine?
- Response Time or Throughput

### SPEC: System Performance Evaluation Cooperative
Defines workloads to benchmark performance and evaluate performance

### How to Summarize Performance
You get a bunch of speedup numbers from SPEC, what is the single number that your boss wants

Tools:
- Arithmetic Mean - "Total time if ran all at once"
- Weighted Arithmetic Mean - "with weights on programs"
- Geometric Mean - "Typical speedup across programs"
- Harmonic Mean - "average rate of progress"
![[Screenshot 2025-10-01 at 2.30.23 PM.png]]

**Summary of Performance**
 - Even the unweighted arithmetic mean implies a weighting
	 - if one program is way slower than the other, it has more inherent weight in the final arithmetic sum than the faster program
 - Geometric mean does not necessarily predict execution time for any mix of the programs
	 - not real wall-clock prediction
	 - if you ran all the programs in a given order, it doesn't necessarily predict the time
 - ratios of geometric means never change (regardless of which machine is used as the base), and always give equal weight to all benchmarks
	 - if you compare machine A and machine B using GM it doesn't matter if you normalize against A or against B, same speedup factor (stable and fair)
 - to give unequal weight requires weighted arithmetic mean
	 - if you care about certain programs more use weighted arithmetic mean
 ![[Screenshot 2025-10-01 at 2.32.56 PM.png]]
 - Answer: AM and GM have their uses. For unweighted measures (eg speedup), GM probably better.


### Analyzing Performance
What tools do we used to analyze (predict) performance in absence of something to measure?
- Speedup: relative performance
$speedup = \frac{Exec\ Time\ without\ change}{Exec\ Time\ with\ change}$

- Amdahl's Law: Impact of a performance improvement is limited by the percent of execution time affected by the improvement
$Execution\ Time\ after\ improvement = \frac{Execution\ Time\ Affected}{Amount\ of\ Improvement} + Execution\ Time\ Unaffected$
### Time in Performance
In comp arch, Time is broken down in individual units called clock cycles
$CPU\ Execution\ Time = CPU\ clock\ cycles * Clock\ cycle\ time$

- Every conventional process has a clock with an associated clock cycle time or clock rate
- Every program runs in an integral number of clock cycles
- GHz = billions of cycles/second
- X GHZ = 1/X nanoseconds cycle time

$Number\ of\ CPU\ cycles = Instructions\ executed * Average\ Clock\ Cycles\ per\ Instruction$

$CPI = CPU\ clock\ cycles / Instruction\ count$

**What if the cycle time changes?**
- Clock range changes still happen at a very coarce granularity (and stalls the processor in between), so you can apply this formula for each interval that has a fixed clock rate
- You can adjust for the reference(fastest) clock rate by multiplying a fudge factor

![[Screenshot 2025-09-30 at 3.01.04 PM.png]]

**Deep pipeline**: refers to a processor design where the instruction exectuion process is divided into a greater number of stages than shallower pipelines

Strength reduction -> simpler instructions -> easier to pipeline -> lowers CPI


