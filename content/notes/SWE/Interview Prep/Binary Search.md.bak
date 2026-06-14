---
title: Binary Search
date: 2024-01-04
---
### Purpose
Search algorithm that narrows down the search range by half each time.

### Template structure
```Python
def binary_search(arr, target):
	left = 0
    right= len(arr) -1
    while left <= right:
        mid = (left + right) // 2
        if target == arr[mid]:
            return mid
        elif arr[mid] < target:
            left = mid + 1
        else:
            right = mid - 1
    return -1
```

With the addition of a [[monotonic function]] f(x), called **feasible**
```Python
def binary_search(arr, target):
	left = 0
    right= len(arr) -1
    first_true_index
    while left <= right:
        mid = (left + right) // 2
        if feasible(mid):
            first_true_index = mid
            right = mid - 1
        else:
            left = mid + 1
    return first_true_index
```

### Runtime
O(log(n))

