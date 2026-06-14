---
date: 2025-06-16
tags:
- performance
- databases
- security
- operating-systems
- ai
- storage
title: Pulse Design Decision
---

## ~~Web Workers~~
~~Goal:~~ 
~~fast, reactive UI~~
~~run datatable sort in background~~

## Embeddings Models
### all‑MiniLM‑L6‑v2
Pros:
- Fastest
- Small/lean
Cons:
- 78% top 5 retrieval acc, less than others

### bge‑small‑en‑v1.5
Pros:
- Fast, not fastest
- quant 8bit
- 85% top 5 retrieval acc, high
- Prefix pattern -> more acc results
Cons:
- heavier

Choose this for accuracy over speed + prefix helps to naively navigate through sparse data. Since I don't have the tech knowledge to provide the most relevant/cleanest RAG data for process knowledge. 

## Apple Neural Network
TODO: look into how to optimize for this


## RAG 
- **Installer footprint** – every extra MB ships to every user.
- **First‑run latency** – how long it takes to hydrate the local DB.
- **Cross‑platform friction** – anything that breaks on macOS notarisation or Windows AV is a headache.
- **Runtime query performance** – once the app is running you still need fast ANN look‑ups.