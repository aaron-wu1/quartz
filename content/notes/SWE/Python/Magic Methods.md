---
title: Magic Methods
date: 2024-01-04
---
### Defintion
Special methods that are represented in python with double underscores on either side

**examples**:
```python
__init__()
__lt__
```

### Use cases
- Construction and initialization
	- `__new__(cls, [...)` creates new instance of class, used rarely, under the hood stuff
	- `__init__` initializer for the class. It gets passed whatever the primary constructor was called with
	- `__del__` destructor of the object, almost never used so use with caution
- Comparison
	- `__cmp__(self, other)` implements comparison for all the operators. Usually want to implement them one by one
	- `__eq__(self, other)` equality
	-  `__ne__(self, other)` inequality
	-   `__lt__(self, other)` less-than
	-  `__gt__(self, other)` greater-than
	-  `__le__(self, other)` less-than-or-equal-to
	-  `__ge__(self, other)` greater-than-or-equal-to
- Numeric
	- ...
- Representation
	- `__str__(self)` defines behavior for when str(class) is called

### Source
https://rszalski.github.io/magicmethods/