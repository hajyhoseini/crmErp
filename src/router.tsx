import { createBrowserRouter } from 'react-router-dom';
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

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <AppLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: 'processes',
        element: (
          <Can snippet="pm.process-designer.use" fallback={<ForbiddenState />}>
            <PlaceholderPage title={fa.nav.processes} />
          </Can>
        ),
      },
      {
        path: 'knowledge',
        element: (
          <Can snippet="pm.knowledge.manage" fallback={<ForbiddenState />}>
            <KnowledgePage />
          </Can>
        ),
      },
      {
        path: 'positions',
        element: (
          <Can snippet="pm.organization.positions" fallback={<ForbiddenState />}>
            <PlaceholderPage title={fa.nav.positions} />
          </Can>
        ),
      },
      {
        path: 'external-sync',
        element: (
          <Can snippet="pm.external-data.sync" fallback={<ForbiddenState />}>
            <PlaceholderPage title={fa.nav.externalSync} />
          </Can>
        ),
      },
      {
        path: 'settings/knowledge',
        element: (
          <Can snippet="pm.knowledge.settings" fallback={<ForbiddenState />}>
            <PlaceholderPage title={fa.nav.knowledgeSettings} />
          </Can>
        ),
      },
      {
        path: 'speech',
        element: (
          <Can snippet="pm.speech.settings" fallback={<ForbiddenState />}>
            <SpeechPage />
          </Can>
        ),
      },
    ],
  },
  {
    path: '*',
    element: <NotFoundPage />,
  },
]);
