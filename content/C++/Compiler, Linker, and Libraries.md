---
date: 2025-12-20
tags:
title: Compiler, Linker, and Libraries
---
## Compiler Options:
`<TODO> tradeoffs`
### G++ (GNU)
`<TODO>`

### Clang++ (LLVM)
`<TODO>`

### Compiler Flags
- `-c` - compile only
- `-o` - output file
- `-std` - C++ language version
- Warning flags:
	- `-Wall` - common warnings
	- `-Wextra` - more warnings that `-Wall` doesn't include
	- `-pedantic` - strict standard conformance warnings
	- `-Werror` - treat warnings as errors
- Optimization level.
	- `-O0`: no optimization; easiest to debug, benchmarking
	- `-Og`: reasonable optimization while keeping debugging usable
	- `-O2`: good default for performance builds
	- `-O3`: more aggressive; can increase code size; not always faster
- `-g` - include debug symbols
- Inclusion paths and libraries
	- `-I<dir>` - include directory for headers
	- `-L<dir>` - add directory to search for libraries at link time
	- `-l<name>` - link a library