---
title: "NoSQL Databases"
date: "2024-01-01"
---
### Definition
Non-tabular databases that store data differently than relational tables, typically any non-relational database

### Purpose
- NoSQL databases allow devs to store huge amounts of [[unstructured data]]
- Gives flexibility to changing requirements
- Ability to distribute data across multiple servers and regions to make their applications resilient

### Structure
NoSQL relies on softer model, relative to [[The ACID Properties|ACID properties]], called [[BASE]] (**B**asically **A**vailable, **S**oft state, **E**ventual consistency)

NoSQL DBs give up A, C and/or D requirements for transactions in ACID, but in return scalability increases.

### Features
- Flexible schemas
- Horizontal scaling
- Fast queries due to the data model
- Ease of use for developers
### Types of NoSQL databases
- [[document databases]]
	- stores data in documents similar to [[JSON]] objects
- [[key-value databases]]
- [[wide-column stores]]
	- stores data in tables, rows and dynamic columns
- [[graph databases]]
	- stores data in nodes and edges

### RDBMS vs NoSQL
shortcomings of RDBMS
- can't handle data variety 
- difficult to change tables and relationships
- RDMS follow [[The ACID Properties|ACID properties]] limiting flexibility to data transactions

### When to use
- Fast-paced Agile development
- Storage of structured and semi-structured data
- Huge volumes of data
- Requirements for scale-out architecture
- Modern application paradigms like microservices and real-time streaming

### Sources
https://www.mongodb.com/nosql-explained
https://www.freecodecamp.org/news/nosql-databases-5f6639ed9574/