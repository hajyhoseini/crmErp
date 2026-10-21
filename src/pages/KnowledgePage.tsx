import React, { useEffect, useState } from 'react';
import { Card, Tag } from 'antd';
import { PageHeader } from '../components/PageHeader';
import { EmptyState } from '../components/EmptyState';
import { LoadingState } from '../components/LoadingState';
import { ErrorState } from '../components/ErrorState';
import { fa } from '../i18n/fa';
import { getKnowledgeState } from '../api/services';

export const KnowledgePage: React.FC = () => {
  const [configured, setConfigured] = useState<boolean | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchState = async (signal?: AbortSignal) => {
    setLoading(true);
    setError(null);
    try {
      const state = await getKnowledgeState(signal);
      setConfigured(state);
    } catch {
      setError(fa.errors.default);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const controller = new AbortController();
    fetchState(controller.signal);
    return () => {
      controller.abort();
    };
  }, []);

  if (loading) {
    return <LoadingState />;
  }

  if (error) {
    return <ErrorState message={error} onRetry={() => fetchState()} />;
  }

  return (
    <div>
      <PageHeader
        title={fa.nav.knowledge}
        actions={
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 13, color: '#64748b' }}>{fa.knowledge.status}</span>
            <Tag color={configured ? 'success' : 'default'}>
              {configured ? fa.knowledge.configured : fa.knowledge.notConfigured}
            </Tag>
          </div>
        }
      />
      <Card bordered={false}>
        <EmptyState
          message={fa.nav.knowledge}
          description={fa.placeholder.inProgress}
        />
      </Card>
    </div>
  );
};
