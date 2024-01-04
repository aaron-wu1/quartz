---
title: SQL Multiple Joins
date: 2024-01-03
---
Use parenthesis for multiple joins

Example:
```sql
SELECT Customers.CustomerName,
   OrderDetails.ProductID
FROM   (Customers
   INNER JOIN Orders
     ON Customers.CustomerID = Orders.CustomerID)
   INNER JOIN OrderDetails
     ON Orders.OrderID = OrderDetails.OrderID
```

Source:
https://stackoverflow.com/questions/18721042/inner-join-nesting-sql