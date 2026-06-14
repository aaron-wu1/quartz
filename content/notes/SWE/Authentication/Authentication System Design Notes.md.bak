---
title: "Authentication System Design Notes"
date: 2024-01-04
---

Key Features:
- Users Register
- Users login
- Users sign-out

To consider:
- Security
- User count

## Initial Problem:
HTTP is stateless, but login is stateful (not having to login on every request). Key question is how do we make HTTP requests stateful?

We can add user field to requests to represent which user is interacting with API
**POST /login**
{ user: "bob", pass: "lol"}

Now how the problem arises of how can we differentiate between requests from bad actors that claim that they are {user: "bob"} 
### Identifying State
Session Token are hashed strings used to identify who is interacting with the server. The tokens are generated on login and stored server side on a key value table of users : session token. 

Example:

User      |  Session
---- | ----
Bob       |   xifsop9
Alice       |   few8nce
Bob       |   ewijpw0

## Storing Sessions
Now that we have session tokens generated, we need to figure out how can we store them on the client.

Two types: **Cookie Based** or **Local Storage**
##### Cookie Based
Security Flaws:
- [XSS]
- [CSRF]

##### Local Storage
Need users to make deliberate requests


## Architectural Considerations
Session tokens **require** a DB hit.
Concerns:
- DoS attack
- DB scale

**Typically the solution is to decentralize**

![[Screenshot 2023-12-27 at 1.23.43 PM.png]]
an idea is to use JSON Web Tokens (JWTs)
## JSON Web Tokens (JWTs)
JWTs are structured as {header, payload, signature} where:
- header -> algorithm  + type of token (JWT)
- payload -> app data (user data)
- signature -> algorithm(header + data, secret)
The signature is use the algorithm to verify the data.

![[Screenshot 2023-12-27 at 1.29.48 PM.png]]
Considerations:
- Uses JWT to verify identity, doesn't have a central state of truth as with the sessions table.



