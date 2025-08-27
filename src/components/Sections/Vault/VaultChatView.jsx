import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Trash2, Copy, Check } from 'lucide-react';
import { vaultService } from './vaultService';

const VaultChatView = () => {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const [vaultedChat, setVaultedChat] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchVaultedChat = async () => {
      try {
        const data = await vaultService.getVaultedChat(sessionId);
        setVaultedChat(data);
      } catch (err) {
        setError(err.message || 'Failed to fetch vaulted chat');
      } finally {
        setLoading(false);
      }
    };

    fetchVaultedChat();
  }, [sessionId]);

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

  const handleCopy = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text:', err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white">
        <div className="pt-16">
          <div className="max-w-4xl mx-auto px-4 py-8">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto"></div>
              <p className="mt-4 text-black">Loading...</p>
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
                className="mt-4 bg-black text-white px-4 py-2 rounded-lg hover:bg-black border border-black"
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
              onClick={() => navigate('/vault')}
              className="flex items-center justify-center w-10 h-10 text-white hover:text-white transition-colors rounded-lg hover:bg-white/10"
            >
              <ArrowLeft size={20} />
            </button>
            <div className="flex space-x-4">
              <button
                onClick={handleDelete}
                className="flex items-center space-x-2 bg-transparent text-white px-4 py-2 rounded-lg hover:bg-red-600 hover:text-white transition-colors border border-white hover:border-red-600"
              >
                <Trash2 size={16} />
                <span>Delete</span>
              </button>
            </div>
          </div>

          <div className="mb-6">
            <h1 className="text-2xl font-bold mb-2 text-white">{vaultedChat?.title || 'Untitled Chat'}</h1>
            {vaultedChat?.description && (
              <p className="text-white">{vaultedChat.description}</p>
            )}
          </div>

          <div className="bg-black rounded-lg shadow-lg p-6">
            <div className="space-y-4">
              {(
                vaultedChat?.messages ||
                vaultedChat?.metadata?.messages ||
                []
              ).map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`rounded-xl px-4 py-2 max-w-[80%] break-words shadow-md text-sm sm:text-base ${
                      msg.role === 'user'
                        ? 'bg-black text-white self-end border border-black'
                        : 'bg-black text-white self-start border border-black'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <div className="whitespace-pre-wrap">{msg.content}</div>
                        {vaultedChat?.metadata?.aiContent && idx === 0 && (
                          <div className="mt-4 whitespace-pre-wrap">
                            {vaultedChat.metadata.aiContent}
                          </div>
                        )}
                      </div>
                      <button
                        onClick={() => handleCopy(msg.content)}
                        className="flex-shrink-0 p-1 hover:bg-black/20 rounded transition-colors"
                        title="Copy message"
                      >
                        {copied ? (
                          <Check size={14} className="text-green-400" />
                        ) : (
                          <Copy size={14} className="text-black" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VaultChatView; 