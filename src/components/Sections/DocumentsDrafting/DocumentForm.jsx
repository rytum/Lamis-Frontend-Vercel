import React from 'react';
import { AlertCircle, CheckCircle } from 'lucide-react';

const DocumentForm = ({ form, onFormChange }) => {
  // Ensure all form values are strings to prevent controlled/uncontrolled input warnings
  const safeForm = {
    title: form?.title || '',
    client: form?.client || '',
    author: form?.author || '',
    type: form?.type || '',
    effectiveDate: form?.effectiveDate || '',
    closeDate: form?.closeDate || ''
  };

  const validateField = (field, value) => {
    switch (field) {
      case 'title':
        return value.length <= 100;
      case 'client':
      case 'author':
        return value.length <= 50;
      default:
        return true;
    }
  };

  const handleInputChange = (field, value) => {
    if (validateField(field, value)) {
      onFormChange(field, value);
    }
  };

  const getFieldError = (field) => {
    const value = safeForm[field];
    if (!value) return null;
    
    switch (field) {
      case 'title':
        return value.length > 100 ? 'Title must be 100 characters or less' : null;
      case 'client':
      case 'author':
        return value.length > 50 ? 'Must be 50 characters or less' : null;
      default:
        return null;
    }
  };

  const isFieldValid = (field) => {
    return !getFieldError(field);
  };

  return (
    <form className="space-y-4 sm:space-y-6 w-full max-w-none lg:max-w-md pt-2 sm:pt-4 lg:pt-8 px-1 sm:px-0" onSubmit={(e) => e.preventDefault()}>
      {/* Document Title */}
      <div className="space-y-2">
        <label htmlFor="title" className="block text-sm font-semibold text-gray-700 dark:text-gray-200 tracking-wide">
          Document Title
        </label>
        <div className="relative">
          <input
            id="title"
            type="text"
            placeholder="Enter document title or leave blank for auto-generation"
            className={`w-full px-3 py-2 sm:py-2.5 bg-gray-50 dark:bg-gray-800/50 border rounded-lg text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 
                     focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 
                     transition-all duration-200 hover:border-gray-500/70 text-sm sm:text-base ${
                       isFieldValid('title') 
                         ? 'border-gray-300 dark:border-gray-600/50' 
                         : 'border-red-500/50 focus:ring-red-500/50 focus:border-red-500/50'
                     }`}
            value={safeForm.title}
            onChange={e => handleInputChange('title', e.target.value)}
            maxLength={100}
            aria-describedby={getFieldError('title') ? 'title-error' : undefined}
          />
          <div className="absolute inset-y-0 right-0 flex items-center pr-3">
            {isFieldValid('title') ? (
              <div className="w-1.5 h-1.5 bg-purple-400 rounded-full opacity-60"></div>
            ) : (
              <AlertCircle className="w-4 h-4 text-red-400" />
            )}
          </div>
        </div>
        {getFieldError('title') && (
          <p id="title-error" className="text-xs text-red-400 flex items-center gap-1">
            <AlertCircle className="w-3 h-3" />
            {getFieldError('title')}
          </p>
        )}
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Will be generated from client name if not provided
        </p>
      </div>

      {/* Document Type */}
      <div className="space-y-2">
        <label htmlFor="type" className="block text-sm font-semibold text-gray-700 dark:text-gray-200 tracking-wide">
          Document Type
          <span className="text-red-400 ml-1">*</span>
        </label>
        <div className="relative">
          <select
            id="type"
            className="w-full px-3 py-2 sm:py-2.5 bg-gray-50 dark:bg-gray-800/50 border border-gray-300 dark:border-gray-600/50 rounded-lg text-gray-900 dark:text-gray-100 
                     focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 
                     transition-all duration-200 hover:border-gray-500/70 appearance-none cursor-pointer text-sm sm:text-base"
            value={safeForm.type}
            onChange={e => onFormChange('type', e.target.value)}
            required
          >
            <option value="">Select document type</option>
            <option value="NDA">Non-Disclosure Agreement (NDA)</option>
            <option value="MOU">Memorandum of Understanding (MoU)</option>
            <option value="CONTRACT">Legal Contract</option>
            <option value="AGREEMENT">Legal Agreement</option>
            <option value="LICENSE">License Agreement</option>
            <option value="LEASE">Lease Agreement</option>
            <option value="PARTNERSHIP">Partnership Agreement</option>
            <option value="SERVICE">Service Agreement</option>
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </div>

      {/* Client Information */}
      <div className="space-y-2">
        <label htmlFor="client" className="block text-sm font-semibold text-gray-700 dark:text-gray-200 tracking-wide">
          Client Name
          <span className="text-red-400 ml-1">*</span>
        </label>
        <div className="relative">
          <input
            id="client"
            type="text"
            placeholder="Enter client or company name"
            className={`w-full px-3 py-2 sm:py-2.5 bg-gray-50 dark:bg-gray-800/50 border rounded-lg text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 
                     focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 
                     transition-all duration-200 hover:border-gray-500/70 text-sm sm:text-base ${
                       isFieldValid('client') 
                         ? 'border-gray-300 dark:border-gray-600/50' 
                         : 'border-red-500/50 focus:ring-red-500/50 focus:border-red-500/50'
                     }`}
            value={safeForm.client}
            onChange={e => handleInputChange('client', e.target.value)}
            maxLength={50}
            aria-describedby={getFieldError('client') ? 'client-error' : undefined}
          />
          <div className="absolute inset-y-0 right-0 flex items-center pr-3">
            {isFieldValid('client') ? (
              <div className="w-1.5 h-1.5 bg-purple-400 rounded-full opacity-60"></div>
            ) : (
              <AlertCircle className="w-4 h-4 text-red-400" />
            )}
          </div>
        </div>
        {getFieldError('client') && (
          <p id="client-error" className="text-xs text-red-400 flex items-center gap-1">
            <AlertCircle className="w-3 h-3" />
            {getFieldError('client')}
          </p>
        )}
      </div>

      {/* Author Information */}
      <div className="space-y-2">
        <label htmlFor="author" className="block text-sm font-semibold text-gray-700 dark:text-gray-200 tracking-wide">
          Author Name
        </label>
        <div className="relative">
          <input
            id="author"
            type="text"
            placeholder="Enter author name (optional)"
            className={`w-full px-3 py-2 sm:py-2.5 bg-gray-50 dark:bg-gray-800/50 border rounded-lg text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 
                     focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 
                     transition-all duration-200 hover:border-gray-500/70 text-sm sm:text-base ${
                       isFieldValid('author') 
                         ? 'border-gray-300 dark:border-gray-600/50' 
                         : 'border-red-500/50 focus:ring-red-500/50 focus:border-red-500/50'
                     }`}
            value={safeForm.author}
            onChange={e => handleInputChange('author', e.target.value)}
            maxLength={50}
            aria-describedby={getFieldError('author') ? 'author-error' : undefined}
          />
          <div className="absolute inset-y-0 right-0 flex items-center pr-3">
            {isFieldValid('author') ? (
              <div className="w-1.5 h-1.5 bg-purple-400 rounded-full opacity-60"></div>
            ) : (
              <AlertCircle className="w-4 h-4 text-red-400" />
            )}
          </div>
        </div>
        {getFieldError('author') && (
          <p id="author-error" className="text-xs text-red-400 flex items-center gap-1">
            <AlertCircle className="w-3 h-3" />
            {getFieldError('author')}
          </p>
        )}
      </div>

      {/* Date Information */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        <div className="space-y-2">
          <label htmlFor="startDate" className="block text-sm font-semibold text-gray-700 dark:text-gray-200 tracking-wide">
            Start Date
          </label>
          <input
            id="startDate"
            type="date"
            className="w-full px-3 py-2 sm:py-2.5 bg-gray-50 dark:bg-gray-800/50 border border-gray-300 dark:border-gray-600/50 rounded-lg text-gray-900 dark:text-gray-100 
                     focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 
                     transition-all duration-200 hover:border-gray-500/70 text-sm sm:text-base"
            value={safeForm.effectiveDate}
            onChange={e => onFormChange('effectiveDate', e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="endDate" className="block text-sm font-semibold text-gray-700 dark:text-gray-200 tracking-wide">
            End Date
          </label>
          <input
            id="endDate"
            type="date"
            className="w-full px-3 py-2 sm:py-2.5 bg-gray-50 dark:bg-gray-800/50 border border-gray-300 dark:border-gray-600/50 rounded-lg text-gray-900 dark:text-gray-100 
                     focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 
                     transition-all duration-200 hover:border-gray-500/70 text-sm sm:text-base"
            value={safeForm.closeDate}
            onChange={e => onFormChange('closeDate', e.target.value)}
          />
        </div>
      </div>
    </form>
  );
};

export default DocumentForm;
