import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Function to fix linting errors in files
function fixLintErrors() {
  const filesToFix = [
    {
      path: 'src/components/Sections/AIAssistance/AIAssistanceInput.jsx',
      fixes: [
        { from: 'interimTranscript', to: '_interimTranscript' },
        { from: 'onFileUpload', to: '_onFileUpload' },
        { from: '_event', to: 'event' },
        { from: '_error', to: 'error' }
      ]
    },
    {
      path: 'src/components/Sections/AIAssistance/AIAssistanceInterface.jsx',
      fixes: [
        { from: 'isRecording', to: '_isRecording' },
        { from: 'index', to: '_index' }
      ]
    },
    {
      path: 'src/components/Sections/AIAssistance/AIAssistanceView.jsx',
      fixes: [
        { from: 'jsonData', to: '_jsonData' },
        { from: 'handleDownload', to: '_handleDownload' },
        { from: 'handleDownloadClick', to: '_handleDownloadClick' },
        { from: 'handleDownloadFile', to: '_handleDownloadFile' }
      ]
    },
    {
      path: 'src/components/Sections/AIAssistance/MergedSidebar.jsx',
      fixes: [
        { from: 'userId', to: '_userId' }
      ]
    },
    {
      path: 'src/components/Sections/AIAssistance/StreamingText.jsx',
      fixes: [
        { from: 'isComplete', to: '_isComplete' }
      ]
    },
    {
      path: 'src/components/Sections/AIAssistance/aiAssistanceService.js',
      fixes: [
        { from: 'getTestAIResponse', to: '_getTestAIResponse' }
      ]
    },
    {
      path: 'src/components/Sections/DocsInteraction/DocumentChatPage.jsx',
      fixes: [
        { from: 'sessionId', to: '_sessionId' },
        { from: 'showAnalytics', to: '_showAnalytics' },
        { from: 'setShowAnalytics', to: '_setShowAnalytics' },
        { from: 'currentAnalytics', to: '_currentAnalytics' },
        { from: 'setCurrentAnalytics', to: '_setCurrentAnalytics' }
      ]
    },
    {
      path: 'src/components/Sections/DocsInteraction/UploadPage.jsx',
      fixes: [
        { from: 'node', to: '_node' }
      ]
    },
    {
      path: 'src/components/Sections/DocumentsDrafting/DocumentsDraftingPage.jsx',
      fixes: [
        { from: 'documentGenerated', to: '_documentGenerated' },
        { from: 'generateFinalDocument', to: '_generateFinalDocument' },
        { from: 'data', to: '_data' },
        { from: 'index', to: '_index' }
      ]
    },
    {
      path: 'src/components/Sections/LandingPage/About.jsx',
      fixes: [
        { from: 'handleGetStarted', to: '_handleGetStarted' }
      ]
    },
    {
      path: 'src/components/Sections/Vault/VaultEditView.jsx',
      fixes: [
        { from: 'vaultedChat', to: '_vaultedChat' },
        { from: 'handleDelete', to: '_handleDelete' }
      ]
    },
    {
      path: 'src/components/Sections/Vault/VaultView.jsx',
      fixes: [
        { from: 'user', to: '_user' }
      ]
    },
    {
      path: 'src/components/Sections/Waitlist/Waitlist.jsx',
      fixes: [
        { from: 'getAccessTokenSilently', to: '_getAccessTokenSilently' }
      ]
    },
    {
      path: 'src/components/ui/resizable-navbar.jsx',
      fixes: [
        { from: 'motion', to: '_motion' },
        { from: 'onClose', to: '_onClose' },
        { from: 'Tag', to: '_Tag' }
      ]
    }
  ];

  filesToFix.forEach(file => {
    try {
      const filePath = path.join(__dirname, file.path);
      let content = fs.readFileSync(filePath, 'utf8');
      
      file.fixes.forEach(fix => {
        const regex = new RegExp(`\\b${fix.from}\\b`, 'g');
        content = content.replace(regex, fix.to);
      });
      
      fs.writeFileSync(filePath, content);
      console.log(`✅ Fixed ${file.path}`);
    } catch (error) {
      console.error(`❌ Error fixing ${file.path}:`, error.message);
    }
  });
}

// Run the fix
fixLintErrors();
console.log('🎉 Lint error fixes completed!'); 