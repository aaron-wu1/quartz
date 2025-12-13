---
date: 2025-11-13
tags:
---
## Background
A potential agent use case for Document Visual Question Answering (DocVQA)
- Ask questions based on documents while referring to multiple pages and different modalities of information
## Summary
The paper introduces SimpleDoc, a retrieval-agumented framework for DocVQA or Document Visual Question Answering. It improves the retrieval process by both image embeddings of the pages and text summaries of pages. The LLM reads the summaries of the retrieved pages and selects a subset of the most relevant pages. Then the reasoner agent decides whether there's enough information, from both images of pages and summaries, to answer the question or more retrieval is needed.


## Questions
1. What's the trade-offs of this dual-index approach versus relying on a single, powerful multi-modal embedding for retrieval?

A dual-index approach improves recall and precision: image embeddings capture layout, tables, and charts, while summaries capture semantic meaning that the image embeddings miss. This avoids loss of information in the compression of a single multimodal embedding. However, it increases storage cost, offline indexing cost, and online latency due to LLM-based re-ranking.

2. Discuss the system-level implications of the proposed design on: 
	(a)offline indexing cost and complexity, (b) online query latency, and (c) handling new documents that have not been fully processed

A. The offline indexing cost and complexity depends on both the visual pipeline and the text summarization pipeline. The visual pipeline needs to render a PDF, run a VLM embedding model and then store it into a vector database. This process is already a lot more complex than just embedding text. For the text summary pipeline, it requires a VLM to summarize the text. Both combined is going to be a huge hit in cost and complexity compared to just a single-index RAG.

B. The online query latency is going to be dominated the retrieval reasoning agent and the query reasoning agent. The retrieval reasoning agent need to identify which selected summaries to retrieve and the query reasoning agent decides if it has enough information. If the query reasoning agent decides if there isn't enough information, the whole process loops which further adds to the latency.

C. Any new documents has to go through the costly indexing pipeline. Without the embeddings the retrieval part fails and without summaries the re-ranking fails. Fully processed documents are required to surface up to the reasoner agent.



