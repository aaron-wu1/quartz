---
title: SQL ON vs WHERE
date: 2024-01-04
---
ON is used when referencing joins and where is used for filtering data. Explicit join is using ON and implicit join is used with WHERE. 

Performance-wise both are identical but for readability is better to use ON to separate out when you are using WHERE to joining tables or filtering a table.

SQL example, all three queries produce the same result:
```sql
SELECT * FROM facebook JOIN linkedin ON facebook.name = linkedin.name 

SELECT * FROM facebook JOIN linkedin WHERE facebook.name = linkedin.name 

SELECT * FROM facebook, linkedin WHERE facebook.name = linkedin.name
```

Source:
https://www.atlassian.com/data/sql/difference-between-where-and-on-in-sql#:~:text=Is%20there%20a%20difference%20between,used%20to%20filter%20the%20data.