---
date: 2025-10-17
tags:
- programing-language
title: Unpacking
---

source: https://peps.python.org/pep-0448/

Using `*` or `**` allows unpacking of undefined structured data structures into typed data structure definitions

Example:
``` python
>>> print(*[1], *[2], 3)
1 2 3
>>> dict(**{'x': 1}, y=2, **{'z': 3})
{'x': 1, 'y': 2, 'z': 3}
```

`*` is used for unpacking a **list/tuple** of positional arguments
`**` is used for unpacking a dictionary into keyword arguments

```
def f(*args, **kwargs):
    print(args, kwargs)

f(1, 2, 3, x=10, y=20)
# args = (1, 2, 3)
# kwargs = {'x': 10, 'y': 20}
```