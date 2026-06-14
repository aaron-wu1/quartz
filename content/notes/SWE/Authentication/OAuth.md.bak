---
title: OAuth
date: 2024-01-04
---
### Definition
Splits the authentication service into 4 roles:
- Resource owner (the user)
- Resource server (the api)
- Authorization server (can be the same server as the API)
- Client (the app)
### Resource Owner
- aka the "the user"
- the person who is giving access to some portion of their account, eg. Google Account data

### Resource Server
- aka "the api"
- server that contains the user's information that is being accessed by the third-party application
- must be able to accept and validate access tokens and grant the request if the user has allowed it.

### The Authorization Server
- what the user interacts with when the application is requesting access to their account. 
- Displays OAuth prompt and granting access tokens after the user authorizes the application

### The Client
- the app attempting to act on the user's behalf
- eg. Web app

### Other terminology
- **Access Token**: string used when making authenticated requests to API
- **Refresh Token**: string used to get a new access token when previous one expires
- **Authorization Code**: intermediate token used in server-side app flow. An authorization code is returned to the client after the authorization step, and then the client exchanges it for an access token.