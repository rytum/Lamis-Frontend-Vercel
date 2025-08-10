import React, { useState, useEffect, useRef } from 'react';
import { FileText, Calendar, MapPin, Clock, User, Building, Type } from 'lucide-react';
import StreamingText from '../AIAssistance/StreamingText';
import SaveToVault from '../Vault/SaveToVault';

const DocumentPreview = ({ form, aiContent, currentStep, conditions }) => {
  const [showSaveToVault, setShowSaveToVault] = useState(false);
  const containerRef = useRef(null);

  const handleSaveToVault = () => {
    setShowSaveToVault(true);
  };

  const handleVaultSaveSuccess = () => {
    setShowSaveToVault(false);
  };

  const handleVaultCancel = () => {
    setShowSaveToVault(false);
  };

  // Auto-scroll to bottom when content changes
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [aiContent, conditions, currentStep]);

  const formatDate = (dateString) => {
    if (!dateString) return 'Not specified';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  const getDocumentTypeDisplay = (type) => {
    if (!type) return 'Not specified';
    
    const typeMap = {
      'BRD': 'Business Requirements Document (BRD)',
      'RENTAL': 'Room Rental Agreement',
      'HIRING': 'Hiring Agreement',
      'NDA': 'Non-Disclosure Agreement (NDA)',
      'PARTNERSHIP': 'Partnership Agreement',
      'SERVICE': 'Service Agreement',
      'INTERNSHIP': 'Internship Offer Letter',
      'CONSULTING': 'Consulting Agreement'
    };
    
    return typeMap[type] || type;
  };

  const getDocumentStatus = () => {
    if (!form.title && !form.client && !form.author && !form.type) {
      return 'Not Started';
    }
    if (form.title || form.client || form.author || form.type) {
      return 'In Progress';
    }
    return 'Complete';
  };

  return (
    <div 
      ref={containerRef}
      className="h-full flex flex-col space-y-3 sm:space-y-4 lg:space-y-6 overflow-y-auto custom-scrollbar"
    >
      {/* Document Status Card - Always at the top */}
      <div className="bg-white dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700/50 rounded-xl p-3 sm:p-4 lg:p-6">
        <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
          <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
          <h3 className="text-base sm:text-lg font-semibold text-gray-700 dark:text-gray-200">Document Status</h3>
          <div className={`ml-auto px-2 py-1 rounded-full text-xs font-medium ${
            getDocumentStatus() === 'Complete' 
              ? 'bg-green-100 dark:bg-green-500/20 text-green-600 dark:text-green-300'
              : getDocumentStatus() === 'In Progress'
              ? 'bg-yellow-100 dark:bg-yellow-500/20 text-yellow-600 dark:text-yellow-300'
              : 'bg-gray-100 dark:bg-gray-500/20 text-gray-600 dark:text-gray-300'
          }`}>
            {getDocumentStatus()}
          </div>
        </div>
        
        <div className="space-y-3 sm:space-y-4">
          {/* Document Type */}
          <div className="flex items-center gap-2 sm:gap-3">
            <Type className="w-4 h-4 text-gray-400" />
            <div className="flex-1 min-w-0">
              <p className="text-xs text-gray-500 dark:text-gray-400">Document Type</p>
              <p className="text-sm sm:text-base font-medium text-gray-900 dark:text-gray-100 truncate">
                {getDocumentTypeDisplay(form.type)}
              </p>
            </div>
          </div>

          {/* Document Title */}
          <div className="flex items-center gap-2 sm:gap-3">
            <FileText className="w-4 h-4 text-gray-400" />
            <div className="flex-1 min-w-0">
              <p className="text-xs text-gray-500 dark:text-gray-400">Document Title</p>
              <p className="text-sm sm:text-base font-medium text-gray-900 dark:text-gray-100 truncate">
                {form.title || 'Auto-generated from client name'}
              </p>
            </div>
          </div>

          {/* Client Information */}
          <div className="flex items-center gap-2 sm:gap-3">
            <Building className="w-4 h-4 text-gray-400" />
            <div className="flex-1 min-w-0">
              <p className="text-xs text-gray-500 dark:text-gray-400">Client</p>
              <p className="text-sm sm:text-base font-medium text-gray-900 dark:text-gray-100 truncate">
                {form.client || 'Not specified'}
              </p>
            </div>
          </div>

          {/* Author Information */}
          <div className="flex items-center gap-2 sm:gap-3">
            <User className="w-4 h-4 text-gray-400" />
            <div className="flex-1 min-w-0">
              <p className="text-xs text-gray-500 dark:text-gray-400">Author</p>
              <p className="text-sm sm:text-base font-medium text-gray-900 dark:text-gray-100 truncate">
                {form.author || 'Not specified'}
              </p>
            </div>
          </div>

          {/* Date Information */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div className="flex items-center gap-2 sm:gap-3">
              <Calendar className="w-4 h-4 text-gray-400" />
              <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-500 dark:text-gray-400">Start Date</p>
                <p className="text-sm sm:text-base font-medium text-gray-900 dark:text-gray-100 truncate">
                  {formatDate(form.effectiveDate)}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2 sm:gap-3">
              <Clock className="w-4 h-4 text-gray-400" />
              <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-500 dark:text-gray-400">End Date</p>
                <p className="text-sm sm:text-base font-medium text-gray-900 dark:text-gray-100 truncate">
                  {formatDate(form.closeDate)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Agreement Conditions - Show when conditions exist, positioned after Document Status */}
      {conditions && currentStep >= 2 && (
        <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-700/30 rounded-xl p-3 sm:p-4 lg:p-6">
          <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
            <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400" />
            <h3 className="text-base sm:text-lg font-semibold text-blue-600 dark:text-blue-300">Agreement Conditions</h3>
            <div className="ml-auto px-2 py-1 bg-blue-100 dark:bg-blue-500/20 rounded-full text-xs text-blue-600 dark:text-blue-300">
              Step 2
            </div>
          </div>
          <div className="prose dark:prose-invert max-w-none text-sm sm:text-base leading-relaxed">
            <div className="text-gray-900 dark:text-blue-100 whitespace-pre-wrap">
              {conditions}
            </div>
          </div>
        </div>
      )}

      {/* AI Generated Content - Show below Document Status and Conditions */}
      {aiContent && aiContent[currentStep] && (
        <div className="bg-purple-50 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-700/30 rounded-xl p-3 sm:p-4 lg:p-6">
          <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
            <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-purple-400" />
            <h3 className="text-base sm:text-lg font-semibold text-purple-600 dark:text-purple-300">Generated Document</h3>
            <div className="ml-auto px-2 py-1 bg-purple-100 dark:bg-purple-500/20 rounded-full text-xs text-purple-600 dark:text-purple-300">
              Final Result
            </div>
          </div>
          <div className="overflow-y-auto">
            <div className="prose dark:prose-invert max-w-none text-sm sm:text-base leading-relaxed">
              <div className="text-gray-900 dark:text-purple-100">
                <StreamingText 
                  text={aiContent[currentStep]} 
                  speed={15}
                  onComplete={() => {
                    // Auto-scroll to bottom when streaming completes
                    if (containerRef.current) {
                      containerRef.current.scrollTop = containerRef.current.scrollHeight;
                    }
                  }}
                />
              </div>
            </div>
            {/* Save to Vault button */}
            <div className="flex justify-end mt-3 sm:mt-4">
              <button
                onClick={handleSaveToVault}
                className="flex items-center gap-2 px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm bg-purple-600 hover:bg-purple-700 text-white rounded-md transition-colors"
                title="Save this generated document to vault"
              >
                <FileText className="h-3 w-3 sm:h-4 sm:w-4" />
                Save to Vault
              </button>
            </div>
            {/* SaveToVault Modal */}
            <SaveToVault
              sessionId={`doc-draft-${Date.now()}`}
              feature="document-drafting"
              onSave={handleVaultSaveSuccess}
              onCancel={handleVaultCancel}
              isVisible={showSaveToVault}
            />
          </div>
        </div>
      )}

      {/* Empty State - Only show when no AI content and on step 3+ */}
      {currentStep >= 3 && !aiContent?.[currentStep] && (
        <div className="flex items-center justify-center py-8 lg:py-12">
          <div className="text-center">
            <FileText className="w-12 h-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-500 dark:text-gray-400 mb-2">No Content Generated</h3>
            <p className="text-sm text-gray-500 dark:text-gray-500">
              AI-generated content will appear here once you start the document creation process.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default DocumentPreview; 