Used to mimic object-relationship in relational databases. Use when objects share fields/attributes but different methods/interactions.

For example in the source example, a possible use case of capitals is the need in your system to query capitals a lot or want to subset without capitals a lot. Makes it more readable too.

Another use case is when you partition tables. All the tables can inherit the fields from a class. By doing so, when selecting one subset of data (a partitioned table), it doesn't lock other data (other partitions).


source:
https://www.postgresql.org/docs/current/tutorial-inheritance.html
https://stackoverflow.com/questions/3074535/when-to-use-inherited-tables-in-postgresql