# Vault Functionality

## Overview
The vault functionality allows users to save important AI assistance conversations for future reference. Users can access their vaulted chats through the main sidebar navigation.

## Features

### Frontend Components
- **VaultView.jsx**: Main vault page component that displays all saved chats
- **vaultService.js**: Service layer for communicating with the vault API
- **MainSidebar.jsx**: Updated to include vault navigation

### Backend API
- **vaultController.js**: Handles all vault-related operations
- **VaultedChat.js**: MongoDB model for storing vaulted chats
- **vaultRoutes.js**: API routes for vault operations

## API Endpoints

### GET /api/vault/chats
- **Description**: Get all vaulted chats for the authenticated user
- **Authentication**: Required (JWT token)
- **Response**: Array of vaulted chat objects

### GET /api/vault/chat/:vaultId
- **Description**: Get a specific vaulted chat by ID
- **Authentication**: Required (JWT token)
- **Response**: Single vaulted chat object

### POST /api/vault/save
- **Description**: Save a chat session to vault
- **Authentication**: Required (JWT token)
- **Body**: `{ sessionId, title, description }`
- **Response**: Created vaulted chat object

### PUT /api/vault/chat/:vaultId
- **Description**: Update vaulted chat title/description
- **Authentication**: Required (JWT token)
- **Body**: `{ title?, description? }`
- **Response**: Updated vaulted chat object

### DELETE /api/vault/chat/:vaultId
- **Description**: Delete a vaulted chat
- **Authentication**: Required (JWT token)
- **Response**: Success message

### GET /api/vault/search?q=query
- **Description**: Search vaulted chats by content
- **Authentication**: Required (JWT token)
- **Response**: Array of matching vaulted chat objects

## User Flow

1. **Access Vault**: User clicks "Vault" in the main sidebar
2. **View Saved Chats**: VaultView displays all saved conversations
3. **Search**: Users can search through their vaulted chats
4. **View Details**: Click on a chat to see full conversation
5. **Edit**: Users can edit title and description of saved chats
6. **Delete**: Users can remove chats from their vault

## Data Structure

### VaultedChat Model
```javascript
{
  userId: String,           // Auth0 user ID
  sessionId: String,        // Original chat session ID
  title: String,           // User-defined title
  description: String,     // Optional description
  messages: [{             // Array of chat messages
    role: String,          // 'user' or 'assistant'
    content: String,       // Message content
    timestamp: Date        // Message timestamp
  }],
  tags: [String],          // Optional tags
  isPublic: Boolean,       // Public/private flag
  createdAt: Date,         // Creation timestamp
  updatedAt: Date          // Last update timestamp
}
```

## Authentication
- Uses JWT tokens stored in localStorage
- Tokens are generated during Auth0 user sync
- All vault operations require valid authentication

## Error Handling
- 401: Unauthorized (missing/invalid token)
- 404: User or vaulted chat not found
- 500: Server errors

## Future Enhancements
- Bulk operations (delete multiple chats)
- Export functionality
- Sharing vaulted chats
- Advanced search filters
- Chat categorization with tags 