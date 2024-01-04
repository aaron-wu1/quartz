---
title: Bitmap Index
date: 2024-01-02
---
### Purpose
- For quick results on tables that are not updated frequently
- Improve performance of queries that involve complex logical operations, such as AND, OR, and NOT

### Design Considerations
- useful for datasets with low cardinality columns, with large # of rows
- useful for read-only queries that involve aggregations, eg. summing values / counting

### What is Bitmap Indexing?
Bits are used to represent unique values in columns, specifically low [[Cardinality|cardinality]] columns.

### Implementation

