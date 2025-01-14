### Purpose
Storing user data or user authentication during sessions on the client side. Needs a hashing algorithm to make sure data somewhat secure.

### Implementation
- Use JWT to hash user data in to a JWT token
- Store in token in cookie
- Decode cookie to get data again

### Design consideration
- refresh tokens to keep cookies changing during a sessions
- expiration times (for above or not have permanent "keys" (or bearer tokens) to user data)