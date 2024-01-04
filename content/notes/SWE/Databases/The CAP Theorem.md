---
title: "The CAP Theorem"
date: "2023-12-31"
---
A distributed system can deliver only two of three characteristics of:
- Consistency
- Availability
- Partition tolerance
### Consistency
All clients sees the same data at the same time no matter what server they are connected to.
### Availability
Any client making a request for data gets a response, even if one or more servers are down.

### Partition tolerance
A partition is a communication break between two servers. Partition tolerance means that the distributed system must continue to work despite the communication breakdown or breakdowns


### In practice
**Cap theorem on NoSQL DB types**
- CP DB - MongoDB
- AP DB - Apache Cassandra
- CA DB

MongoDB: 
- a *single-master system*, fancy word for having one primary node that does all the write operations. 
- All other nodes in the same replica set are secondary nodes that replicate the primary node's operation log and apply it to their own data set. 
- The election algorithm is selecting the node with the most recent operation log as the primary node.
- During the election, no write requests can be made to maintain consistency (compromise on availability)

Cassandra: delivers availability and partition tolerance but can't deliver consistency all the time. This is due to Cassandra not having a master node, relying on *eventual consistency*

CA is possible but it's not possible to completely avoid partition failures, making the database inconsistent.