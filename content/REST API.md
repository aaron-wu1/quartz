---
title: REST API
date: 2024-01-07
---
### Definition
- REST stands for **RE**presentational **S**tate **T**ransfer. It's an architectural style for providing standards between computer systems on the web.
- REST compliant systems are called RESTful systems

### Key Features
- **Separation of Client and Server**
	- Code on the client side doesn't affect the server and vice-versa
- **Statelessness**
	- server doesn't need to know the state the client is and vice versa

### Communication between Client and Server
- HTTP Verbs more in [[CRUD]]
	- GET - retrieve a specific resource or collection of resources
	- POST - create new resource
	- PUT - update a specific resource (by id)
	- DELETE - remove a specific resource by id
- Headers and Accept parameters
	- In the header, an `Accept` field defines the type of content that the client is able to receive from the server
	- These types of content are called [[MIME Types]]
	- Ex. `application/json`, `image/png`
- Sending responses
	- `content-type` header field alerts the client what type of content is being sent (look above at [[MIME Types]])
	- Response codes (reference link)
		- https://developer.mozilla.org/en-US/docs/Web/HTTP/Status
	- 