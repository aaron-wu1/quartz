---
date: 2025-12-17
tags:
- databases
title: C2 - Data Models and Query Languages
---

## Model Types
- Relational
- nonrelational
	- *Document Based*: use cases where data comes in self-contained documents and **relationships between one document and another are rare**
	- *Graph-like Data Models*: use cases where anything is potentially related to everything
### Historical Models
- Hierarchical model - represented all data as a tree of records nested within records
	- Worked well for one-to-many relationships but not many-to-many relations
- Network model - generalization of hierarchical model, the difference is that a record could have multiple parents rather than one.
	- Links were like pointers, not like foreign keys which are absolute references. Accessing a record required following a path from root (*access path*)

## Relational Model
### Motivations
- Used for *business data processing*: typically *transaction processing* and *batch processing*
- Goal, hide implementation detail behind a cleaner interface
	- SQL is declarative language that hides the application developer from having to rewrite their query for optimizations or to use indexes
	- Only need to build query optimizer once, optimizations can be generalized to multiple applications
- No Nested structures, just tables which are a collection of tuples

### Traits
- *schema-on-write* - schema is explicit and all written data conforms to the schema
### Pros
- Transactional guarantees
### Cons
- *impedence mismatch* - when application models don't match with database models
	- ORMs attempt to reduce the boilerplate code for translating models, but can't completely hide the differences
## NoSQL
### Motivations
- Greater scalability than relational database, eg. for write throughput
- A widespread preference for free and open source software 
- Specialized query operations that are not well supported by the relational model
- Frustration with the restrictiveness of relational schemas and a desire for a more dynamic and expressive data model

### Traits
- *schema-on-read* - structure of data is implicit, and only interpreted when the data is read
### Pros
- *Lack of schema* - provides more schema flexibility
- *Locality* - data that is typically grouped together are grouped in documents, this reduced the amount of database fetches
### Cons
- *Lack of schema* - causes impedence mismatch, but as shown before it can also be more useful

## Relational vs Document DBs for Data Modeling

| Document DB                                                             | Relational                                  |
| ----------------------------------------------------------------------- | ------------------------------------------- |
| schema flexibility                                                      | better joins support                        |
| better performance due to locality                                      | better many-to-one and many-to-many support |
| better for document-like structures (tree of one-to-many relationships) |                                             |

## Application Design
When choosing which database to use, the best choice of technology may differ from another use case. The idea of [*polygot persistence*](https://martinfowler.com/bliki/PolyglotPersistence.html)is utilizing multiple different types of databases for different types of data.

Example use cases of various databases from [Martin Fowler](https://martinfowler.com/bliki/PolyglotPersistence.html):
![[Pasted image 20251217164600.png]]


## Data Modeling Design
**Key factors to consider**
 1. Locality of data
	 - Self contained data (eg. resume) may be more appropriate for JSON representation and document-oriented databases
	 - Reduces the amount of queries to the database compared to relational databases with joins
2. Avoid plain-text strings as identifiers
	- Localization support
	- Better search, ties to metadata
	- Avoids ambiguity, duplication
3. *Normalization* - removing duplicate data within the database
	- Although not a hard fast rule. Duplication can help with optimizing performance through locality
	- For document databases, support for joins is weak and may require emulating a join by making multiple queries to the database. 
		- In this case, the other documents should be small and changing enough that the application can simply keep them in memory to shift the join from database to application code.

## Query Languages for Data
### Types
- *Declarative* - specify the pattern, the computer then decides **how** to handle the pattern
	- Parallelization under query optimizer, more flexibility
- *Imperative* - tells the computer to perform certain operations in order
## MapReduce Querying
[[MapReduce Crash Course|MapReduce]] is a programming model for processing large amounts of data in bulk across many machines
- MapReduce is neither a declarative language nor a fully imperative query API
- ![[Screenshot 2025-12-20 at 11.32.24 AM.png]]
- Ex. Shark filter is written declaratively. Map and reduce written imperatively.
## Graph-Like Data Models
A graph consists of two kinds of objects: *vertices* (*nodes* or *entities*) and *edges* (*relationships* or *arcs*)
- Example data that can be modeled as graphs:
	- *Social Graphs*
	- *The web graph*
	- *Road or rail networks*
### When to use graph DBs?
When *many-to-many* relationships are **very** common. Where anything is potentially related to everything

### Property Graphs
Directed edge graph
`<TODO>`
#### Cypher Query Language
Declarative query language that uses vertex and edge relationships to query data
`<TODO>`

### Triple-Stores
Mostly equivalent to the property graph model, but using different words to describe the same ideas.

All information is stored in the form of a three-part statement: (subject, predicate, object). 
- Eg. (Jim, likes, bananas)
- Represents a relationship between two nodes in a graph

*Turtle triples* - a human readable representation of triples
![[Screenshot 2025-12-20 at 11.57.06 AM.png]]

`<TODO>`

#### RDF data model
RDF made for the web. XML-like.![[Screenshot 2025-12-20 at 11.58.08 AM.png]]
#### SPARQL
Query language for triple-stores using the RDF data model![[Screenshot 2025-12-20 at 11.58.41 AM.png]]
### Background: DataLog
`<TODO>`