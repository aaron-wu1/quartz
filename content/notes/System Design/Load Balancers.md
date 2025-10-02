---
date: 2025-05-29
tags:
---
## Purpose
To distribute requests and traffic evenly across multiple servers

## Where can load balancers reside?
1. Between **client** and **server**
2. Between **server** and **internal platform**
3. Between **internal platform** and **Database**

## Key terms
1. [[Load Balancing Algorithms]]: method used by the load balancer to determine how to distribute incoming traffic among backend servers
2. **Health Checks**: periodic tests performed by the load balance to check the availability and performance of a given server.
3. **Session Persistence:** technique used to ensure that subsequent requests from the client are directed back to the same server
4. **SSL/TLS termination**: Process of decrypting SSL/TLS - encrypted traffic at the load balancer level, offloading the decryption burden from backend servers and allowing for centralized SSL/TLS management

## Load Balancer Steps:
1. LB receives request from the User
2. LB evaluates request using load balancing algorithm to determine which server to forward to
3. LB forwards traffic over to designated server
4. Server responds to request and responds back to LB
5. LB recieves server's response and forwards it back to User