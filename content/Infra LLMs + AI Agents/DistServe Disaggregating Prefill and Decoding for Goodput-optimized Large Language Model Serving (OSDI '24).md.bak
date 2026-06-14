---
date: 2025-10-19
tags:
---
source: https://arxiv.org/pdf/2401.09670

## Summary

This paper introduces DistServe, a system that disaggregates prefill and decode into separate stages served by different GPU nodes, each optimized for that phase. Typically prefill and decode phases in LLMs are run on the same GPU due to shared weights, this coupling prevents the full utilization of the GPU's resources. DistServe splits the prefill and decode in separate stages, allowing for increased parallelism and being able to scale either stage with more GPUs depending on the resources required. Ultimately, the authors found that by utilizing DistServe they were able to achieve better goodput in LLM inference.

## Questions
1. How does DistServe designed their system to mitigate the overhead of KV cache migration?
DistServe relies on intra-node communication NVLINK for KV cache transfers. The KV cache transfer occurs exclusively between the prefill and decoding layers, so DistServe groups layers into stages and divides each instance into segments. DistSever then colocates the prefill and decoding segments of the same stage within a single node so the transfer of KV cache occurs via NVLINK.

DistServe also helps mitigate the overhead of KV cache migration by using a pull-based KV. Decoding pulls KV on demand and this helps for bursty loads because the decode phase is memory bandwidth bound, leaving less memory resources to buffer KVs. The prefill GPUs can temporarily queue KV data in memory to prevent overloading. 

1. Do you think DistServe can scale to a very large cluster, say 100/1k/10k GPUs for serving? Why or why not?
The paper mentions that DistServe doesn't handle preemption and fault tolerance. In traditional colocation, a fault in one instance typically doesn't disrupt other replica instances. But in DistServe, there's a dependency between prefill and decoding instances which can cripple the service downstream. At scale, this issue is magnified due to increasing dependencies. For large clusters there would need to include a fault tolerant KV store somewhere which would increase overhead, though it seems like NVIDIA Dynamo has used ETCD for this at scale and it works for them. So I believe that DistServe can scale, but requires additional work to apply it at scale.



## Goal
DistServe aims to reduce **inference latency** and **cost** for large language models (LLMs) in online serving

**Key issue**
- LLM inference has two phases
	1. **Prefill phase**: model processes the *entire prompt* once to initialize key/value caches
	2. **Decode phase**: model *generates token one-by-one* using cached context
- Each phase has different compute and memory requirements
	- Prefill is **compute-heavy** (matrix multiplications over long sequences)
	- Decode is **memory-bandwidth-bound** (reusing cached keys/values)
- **Most existing systems don't distinguish between these phases and allocate the same resources throughout an inference request**
	- leads to underutilization and higher cost

## DistServe
What DistServe does is disaggregate prefill and decode into separate stages served by different GPU nodes, each optimized for that phase
- **Prefill servers** focus on throughput-heavy batch processing
- **Decode servers** focus on low-latency per-token generation

### Core Design
- **Disaggregated serving architecture**
	- separate **Prefill workers** and **Decode workers**
	- KV-cache is transmitted between them at phase boundaries
	- allows for independent scaling and higher utilization
- **Dynamic scheduling**
	- requests are dynamically routed to either prefill or decode pools
	- optimize **TTFT (time to first token)** and **TPOT (time per output token)**
- **Placement and load balancing**
	- scheduling algo for above to balance utilization and minimize transfer overhead
- **Implementation**
	- implemented on top of vLLM
