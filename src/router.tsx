import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ProtectedRoute } from './auth/ProtectedRoute';
import { Can } from './auth/Can';
import { AppLayout } from './layouts/AppLayout';
import { LoginPage } from './pages/LoginPage';
import { HomePage } from './pages/HomePage';
import { KnowledgePage } from './pages/KnowledgePage';
import { SpeechPage } from './pages/SpeechPage';
import { PlaceholderPage } from './pages/PlaceholderPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { ForbiddenState } from './components/ForbiddenState';
import { fa } from './i18n/fa';
import ProbePage from './dev/ProbePage';

export const AppRoutes: React.FC = () => {
  let devRoute: React.ReactNode = null;
  if (import.meta.env.DEV) {
    devRoute = <Route path="dev/probe" element={<ProbePage />} />;
  }

  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<HomePage />} />
        <Route
          path="processes"
          element={
            <Can snippet="pm.process-designer.use" fallback={<ForbiddenState />}>
              <PlaceholderPage title={fa.nav.processes} />
            </Can>
          }
        />
        <Route
          path="knowledge"
          element={
            <Can snippet="pm.knowledge.manage" fallback={<ForbiddenState />}>
              <KnowledgePage />
            </Can>
          }
        />
        <Route
          path="positions"
          element={
            <Can snippet="pm.organization.positions" fallback={<ForbiddenState />}>
              <PlaceholderPage title={fa.nav.positions} />
            </Can>
          }
        />
        <Route
          path="external-sync"
          element={
            <Can snippet="pm.external-data.sync" fallback={<ForbiddenState />}>
              <PlaceholderPage title={fa.nav.externalSync} />
            </Can>
          }
        />
        <Route
          path="settings/knowledge"
          element={
            <Can snippet="pm.knowledge.settings" fallback={<ForbiddenState />}>
              <PlaceholderPage title={fa.nav.knowledgeSettings} />
            </Can>
          }
        />
        <Route
          path="speech"
          element={
            <Can snippet="pm.speech.settings" fallback={<ForbiddenState />}>
              <SpeechPage />
            </Can>
          }
        />
        {devRoute}
      </Route>
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};
