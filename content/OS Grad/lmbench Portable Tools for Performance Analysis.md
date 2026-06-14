---
date: 2025-10-11
tags:
- caching
- performance
- operating-systems
- computer-architecture
title: lmbench Portable Tools for Performance Analysis
---

source: https://www.usenix.org/legacy/publications/library/proceedings/sd96/full_papers/mcvoy.pdf
## Abstract
`lmbench` is a micro-benchmark suit designed to focus attention on the basic building blocks of many common system applications. In almost all cases, the individual tests are the result of analysis and isolation of a customer's actual performance problem.

## Benchmark notes
- all of the benchmarks that could be affected by cache size are run in a loop, with increasing sizes until max size
- benchmark verifies that there is sufficient memory to run all the benchmarks in main memory.
	- a small test program allocates as much memory as it can, clears the memory, and then strides through that memory a page at at time, timing each reference. If the reference takes longer than a few microseconds, the page is no longer in memory
	- the program starts small and works forward until either enough memory is seen as present or the memory limit is reached

## Measuring