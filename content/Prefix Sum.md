---
title: Prefix Sum
date: 2024-01-06
---
### Introduction
Used to solve [[Subarrays Problems|subarray]] related problems that asks about the sum of the subarrays.

### Features
Allows for constant time sum queries on various ranges. 

### Pseudocode for Subarray Sum
```Python
def subarray_sum(arr: List[int], target: int) -> List[int]:
	prefix_sum = {0: 0}
	cur_sum = 0
	for i in range(len(arr)):
		cur_sum += arr[i]
		# looking for a prefix that when removed from sequence adds up to target
		complement = cur_sum - target
		if complement in prefix_sum:
			return [prefix_sum[complement], i + 1]
		prefix_sum[cur_sum] = i + 1 # Stores current sum as prefix sum key and the index of the start of the sub array if prefix is dropped
```


### Intuition
![](https://algomonster.s3.us-east-2.amazonaws.com/prefix_sum.png)

### Time Complexity
For the above problem 
- time complexity becomes O(n) 
- space complexity becomes O(n)

### Follow up example
```Python
def subarray_sum_total(arr: List[int], target: int) -> int:
    # WRITE YOUR BRILLIANT CODE HERE
    prefix_sum = {0 : 1} # inital count of 1 subarray
    cur_sum = 0
    total = 0
    for i in range(len(arr)):
        cur_sum += arr[i]
        complement = cur_sum - target
        if complement in prefix_sum:
            total += prefix_sum[complement] # found sum so looks at the total count of prefix sums that existed before
        prefix_sum[cur_sum] = prefix_sum.get(cur_sum, 0) + 1 # adding a new subarray possibility if the cur_sum matches a prefix
        
    return total
```