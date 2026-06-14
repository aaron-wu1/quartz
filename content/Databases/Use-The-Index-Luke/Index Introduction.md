---
date: 2026-01-17
tags:
title: Index Introduction
---
source: https://use-the-index-luke.com/
Note: Use-the-index only focuses on B-Tree indexes
## Why Index
Database indexing is a development task. Proper indexing is determined mainly by how the application queries the data. 

## What is an index?
An index is a distinct structure in the database built using `create index`
- pure redundancy

Databases indexes undergoes constant change due to `insert`, `delete`, and `update` statements. In order to handle changes in a performant way, databases combines two data structures: a *doubly linked list* and a *search tree*.

## The Index Leaf Notes
The primary purpose of an index is to provide an ordered representation of the indexed data. Sequential ordering of data makes inserts time-consuming due to the requirement of shifting. Instead, we can use logical order with a doubly linked list.
![[Screenshot 2026-01-17 at 4.10.22 PM.png]]

## The Search Tree (B-Tree) Makes the Index Fast
[[Storage and Retrieval#B-Trees|*B-Tree (Balanced Search Tree)*]] - secondary structure from the leaf nodes to help find corresponding leaf node quickly.
![[Screenshot 2026-01-17 at 4.13.06 PM.png]]
- Balanced search tree because tree depth is equal at every position. The distance between root node and leaf nodes is the same everywhere
	- **All elements/leaf nodes can be accessed in the same number of steps**
	- **Logarithmic growth** of tree depth = great for scale
## Slow Indexes
What causes slow indexes?
- A common myth is "degenerated index" where an index can degrade and rebuilding the index improves performance

### Framework to Find Root Cause
Note: Index lookup is tree traversal + leaf node chain + fetching table data
1. Check the leaf node chain
	- If two entries in the index are the same, the database muse read the next leaf node to see if there are any more matching entries.
2. Check table access
	- Both leaf node chain and table data can contain multiple potentially scattered blocks, adding latency in search


