---
title: "The Acid Properties"
date: "2023-12-31"
---
### Prerequisites:
- transaction - a single logical unit of work that accesses and possibly modifies the contents of a database.
- transactions access data using read/write operations

### Purpose:
ACID properties are used to maintain consistency in a database, before and after a transaction

### Atomicity
Either the entire transaction takes place at once or doesn't happen at all. No partial completions.
**Two operations:**
- --ABORT: if abort, changes made to DB are not visable
- --COMMIT: if commit, changes made are visible

### Consistency
Ensures that the data follows constraints before and after the transaction.

**example:**
- The total money for two accounts is $800, with $300 in account 1 and $500 in account 2.
- The consistency constraint is $800 total money
- The transaction transfers $200 from account 1 to account 2.
- If the result is $100 and $700, the database is consistent. If it's not, say transaction was deducted from 1 but not incremented on 2, then the database is inconsistent since it broke the constraint.

### Isolation
Ensures that multiple transactions can occur concurrently without leading to inconsistency (isolated environment). Changes occurring in a particular transaction will not be visible to any other transaction until that particular change in that transaction is written to memory or has been commited.

**example:**
- Account balance is $200
- Two transactions for -$100 withdrawal start at the same time
- When transactions complete, under isolation, the resulting balance should be $0 rather than $100

### Durability
Guarantees that once the transaction completes and changes are written to the database, they are persisted (despite crashes or power outages)



Sources:
- https://www.mongodb.com/basics/acid-transactions
- https://www.geeksforgeeks.org/acid-properties-in-dbms/
