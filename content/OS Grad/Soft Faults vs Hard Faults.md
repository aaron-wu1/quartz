---
date: 2025-11-09
tags:
- operating-systems
title: Soft Faults vs Hard Faults
---

Soft faults - when the page is in RAM but not loaded into the process or mapped to the process' address space.
- Cases:
	- `fork()` and copy-on-write
		- the child touches a page for the first time -> OS gives it a copy -> soft fault
		- page was already in RAM but not in child's address space
	- `mmap()`, if another process has read into a file, it's in memory but not in the current address space

Hard faults - when the page is in disk and not in memory yet.