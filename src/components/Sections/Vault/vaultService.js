import axios from 'axios';

const API_URL = 'https://backend.lamis.ai/api/vault';

// Get token from localStorage or Auth0
const getAuthHeader = async () => {
    const token = localStorage.getItem('token');
    return {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        withCredentials: true
    };
};

// Define the three vault folders
export const VAULT_FOLDERS = {
    AI_ASSISTANCE: 'ai-assistance',
    DOCUMENT_DRAFTING: 'document-drafting', 
    DOCUMENT_INTERACTION: 'document-interaction'
};

export const FOLDER_NAMES = {
    [VAULT_FOLDERS.AI_ASSISTANCE]: 'AI Assistance',
    [VAULT_FOLDERS.DOCUMENT_DRAFTING]: 'Document Drafting',
    [VAULT_FOLDERS.DOCUMENT_INTERACTION]: 'Document Interaction'
};

export const FOLDER_DESCRIPTIONS = {
    [VAULT_FOLDERS.AI_ASSISTANCE]: 'AI-powered legal assistance',
    [VAULT_FOLDERS.DOCUMENT_DRAFTING]: 'Legal document drafting and templates',
    [VAULT_FOLDERS.DOCUMENT_INTERACTION]: 'Document chat and interaction'
};

export const vaultService = {
    // Save a chat session to vault with folder
    saveToVault: async (sessionId, title, description = '', folder = VAULT_FOLDERS.AI_ASSISTANCE, metadata = null) => {
        try {
            const authHeader = await getAuthHeader();
            if (!sessionId) {
                throw new Error('Session ID is required');
            }
            
            console.log('Saving to vault:', {
                sessionId,
                title,
                description,
                folder,
                metadata
            });
            
            const response = await axios.post(`${API_URL}/save`, {
                sessionId,
                title,
                description,
                folder,
                metadata
            }, authHeader);
            
            return response.data;
        } catch (error) {
            console.error('Vault save error details:', {
                status: error.response?.status,
                data: error.response?.data,
                message: error.message,
                url: error.config?.url,
                method: error.config?.method
            });
            
            // Provide more specific error messages
            if (error.response?.status === 401) {
                throw new Error('Authentication failed. Please log in again.');
            } else if (error.response?.status === 400) {
                throw new Error(error.response.data?.message || 'Invalid request. Please check your input.');
            } else if (error.response?.status === 404) {
                throw new Error('Session not found. Please ensure the session exists.');
            } else if (error.response?.status === 500) {
                throw new Error('Server error. Please try again later.');
            } else if (!error.response) {
                throw new Error('Network error. Please check your connection.');
            }
            
            throw error;
        }
    },

    // Save individual response to vault
    saveResponseToVault: async (responseId, title, description = '', folder = VAULT_FOLDERS.AI_ASSISTANCE, responseData) => {
        try {
            const authHeader = await getAuthHeader();
            if (!responseId) {
                throw new Error('Response ID is required');
            }
            
            console.log('Saving response to vault:', {
                responseId,
                title,
                description,
                folder,
                responseData
            });
            
            const response = await axios.post(`${API_URL}/save-response`, {
                responseId,
                title,
                description,
                folder,
                responseData
            }, authHeader);
            
            return response.data;
        } catch (error) {
            console.error('Response vault save error details:', {
                status: error.response?.status,
                data: error.response?.data,
                message: error.message
            });
            throw error;
        }
    },

    // Get all vaulted chats for the user
    getVaultedChats: async () => {
        try {
            const authHeader = await getAuthHeader();
            const response = await axios.get(`${API_URL}/chats`, authHeader);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Get vaulted chats by folder
    getVaultedChatsByFolder: async (folder) => {
        try {
            const authHeader = await getAuthHeader();
            const response = await axios.get(`${API_URL}/chats/folder/${folder}`, authHeader);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Get a specific vaulted chat by ID
    getVaultedChat: async (vaultId) => {
        try {
            const authHeader = await getAuthHeader();
            const response = await axios.get(`${API_URL}/chat/${vaultId}`, authHeader);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Update vaulted chat title/description/folder
    updateVaultedChat: async (vaultId, updates) => {
        try {
            const authHeader = await getAuthHeader();
            const response = await axios.put(`${API_URL}/chat/${vaultId}`, updates, authHeader);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Move chat to different folder
    moveChatToFolder: async (vaultId, folder) => {
        try {
            const authHeader = await getAuthHeader();
            const response = await axios.put(`${API_URL}/chat/${vaultId}/move`, { folder }, authHeader);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Delete a vaulted chat
    deleteVaultedChat: async (vaultId) => {
        try {
            const authHeader = await getAuthHeader();
            const response = await axios.delete(`${API_URL}/chat/${vaultId}`, authHeader);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Search vaulted chats
    searchVaultedChats: async (query, folder = null) => {
        try {
            const authHeader = await getAuthHeader();
            const url = folder 
                ? `${API_URL}/search?q=${encodeURIComponent(query)}&folder=${folder}`
                : `${API_URL}/search?q=${encodeURIComponent(query)}`;
            const response = await axios.get(url, authHeader);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Get folder statistics
    getFolderStats: async () => {
        try {
            const authHeader = await getAuthHeader();
            const response = await axios.get(`${API_URL}/stats`, authHeader);
            return response.data;
        } catch (error) {
            throw error;
        }
    }
};