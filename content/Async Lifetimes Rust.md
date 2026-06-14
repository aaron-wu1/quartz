---
date: '2025-09-25'
tags:
- programing-language
title: Async Lifetimes Rust
---

```rust
// This function: 
async fn foo(x: &u8) -> u8 { *x } 
// Is equivalent to this function: 
fn foo_expanded<'a>(x: &'a u8) -> impl Future<Output = u8> + 'a { async move { *x } }
```

Lifetimes are represented by labels, eg `'a`
Their lifecycle ends when the label that it's borrowed from is dropped or goes out of scope.