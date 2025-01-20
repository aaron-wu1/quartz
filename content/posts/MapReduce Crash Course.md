---
title: Map Reduce Crash Course
date: 2025-01-19
---
## Intro
"MapReduce is a programming model and an associated implementation for processing and generating large data sets. 

Users specify a map function that processes a key/value pair to generate a set of intermediate key/value pairs, and a reduce function that merges all intermediate values associated with the same intermediate key" [^fn1]

That's the definition from the world famous MapReduce paper by Jeffrey Dean and Sanjay Ghemawat. So what does it mean?

## Example
Instead of redefining it lets go through an example.

Consider that we had a bunch of files and we wanted to find the total counts each word in all the files combined. The naive approach would be constructing a table data structure that can store each unique word and their count. If we wanted to parallelize the work done to speed up the process, we would have to deal with complexities fault tolerance, concurrency issues and data integrity. 

What if we had a way that would simplify this parallelization process? And that's where MapReduce comes in!

For our example above, lets say we were given *n* intermediate files to reduce to. We would first do the map phase of  counting all the words in file (represented as key/value pairs). Next we would run a implicit step called shuffle to write a key/value pair to specific intermediate file with index *i*, through a hashing the key and modding it by *n*. That specific intermediate file will only contain a specific subset of words of the total vocabulary that is shared among all files due to the hash key. Once all the files are done with the map step, each file should have *n* intermediate files each labeled with an index *i*. Now we can do the reduce step. Here is where the parallelization really kicks in, since all the intermediate files with index *i* have all the same unique words in the vocabulary. As long as a worker works with all intermediate files that have same index, it doesn't conflict with other intermediate files, simplifying the concurrency issues before. This means we can have reduce steps running at the same time, increasing scalability. Then for the reduce step, we can pass all the intermediate files with the same index to a worker to reduce and we get the total reduced counts for a subset of the vocabulary! Since they are all unique subsets, if we wanted we could aggregate them all together at the end to get the end result.

## Visual
![[MapReduce.png]]

[^fn1]: Jeffrey Dean and Sanjay Ghemawat. 2008. MapReduce: simplified data processing on large clusters. Commun. ACM 51, 1 (January 2008), 107–113. https://doi.org/10.1145/1327452.1327492