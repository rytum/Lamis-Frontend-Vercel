import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, X } from 'lucide-react';
import { vaultService } from './vaultService';

const VaultEditView = () => {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const [vaultedChat, setVaultedChat] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchVaultedChat = async () => {
      try {
        const data = await vaultService.getVaultedChat(sessionId);
        setVaultedChat(data);
        setTitle(data.title || '');
        setDescription(data.description || '');
      } catch (err) {
        setError(err.message || 'Failed to fetch vaulted chat');
      } finally {
        setLoading(false);
      }
    };

    fetchVaultedChat();
  }, [sessionId]);

  const handleSave = async () => {
    if (!title.trim()) {
      alert('Please enter a title');
      return;
    }

    setSaving(true);
    try {
      await vaultService.updateVaultedChat(sessionId, {
        title: title.trim(),
        description: description.trim()
      });
      navigate(`/vault/chat/${sessionId}`);
    } catch (err) {
      setError(err.message || 'Failed to update vaulted chat');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this chat?')) {
      return;
    }

    try {
      await vaultService.deleteVaultedChat(sessionId);
      navigate('/vault');
    } catch (err) {
      setError(err.message || 'Failed to delete vaulted chat');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white">
        <div className="pt-16">
          <div className="max-w-4xl mx-auto px-4 py-8">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
              <p className="mt-4 text-gray-400">Loading...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black text-white">
        <div className="pt-16">
          <div className="max-w-4xl mx-auto px-4 py-8">
            <div className="text-center">
              <p className="text-red-400">{error}</p>
              <button
                onClick={() => navigate('/vault')}
                className="mt-4 bg-purple-50 dark:bg-purple-950/20 text-purple-600 dark:text-purple-300 px-4 py-2 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-900/30 border border-purple-200 dark:border-purple-700/30"
              >
                Back to Vault
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="pt-16">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="flex items-center justify-between mb-8">
            <button
              onClick={() => navigate(`/vault/chat/${sessionId}`)}
              className="flex items-center justify-center w-10 h-10 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-white/10"
            >
              <ArrowLeft size={20} />
            </button>
            <div className="flex space-x-4">
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center space-x-2 bg-purple-50 dark:bg-purple-950/20 text-purple-600 dark:text-purple-300 px-4 py-2 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-900/30 disabled:bg-gray-600 disabled:text-gray-400 border border-purple-200 dark:border-purple-700/30 transition-colors"
              >
                <Save size={16} />
                <span>{saving ? 'Saving...' : 'Save'}</span>
              </button>
              <button
                onClick={() => navigate('/vault')}
                className="flex items-center space-x-2 bg-transparent text-gray-400 px-4 py-2 rounded-lg hover:bg-red-600 hover:text-white transition-colors border border-gray-600 hover:border-red-600"
              >
                <X size={16} />
                <span>Cancel</span>
              </button>
            </div>
          </div>

          <div className="bg-gray-900 rounded-lg shadow-lg p-6">
            <div className="space-y-6">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-2">
                  Title
                </label>
                <input
                  type="text"
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-600 rounded-lg bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-2">
                  Description
                </label>
                <textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-600 rounded-lg bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VaultEditView; 