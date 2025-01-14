---
title: Two pointers
date: 2024-01-06
---
### Introduction
A common interview technique that utilizes two pointers to traverse through an iterable data structure, usually an array

### Variations
- Both pointers moving in the same direction
- Pointers moving in opposite directions 
	- eg. each end of an array
- [[Sliding Window]]
	- A function is performed on values between the pointer
		- eg. isSubstringUnique()

### Time Complexity
- If we naively compare values in an array, the time complexity is O(n^2)
- With two pointers the time complexity becomes O(n)
