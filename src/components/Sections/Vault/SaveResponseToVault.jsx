import React, { useState } from 'react';
import { vaultService, VAULT_FOLDERS, FOLDER_NAMES, FOLDER_DESCRIPTIONS } from './vaultService';
import { Save, X, Check, FolderOpen } from 'lucide-react';

const SaveResponseToVault = ({ 
  responseContent, 
  userMessage, 
  onSave, 
  onCancel, 
  isVisible, 
  feature = 'ai-assistance' 
}) => {
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

  // Auto-generate title from user message if not provided
  const generateDefaultTitle = () => {
    if (userMessage) {
      const words = userMessage.split(' ').slice(0, 5);
      return words.join(' ') + (userMessage.split(' ').length > 5 ? '...' : '');
    }
    return 'AI Response';
  };

  // Auto-generate description from response content
  const generateDefaultDescription = () => {
    if (responseContent) {
      const words = responseContent.split(' ').slice(0, 20);
      return words.join(' ') + (responseContent.split(' ').length > 20 ? '...' : '');
    }
    return '';
  };

  React.useEffect(() => {
    if (isVisible && !title) {
      setTitle(generateDefaultTitle());
      setDescription(generateDefaultDescription());
    }
  }, [isVisible, userMessage, responseContent]);

  const handleSave = async () => {
    if (!title.trim()) {
      alert('Please enter a title for the vaulted response');
      return;
    }

    try {
      setLoading(true);
      
      // Create a unique response ID for this individual response
      const responseId = `response_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      // Save the individual response to vault
      await vaultService.saveResponseToVault(
        responseId, 
        title.trim(), 
        description.trim(), 
        selectedFolder,
        {
          userMessage,
          aiResponse: responseContent,
          timestamp: new Date().toISOString(),
          type: 'individual_response'
        }
      );
      
      setSaved(true);
      
      // Reset form after successful save
      setTimeout(() => {
        setTitle('');
        setDescription('');
        setSaved(false);
        onSave && onSave();
      }, 1500);
    } catch (error) {
      console.error('Failed to save response to vault:', error);
      alert('Failed to save response to vault. Please try again.');
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
              Save Response to Vault
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
                Response saved to vault successfully!
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
                  placeholder="Enter a title for this response..."
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
                  placeholder="Add a description to help you remember this response..."
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
                      Save Response
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

export default SaveResponseToVault;