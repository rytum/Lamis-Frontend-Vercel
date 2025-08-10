# Docs Interaction History Feature

## Overview
The Docs Interaction feature now includes chat history functionality similar to the AI Assistance feature. Users can view their past document chat sessions, select any session to continue the conversation, and manage their chat history.

## Features

### 1. Session Management
- **Session Storage**: Each document upload creates a unique session with a session ID
- **Session History**: All chat conversations are stored in the database with the associated document
- **Session Selection**: Users can click on any previous session to load the chat history and document

### 2. History Sidebar
- **Toggle History**: Users can show/hide the history sidebar
- **Session List**: Displays all previous document chat sessions
- **Session Info**: Shows document name and session name for each entry
- **Delete Sessions**: Individual session deletion (soft delete from database)
- **Clear History**: Delete all sessions at once

### 3. Document Persistence
- **Document Storage**: Uploaded documents are stored in the database
- **Document Retrieval**: When selecting a session, the associated document is loaded
- **Document Info**: Shows document name, type, and size information

## Backend Implementation

### Database Schema Updates
The `DocumentInteraction` model has been enhanced with session management fields:

```javascript
{
  sessionId: String,        // Unique session identifier
  sessionName: String,      // Display name for the session
  isActive: Boolean,        // Soft delete flag
  chatHistory: [{
    role: String,           // 'user' or 'assistant'
    content: String,        // Message content
    timestamp: Date,        // Message timestamp
    references: [String],   // AI response references
    query: String,          // Original query
    doc_id: String,         // Document ID
    query_type: String      // Query type
  }]
}
```

### New API Endpoints

1. **GET /api/documents/sessions** - Get all document sessions for a user
2. **GET /api/documents/session/:sessionId** - Get a specific session with chat history
3. **DELETE /api/documents/session/:sessionId** - Delete a session (soft delete)

### Updated Endpoints

1. **POST /api/documents/upload** - Now creates a session and returns sessionId
2. **POST /api/documents/chat** - Works with session-based document interactions

## Frontend Implementation

### Components

1. **DocsInteractionSidebar.jsx** - History sidebar component
2. **docsInteractionService.js** - API service for document interactions
3. **DocumentChatPage.jsx** - Updated main component with history functionality

### Key Features

- **Session Loading**: Automatically loads the most recent session on page load
- **Session Switching**: Click any session to load its chat history and document
- **New Chat**: Start a fresh document chat session
- **History Management**: Delete individual sessions or clear all history
- **Document Display**: Shows the associated document name and info

## Usage

1. **Upload Document**: Upload a document to start a new chat session
2. **Show History**: Click "Show History" to view previous sessions
3. **Select Session**: Click on any session to load its chat history and document
4. **Continue Chat**: Continue the conversation with the loaded document
5. **Manage History**: Delete individual sessions or clear all history

## Technical Notes

- **Soft Delete**: Sessions are marked as inactive rather than physically deleted
- **Session ID**: Unique identifiers are generated for each session
- **Document Persistence**: Documents are stored and retrieved with sessions
- **Real-time Updates**: Session list updates after new messages or deletions
- **Error Handling**: Comprehensive error handling for all operations

## Future Enhancements

- Session search and filtering
- Session export functionality
- Session sharing capabilities
- Advanced document management features 