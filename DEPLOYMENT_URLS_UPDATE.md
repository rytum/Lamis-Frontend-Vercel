# Deployment URLs Update Summary

## Overview
Updated the frontend application to use deployed backend and AI backend URLs instead of localhost for production deployment.

## URLs Updated
- **Backend API**: `https://backend.lamis.ai`
- **AI Backend (Flask)**: `https://aibackend.lamis.ai`

## Files Modified

### 1. vite.config.js
- Updated proxy configuration to use deployed URLs
- `/api` → `https://backend.lamis.ai`
- `/flask-api` → `https://aibackend.lamis.ai`

### 2. Service Files
- **backendAIService.js**: Updated API_BASE_URL and FLASK_API_URL
- **aiAssistanceService.js**: Updated API_BASE_URL
- **aiAssistanceHistoryService.js**: Updated API_URL
- **vaultService.js**: Updated API_URL
- **useAuth.js**: Updated API_BASE_URL

### 3. Component Files
- **Waitlist.jsx**: Updated API_BASE_URL references
- **UploadPage.jsx**: Updated API_BASE_URL references
- **AIAssistanceView.jsx**: Updated all Flask API calls and error messages

## Configuration Details

### Vite Proxy Configuration
```javascript
server: {
  proxy: {
    '/api': 'https://backend.lamis.ai',
    '/flask-api': {
      target: 'https://aibackend.lamis.ai',
      changeOrigin: true,
      rewrite: (path) => path.replace(/^\/flask-api/, '')
    }
  },
}
```

### Direct API Calls
- AI backend calls now use `https://aibackend.lamis.ai/api/*` directly
- Backend API calls use `https://backend.lamis.ai/api/*` directly
- Relative URLs (like `/api/documents`) still work through the proxy

## Benefits
1. **Production Ready**: Frontend can now connect to deployed services
2. **No Localhost Dependencies**: Application works without local development servers
3. **Consistent URLs**: All services use the same base URLs across environments
4. **Proxy Support**: Maintains backward compatibility for relative API calls

## Testing
- Verify that AI assistance features connect to `https://aibackend.lamis.ai`
- Verify that backend features connect to `https://backend.lamis.ai`
- Check that document uploads, chat, and vault features work with deployed services

## Notes
- The proxy configuration in vite.config.js is primarily for development
- In production (Vercel), the proxy settings won't apply, but direct URL calls will work
- All hardcoded localhost references have been removed
- Error messages updated to be more generic and production-friendly
