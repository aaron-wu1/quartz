---
date: 2025-12-16
tags:
  - distributed-systems
---
## Background
- Applications are typically more data-intensive than compute-intensive
- Architectures are increasing distributed and services' implementation details are hidden by APIs.
	- This service is essentially now a new, special-purpose data system from smaller, general-purpose components. How can we ensure the service remains correct and complete from faults?
- Types of requirements to make an application successful:
	- *Functional requirements* - what should the application do?
	- *Nonfunctional requirements* - general properties that the application should follow: security, scalability, reliability, compliance, compatibility, and maintainability
- Three key concerns: **Reliability**, **Scalability**, and **Maintainability**
## Reliability
- **"Continuing to work correctly, even when things go wrong"**
	- Working despite the occurrences of faults
	- Striving to build *fault-tolerant* systems
## Scalability
- Describes a system's ability to cope with increased load
### Describing Load
- Load can be describe with a few numbers called *load parameters*
	- eg. requests per second, ratio of reads:writes, or simultaneously active users.
### Describing Performance
- Investigate what happens when load increases:
	1. Tracking performance of system after increasing load parameter while maintaining system resources
	2. Tracking the increase of system resources under increasing load parameter and system resources while maintaining the same performance
- *Service level objectives (SLOs)* and *service level agreements (SLAs)* are contracts that define the expected performance and availability of a service
- Issues that arise:
	- *head-of-line blocking*
	- *Tail latency amplification*
### Approaches to Cope with Load
- *scaling up* with *vertical scaling* or *scaling out* with *horizontal scaling*
- *Elastic* systems - systems that can automatically add computing resources when they detect a load increase

## Maintainability
- The cost of software to keep systems operational and adapting to new use cases.
- Three core design principles:
	- *Operability* - Make it easy for operations teams to keep the system running smoothly
	- *Simplicity* - Make it easy for new engineers to understand the system, by removing as much complexity as possible from the system
	- *Evolvability* - Make it easy for engineers to make changes to the system in the future, adapting it for unanticipated use cases as requirements change. *Extensibiliy*, *modifiability*, or *plasticity*.

