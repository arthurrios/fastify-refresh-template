# Fastify Refresh Token Authentication Template

A robust authentication system built with Fastify that implements JWT access tokens with refresh token rotation for enhanced security.

## Overview

This template provides a complete authentication solution with the following features:

- **JWT Access Tokens**: Short-lived tokens (10 seconds) for API authorization
- **Refresh Token Rotation**: Secure token refresh mechanism that invalidates used tokens
- **PostgreSQL Database**: Persistent storage for user accounts and refresh tokens
- **Prisma ORM**: Type-safe database access with migration support
- **Repository Pattern**: Clean separation of concerns for data access

## Architecture

### Database Schema

The system uses two main database models:

1. **Account**
   - Stores user credentials and profile information
   - Has a one-to-many relationship with refresh tokens

2. **RefreshToken**
   - Stores active refresh tokens with expiration dates
   - Each token is linked to a specific account
   - Includes automatic timestamps for token creation

### Authentication Flow

1. **Sign Up**: User creates an account with email, password, and name
2. **Sign In**: User authenticates and receives:
   - A short-lived JWT access token (10 seconds)
   - A long-lived refresh token (10 days)
3. **API Access**: Client includes the JWT in the Authorization header
4. **Token Refresh**: When the access token expires, client uses the refresh token to obtain a new pair of tokens

### Security Features

- **Token Rotation**: Each refresh operation invalidates the used token and issues a new one
- **Cascading Deletion**: When an account is deleted, all associated refresh tokens are automatically removed
- **Expiration Validation**: Refresh tokens are checked for expiration before use

## Setup Instructions

### Prerequisites

- Node.js (v14+)
- PostgreSQL database

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file based on `.env.example` with your database connection string and JWT secret:
   ```
   DATABASE_URL="postgresql://username:password@localhost:5432/auth_db"
   JWT_SECRET="your-jwt-secret-key"
   REFRESH_TOKEN_SECRET="your-refresh-token-secret-key"
   ```
4. Run database migrations:
   ```bash
   npx prisma migrate dev
   ```
5. Start the server:
   ```bash
   npm run dev
   ```

## API Endpoints

### Public Routes

- **POST /sign-up**: Create a new user account
  ```json
  {
    "email": "user@example.com",
    "password": "password123",
    "name": "John Doe"
  }
  ```

- **POST /sign-in**: Authenticate and get tokens
  ```json
  {
    "email": "user@example.com",
    "password": "password123"
  }
  ```
  Response:
  ```json
  {
    "accessToken": "jwt-token",
    "refreshToken": "refresh-token-id"
  }
  ```

- **POST /refresh-token**: Get new tokens using a refresh token
  ```json
  {
    "refreshTokenId": "uuid-of-refresh-token"
  }
  ```
  Response:
  ```json
  {
    "accessToken": "new-jwt-token",
    "refreshToken": "new-refresh-token-id"
  }
  ```

### Protected Routes

- **GET /orders**: Example protected route (requires valid JWT)
  - Header: `Authorization: Bearer your-jwt-token`

## Implementation Details

### Refresh Token Mechanism

The refresh token system works as follows:

1. When a user signs in, they receive both an access token and a refresh token
2. The access token is short-lived (10 seconds in this template)
3. When the access token expires, the client sends the refresh token to get a new pair
4. During refresh:
   - The system validates the refresh token
   - The old refresh token is deleted from the database
   - A new access token and refresh token are generated
   - The new tokens are returned to the client

This approach provides enhanced security by ensuring that if a refresh token is compromised, it becomes invalid as soon as it's used.

### Repository Pattern

The template uses the repository pattern to abstract database operations:

- **AccountsRepository**: Manages user account data
- **RefreshTokensRepository**: Handles refresh token creation, validation, and deletion

This pattern provides a clean separation between the data access layer and business logic.

## License

MIT