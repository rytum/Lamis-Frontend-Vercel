import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { PopupProvider } from './contexts/PopupContext';
import { NavbarDemo as Navbar } from './components/Sections/LandingPage/Navbar';
import Footer from './components/Sections/LandingPage/Footer';
import AIAssistancePage from './pages/AIAssistancePage';
import DocumentDraftingPage from '../src/components/Sections/DocumentsDrafting/DocumentsDraftingPage';
import DocumentHistoryPage from './pages/DocumentHistoryPage';
import DocumentChatPage from './components/Sections/DocsInteraction/DocumentChatPage';
import UploadPage from './components/Sections/DocsInteraction/UploadPage';
import VaultPage from './pages/VaultPage';
import VaultChatView from './components/Sections/Vault/VaultChatView';
import VaultEditView from './components/Sections/Vault/VaultEditView';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import TermsOfServicePage from './pages/TermsOfServicePage';
import TestimonialsPage from './pages/TestimonialsPage';
import ContactPage from './pages/ContactPage';
import AboutPage from './pages/AboutPage';
import CareersPage from './pages/CareersPage';
import AIAnalyticsTest from './components/Sections/AIAssistance/AIAnalyticsTest';
import ChartTest from './components/Sections/AIAssistance/ChartTest';
import HomePage from './pages/HomePage';
import Waitlist from './components/Sections/Waitlist/Waitlist';
import ChartDashboardPreview from './components/Sections/AIAssistance/ChartDashboardPreview';
import ProtectedRoute from './components/ProtectedRoute';
import WorkflowPanelsPage from './pages/WorkflowPanelsPage';
import LearnPage from './pages/LearnPage';

const AppContent = () => {
  const location = useLocation();
  const isAIAssistancePage = location.pathname === '/ai-assistance';
  const isDocsInteractionPage = location.pathname === '/document-chat' || 
                               location.pathname === '/upload' || 
                               location.pathname === '/docs-interaction/upload';
  const isDocumentDraftingPage = location.pathname === '/document-drafting' || 
                                 location.pathname === '/documents-drafting';
  const isDocumentHistoryPage = location.pathname === '/document-history';
  const isVaultPage = location.pathname.startsWith('/vault') || location.pathname.startsWith('/vault/chat/') || location.pathname.startsWith('/vault/edit/');
  const isWaitlistPage = location.pathname === '/waitlist';
  const shouldHideNavbarFooter = isAIAssistancePage || isDocsInteractionPage || isDocumentDraftingPage || isDocumentHistoryPage || isVaultPage || isWaitlistPage || location.pathname === '/learn';

  return (
    <div className="min-h-screen">
      {!shouldHideNavbarFooter && <Navbar />}
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/waitlist" element={<Waitlist />} />
          <Route path="/ai-assistance" element={<ProtectedRoute><AIAssistancePage /></ProtectedRoute>} />
          <Route path="/document-drafting" element={<ProtectedRoute><DocumentDraftingPage /></ProtectedRoute>} />
          <Route path="/documents-drafting" element={<ProtectedRoute><DocumentDraftingPage /></ProtectedRoute>} />
          <Route path="/document-history" element={<ProtectedRoute><DocumentHistoryPage /></ProtectedRoute>} />
          <Route path="/document-chat" element={<ProtectedRoute><DocumentChatPage /></ProtectedRoute>} />
          <Route path="/upload" element={<ProtectedRoute><UploadPage /></ProtectedRoute>} />
          <Route path="/docs-interaction/upload" element={<ProtectedRoute><UploadPage /></ProtectedRoute>} />
          <Route path="/vault" element={<ProtectedRoute><VaultPage /></ProtectedRoute>} />
          <Route path="/vault/chat/:sessionId" element={<ProtectedRoute><VaultChatView /></ProtectedRoute>} />
          <Route path="/vault/edit/:sessionId" element={<ProtectedRoute><VaultEditView /></ProtectedRoute>} />
          <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
          <Route path="/terms-of-service" element={<TermsOfServicePage />} />
          <Route path="/testimonials" element={<TestimonialsPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/careers" element={<CareersPage />} />
          <Route path="/analytics-test" element={<ProtectedRoute><AIAnalyticsTest /></ProtectedRoute>} />
          <Route path="/chart-test" element={<ProtectedRoute><ChartTest /></ProtectedRoute>} />
          <Route path="/charts" element={<ProtectedRoute><ChartDashboardPreview /></ProtectedRoute>} />
          <Route path="/workflow-panels" element={<WorkflowPanelsPage />} />
          <Route path="/workflow" element={<WorkflowPanelsPage />} />
          <Route path="/learn" element={<LearnPage />} />
          {/* Catch-all route for undefined routes */}
          <Route path="*" element={<HomePage />} />
        </Routes>
      </main>
      {!shouldHideNavbarFooter && <Footer />}
    </div>
  );
};

const App = () => {
  return (
    <>
      <ThemeProvider>
        <PopupProvider>
          <AppContent />
        </PopupProvider>
      </ThemeProvider>
    </>
  );
};

export default App;