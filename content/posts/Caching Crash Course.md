---
date: 2025-06-08
tags:
- caching
title: Caching Crash Course
---

## Use Case
Store data closer to the end destination to reduce delays or store repetitive data to prevent extra work.
## Cache Filters
- [[Bloom Filters]]: 
	- **Cache on second hit** - Akamai uses this to decide when to cache. Most requests are one hit wonders or the user only requests for the resource once.
		- helps avoid ephemeral objects

## Eviction Algos
- **LRU**