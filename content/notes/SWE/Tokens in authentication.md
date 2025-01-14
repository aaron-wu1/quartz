---
title: Tokens
date: 2024-01-05
---
### Definition
Pieces of data that carry enough information to id users

### ID tokens
- contain information of user profile
- OpenID connect issues these

### Access Tokens
- used to make secure api calls
- no oauth standard but jwt commonly used
- bearer token - anyone with token can used it to access protected resources
	- need to add expiration date
### Refresh tokens
- when access token expires, uses refresh token to get a new access token 
- Doesn't need the user to login again, as long as refresh token is not expired

### Design Considerations
- **Traditional web app running on a server**
	- authorization code flow
- **Single page application**
	- authorization code flow with [[PKCE|PKCE(proof key code exhange)]]
- **Single page app that doesn't need access token**
	- use implicit flow with form post
- **Is Client a resource owner?**
	- use client credential flows
-  **Is Client trusted with user-credentials?**
	- use the resource owner password flow

### Refresh Token Rotation

