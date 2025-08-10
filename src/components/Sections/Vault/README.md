# Vault Component

The Vault component provides a comprehensive storage and organization system for legal conversations and documents. It automatically categorizes content into three specialized folders based on the feature context where the save action is triggered.

## Features

### 📁 Automatic Folder Organization
The vault automatically organizes content into three specialized folders based on the feature context:

1. **🤖 AI Assistance** (`ai-assistance`)
   - AI-powered legal assistance and consultations
   - Legal advice and guidance conversations
   - AI-generated legal insights and recommendations
   - **Auto-selected when**: `feature="ai-assistance"`, `feature="ai"`, `feature="assistance"`, or default

2. **📄 Document Drafting** (`document-drafting`)
   - Legal document drafting and templates
   - Contract creation and review discussions
   - Legal form generation and customization
   - **Auto-selected when**: `feature="document-drafting"`, `feature="document"`, `feature="drafting"`

3. **💬 Chat Store** (`chat-store`)
   - General chat conversations and discussions
   - Client consultations and meetings
   - General legal discussions and notes
   - **Auto-selected when**: `feature="chat"`, `feature="general"`, `feature="consultation"`

### 🔍 Search and Filter
- Search within specific folders or across all folders
- Real-time search with instant results
- Filter by folder type and content

### 📊 Folder Statistics
- View chat counts for each folder
- Track usage across different categories
- Monitor folder activity and growth

### 🔄 Move and Organize
- Move chats between folders after saving
- Reorganize content as needed
- Maintain proper categorization

## Components

### VaultView.jsx
Main vault interface with:
- Folder tabs for easy navigation
- Search functionality
- Chat management (view, edit, delete, move)
- Folder statistics display
- Responsive design for all devices

### SaveToVault.jsx
Modal component for saving chats with:
- Title and description input
- **Automatic folder selection** based on feature context
- Validation and error handling
- Success confirmation

### VaultChatView.jsx
Detailed view for individual vaulted chats:
- Full conversation display
- Message history
- Export capabilities
- Navigation back to vault

### VaultEditView.jsx
Edit interface for vaulted chats:
- Update titles and descriptions
- Change folder assignments
- Modify metadata

### vaultService.js
Backend service integration with:
- Folder-specific API endpoints
- Search and filter functionality
- Move and update operations
- Statistics and analytics

## API Endpoints

### Core Operations
- `POST /api/vault/save` - Save chat with folder assignment
- `GET /api/vault/chats` - Get all vaulted chats
- `GET /api/vault/chats/folder/:folder` - Get chats by folder
- `GET /api/vault/chat/:id` - Get specific chat
- `PUT /api/vault/chat/:id` - Update chat details
- `DELETE /api/vault/chat/:id` - Delete chat

### Advanced Operations
- `PUT /api/vault/chat/:id/move` - Move chat to different folder
- `GET /api/vault/search` - Search chats with folder filter
- `GET /api/vault/stats` - Get folder statistics

## Usage

### Automatic Folder Selection
The SaveToVault component automatically selects the appropriate folder based on the `feature` prop:

```javascript
// AI Assistance (default)
<SaveToVault 
  sessionId={sessionId} 
  feature="ai-assistance" 
  onSave={handleSave} 
  onCancel={handleCancel} 
  isVisible={showSaveModal} 
/>

// Document Drafting
<SaveToVault 
  sessionId={sessionId} 
  feature="document-drafting" 
  onSave={handleSave} 
  onCancel={handleCancel} 
  isVisible={showSaveModal} 
/>

// Chat Store
<SaveToVault 
  sessionId={sessionId} 
  feature="chat" 
  onSave={handleSave} 
  onCancel={handleCancel} 
  isVisible={showSaveModal} 
/>
```

### Feature Context Mapping
```javascript
// AI Assistance (default)
feature="ai-assistance" | "ai" | "assistance" → AI Assistance folder

// Document Drafting
feature="document-drafting" | "document" | "drafting" → Document Drafting folder

// Document Interaction & Chat Store
feature="document-interaction" | "docs-interaction" | "upload" | "chat" | "general" | "consultation" → Chat Store folder
```

### Saving to Vault
```javascript
import { vaultService, VAULT_FOLDERS } from './vaultService';

// Save with automatic folder selection
await vaultService.saveToVault(
  sessionId, 
  'Contract Review Discussion', 
  'Important contract terms review', 
  selectedFolder // Automatically determined by feature context
);
```

### Loading Folder Content
```javascript
// Load AI assistance chats
const aiChats = await vaultService.getVaultedChatsByFolder(VAULT_FOLDERS.AI_ASSISTANCE);

// Load document drafting chats
const docChats = await vaultService.getVaultedChatsByFolder(VAULT_FOLDERS.DOCUMENT_DRAFTING);

// Load general chat store
const storeChats = await vaultService.getVaultedChatsByFolder(VAULT_FOLDERS.CHAT_STORE);
```

### Moving Between Folders
```javascript
// Move chat to different folder
await vaultService.moveChatToFolder(chatId, VAULT_FOLDERS.AI_ASSISTANCE);
```

## Folder Constants

```javascript
export const VAULT_FOLDERS = {
    AI_ASSISTANCE: 'ai-assistance',
    DOCUMENT_DRAFTING: 'document-drafting', 
    CHAT_STORE: 'chat-store'
};

export const FOLDER_NAMES = {
    [VAULT_FOLDERS.AI_ASSISTANCE]: 'AI Assistance',
    [VAULT_FOLDERS.DOCUMENT_DRAFTING]: 'Document Drafting',
    [VAULT_FOLDERS.CHAT_STORE]: 'Chat Store'
};

export const FOLDER_DESCRIPTIONS = {
    [VAULT_FOLDERS.AI_ASSISTANCE]: 'AI-powered legal assistance and consultations',
    [VAULT_FOLDERS.DOCUMENT_DRAFTING]: 'Legal document drafting and templates',
    [VAULT_FOLDERS.CHAT_STORE]: 'General chat conversations and discussions'
};
```

## Integration Examples

### AI Assistance Feature
```javascript
// In AI assistance component
<SaveToVault 
  sessionId={currentSessionId}
  feature="ai-assistance" // Auto-selects AI Assistance folder
  onSave={() => console.log('Saved to AI Assistance')}
  onCancel={() => setShowSaveModal(false)}
  isVisible={showSaveModal}
/>
```

### Document Drafting Feature
```javascript
// In document drafting component
<SaveToVault 
  sessionId={currentSessionId}
  feature="document-drafting" // Auto-selects Document Drafting folder
  onSave={() => console.log('Saved to Document Drafting')}
  onCancel={() => setShowSaveModal(false)}
  isVisible={showSaveModal}
/>
```

### General Chat Feature
```javascript
// In general chat component
<SaveToVault 
  sessionId={currentSessionId}
  feature="chat" // Auto-selects Chat Store folder
  onSave={() => console.log('Saved to Chat Store')}
  onCancel={() => setShowSaveModal(false)}
  isVisible={showSaveModal}
/>
```

## Styling

The component uses Tailwind CSS with:
- Responsive design for mobile, tablet, and desktop
- Dark mode support
- Purple theme with consistent branding
- Smooth animations and transitions
- Accessible design patterns

## Error Handling

- Network error recovery
- Validation for required fields
- User-friendly error messages
- Graceful fallbacks for missing data

## Performance

- Lazy loading of chat content
- Efficient search with debouncing
- Optimized folder switching
- Minimal re-renders with proper state management 