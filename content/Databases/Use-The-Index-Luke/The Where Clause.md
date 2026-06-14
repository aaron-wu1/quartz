---
date: 2026-01-17
tags:
title: autotemplate
---
The `where` clause defines the search condition of an SQL statement. The key constraints of what makes a good index is: how flexible the index is and how different operators affect index usage.

## The Equals Operator
The equals operator is used for exact key lookup.

### Primary key lookups
Indexes for **primary keys** are automatically created by the database. 

For a `where` clause on primary keys, it can only match one row because primary key constraint ensures uniqueness. in an *execution plan/query plan*, we will see that the database does not need to follow index leaf nodes, just traversing the index tree.

Note: On Oracle, `INDEX UNIQUE SCAN` is the operation to traverse index tree. On PostgreSQL, `Index Scan` combines `Index [UNIQUE/RANGE] SCAN` and `TABLE ACCES BY INDEX ROWID` operations so it's not visible.

### Concatenated Indexes
*Concatenated* index is an index with keys that consists of multiple column.
Also known as *multi-column*, *composite*, or *combined* index. 

When making concatenated indexes order of the columns determines the location of the tuple.

For example:
```psql
CREATE UNIQUE INDEX employees_pk
    ON employees (employee_id, subsidiary_id)
```
The resulting keys will be:![[Screenshot 2026-01-17 at 5.23.09 PM.png]]
An SQL query for `SUBSIDIARY_ID=20` now spans blocks/nodes. We can add another index on `SUBSIDIARY_ID` to improve performance, but there's a better solution, **reverse index column order**, only if searching only by `EMPLOYEE_ID` alone does not make sense.
```psql
CREATE UNIQUE INDEX employees_pk
    ON employees (subsidiary_id, employee_id)
```

**Key IDEA:**
**The most important consideration when defining a concatenated index is how to choose the column order so it can be used as often as possible.**
- Check query plan to see how the index is being used. A `TABLE ACCESS FULL` or `FULL TABLE SCAN` sounds bad, but can be the most efficient operation in some cases anyway. In particular when retrieving a large part of the table.
	- `TABLE ACCESS FULL` can sometimes result in a faster query. In those cases, you need to look into how the index is being accessed? Is it equivalent to checking the whole table? See next section...
### Slow Indexes
#### Query Optimizer
The *query optimizer* or *query planner* is a database component that transforms an SQL statement into an execution plan. This is called **compiling** or **parsing**.

There are two different distinct optimizer types:
- *Cost-based optimizers (CBO)* - generates many execution plan variations and calculates a cost with each plan.
- *Rule-based optimizers (RBO)* - generates an execution plan with a fixed rule set. Less flexible.

Example:
```
---------------------------------------------------------------
|Id |Operation                   | Name         | Rows | Cost |
---------------------------------------------------------------
| 0 |SELECT STATEMENT            |              |    1 |   30 |
|*1 | TABLE ACCESS BY INDEX ROWID| EMPLOYEES    |    1 |   30 |
|*2 |  INDEX RANGE SCAN          | EMPLOYEES_PK |   40 |    2 |
---------------------------------------------------------------

Predicate Information (identified by operation id):
---------------------------------------------------
  1 - filter("LAST_NAME"='WINAND')
  2 - access("SUBSIDIARY_ID"=30)
```
In this example, the query goal is to filter by `SUBSIDIARY_ID` and `LAST_NAME`. This first step is `INDEX RANGE SCAN` over the `EMPLOYEES_PK` index which has a key containing `SUBSIDIARY_ID`. The second step is `TABLE ACCESS BY INDEX ROW ID` which exposes the `LAST_NAME` column where then the plan can filter by `LAST_NAME=WINDAND`. 

The issue here is that we would need to pull all `SUBSIDIARY_ID=30` in order to run the `LAST_NAME` filter. This is optimal if subsidiaries contain a small number of rows, but can slow if it contains a large number since the DB has to fetch all rows before applying the filter. 

**The query is slow because the index lookup returns many `ROWIDs`—one for each employee of the original company—and the database must fetch them individually**

`TABLE ACCESS FULL` in the case of large subsidiaries can be faster since it can read in larger blocks of data and doesn't have index look up overhead. This would be optimal to run the `LAST_NAME` filter since we can apply it over a larger block and skip index lookup, but only if the there are enough rows.

## Functions
