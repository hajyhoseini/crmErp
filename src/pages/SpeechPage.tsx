import React, { useEffect, useState } from 'react';
import { Card, Tag, Alert } from 'antd';
import { PageHeader } from '../components/PageHeader';
import { EmptyState } from '../components/EmptyState';
import { LoadingState } from '../components/LoadingState';
import { ErrorState } from '../components/ErrorState';
import { fa } from '../i18n/fa';
import { getSpeechState } from '../api/services';

export const SpeechPage: React.FC = () => {
  const [configured, setConfigured] = useState<boolean | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchState = async (signal?: AbortSignal) => {
    setLoading(true);
    setError(null);
    try {
      const state = await getSpeechState(signal);
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
        title={fa.nav.speech}
        actions={
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 13, color: '#64748b' }}>{fa.speech.status}</span>
            <Tag color={configured ? 'success' : 'warning'}>
              {configured ? fa.speech.configured : fa.knowledge.notConfigured}
            </Tag>
          </div>
        }
      />

      {!configured && (
        <div style={{ marginBlockEnd: 16 }}>
          <Alert
            type="warning"
            message={fa.speech.notAvailableNotice}
            showIcon
          />
        </div>
      )}

      <Card bordered={false}>
        <EmptyState
          message={fa.nav.speech}
          description={fa.placeholder.inProgress}
        />
      </Card>
    </div>
  );
};
