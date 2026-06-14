---
date: '2025-09-25'
tags:
- virtualization
- performance
title: UI Virtualization
---

Used tanstack virtual to virtualize large element lists

The purpose of virtualization is rendering visible rows instead of all rows in large table to improve performance.

How it works:
1. Give it a scrollable container
2. Virtualizer tracks scroll position
3. Calculates which items are visible based on size of item and size of container
4. Return virtual row metadata of what it's index is

Ex metadata:
```
[
  {
    index: 410,
    start: 16400,
    size: 40,
    end: 16440
  },
  ...
]
```

Optimizations:
- no react state updates per scroll, uses refs
- only renders new DOM nodes if viewport changes
- Overscan ensures no flicker

Additional functionalities:
- With index -> reset scroll position
- overscan -> rows to hide