import React, { useState, useEffect } from 'react';
import { vaultService, VAULT_FOLDERS, FOLDER_NAMES, FOLDER_DESCRIPTIONS } from './vaultService';
import { Save, X, Check, FolderOpen } from 'lucide-react';

const SaveToVault = ({ sessionId, onSave, onCancel, isVisible, feature = 'ai-assistance', sessionData = null }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  // Automatically determine folder based on feature
  const getAutoSelectedFolder = () => {
    switch (feature) {
      case 'document-drafting':
      case 'document':
      case 'drafting':
        return VAULT_FOLDERS.DOCUMENT_DRAFTING;
      case 'document-interaction':
      case 'docs-interaction':
      case 'upload':
      case 'chat':
      case 'general':
      case 'consultation':
        return VAULT_FOLDERS.DOCUMENT_INTERACTION;
      case 'ai-assistance':
      case 'ai':
      case 'assistance':
      default:
        return VAULT_FOLDERS.AI_ASSISTANCE;
    }
  };

  const selectedFolder = getAutoSelectedFolder();

  const generateDefaultTitle = () => {
    const now = new Date();
    const formatted = now.toLocaleString(undefined, {
      year: 'numeric', month: 'short', day: '2-digit',
      hour: '2-digit', minute: '2-digit'
    });

    const isDocDraft = feature === 'document-drafting' || sessionId?.startsWith?.('doc-draft-');
    if (isDocDraft) {
      const form = sessionData?.form || {};
      if (form.title && String(form.title).trim()) return String(form.title).trim();
      const pieces = [];
      if (form.type) pieces.push(String(form.type));
      if (form.client) pieces.push(String(form.client));
      if (pieces.length) return pieces.join(' - ');
      return `Document Draft - ${formatted}`;
    }

    return `AI Session - ${formatted}`;
  };

  useEffect(() => {
    if (isVisible && !title.trim()) {
      setTitle(generateDefaultTitle());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isVisible, sessionId, feature, sessionData]);

  const handleSave = async () => {
    if (!title.trim()) {
      alert('Please enter a title for the vaulted chat');
      return;
    }

    try {
      setLoading(true);
      
      console.log('SaveToVault - sessionId:', sessionId);
      console.log('SaveToVault - sessionData:', sessionData);
      
      // For document drafting sessions, pass the session data as metadata
      let metadata = null;
      if (sessionId.startsWith('doc-draft-')) {
        if (!sessionData) {
          alert('No session data available to save. Please interact with the AI assistant first.');
          return;
        }
        
        metadata = {
          messages: sessionData.messages || [],
          form: sessionData.form || {},
          conditions: sessionData.conditions || '',
          aiContent: sessionData.aiContent || {},
          type: 'document-drafting'
        };
        
        console.log('Preparing document drafting session for vault:', {
          sessionId,
          messagesCount: metadata.messages.length,
          hasForm: !!metadata.form,
          hasConditions: !!metadata.conditions,
          hasAiContent: !!metadata.aiContent,
          fullMetadata: metadata
        });
        
        // Validate that we have messages
        if (!metadata.messages || metadata.messages.length === 0) {
          alert('No messages found to save. Please interact with the AI assistant first before saving to vault.');
          return;
        }
      }
      
      console.log('Calling vaultService.saveToVault with:', {
        sessionId,
        title: title.trim(),
        description: description.trim(),
        folder: selectedFolder,
        metadata
      });
      
      await vaultService.saveToVault(sessionId, title.trim(), description.trim(), selectedFolder, metadata);
      setSaved(true);
      
      // Reset form after successful save
      setTimeout(() => {
        setTitle('');
        setDescription('');
        setSaved(false);
        onSave && onSave();
      }, 1500);
    } catch (error) {
      console.error('Failed to save to vault:', error);
      console.error('Error response:', error.response);
      const errorMessage = error.response?.data?.message || error.message || 'Unknown error occurred';
      alert(`Failed to save chat to vault: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setTitle('');
    setDescription('');
    onCancel && onCancel();
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full mx-4">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Save to Vault
            </h3>
            <button
              onClick={handleCancel}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {saved ? (
            <div className="text-center py-8">
              <div className="flex items-center justify-center mb-4">
                <Check className="h-8 w-8 text-green-500" />
              </div>
              <p className="text-green-600 dark:text-green-400 font-medium">
                Chat saved to vault successfully!
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter a title for this chat..."
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Auto-selected Folder
                </label>
                <div className="p-3 rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700">
                  <div className="flex items-center space-x-2">
                    <FolderOpen className="h-4 w-4 text-gray-500" />
                    <div>
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {FOLDER_NAMES[selectedFolder]}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {FOLDER_DESCRIPTIONS[selectedFolder]}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Description (optional)
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Add a description to help you remember this chat..."
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={handleCancel}
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={loading || !title.trim()}
                  className="flex-1 px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white rounded-md font-medium transition-colors flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4" />
                      Save to Vault
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SaveToVault; 