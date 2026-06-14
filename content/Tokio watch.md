---
date: '2025-09-25'
tags:
- concurrency
- programing-language
title: Tokio watch
---

Sync primitive that allows one writer to broadcast to multiple readers


Uses channels which is a thread safe unidirectional pipe
- recievers borrow(read only reference) from this channel