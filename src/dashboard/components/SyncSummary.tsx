import React from 'react';
import { Button, Spin, Empty } from 'antd';
import { ReloadOutlined } from '@ant-design/icons';
import { formatPersianNumber } from '../format';
import { fa } from '../../i18n/fa';

export interface SyncSummaryProps {
  syncsCount: number;
  runsCount: number;
  loading: boolean;
  error?: string | null;
  onRetry?: () => void;
}

const SyncSummary: React.FC<SyncSummaryProps> = ({
  syncsCount,
  runsCount,
  loading,
  error,
  onRetry,
}) => {
  const isBothEmpty = syncsCount === 0 && runsCount === 0;

  return (
    <div className="dashboard-card">
      <div className="dashboard-card-header">
        <h2 className="dashboard-card-title">{fa.dashboard.syncTitle}</h2>
      </div>

      <div className="dashboard-card-body">
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: 32 }}>
            <Spin />
          </div>
        ) : error ? (
          <div style={{ textAlign: 'center', padding: 24 }}>
            <div style={{ color: '#dc2626', fontSize: 13, marginBlockEnd: 12 }}>{error}</div>
            {onRetry && (
              <Button size="small" icon={<ReloadOutlined />} onClick={onRetry}>
                {fa.common.retry}
              </Button>
            )}
          </div>
        ) : isBothEmpty ? (
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description={fa.dashboard.emptySyncs}
          />
        ) : (
          <div className="dashboard-sync-blocks">
            <div className="dashboard-sync-block">
              <div className="dashboard-sync-number">{formatPersianNumber(syncsCount)}</div>
              <div className="dashboard-sync-label">{fa.dashboard.syncsCountLabel}</div>
            </div>
            <div className="dashboard-sync-block">
              <div className="dashboard-sync-number">{formatPersianNumber(runsCount)}</div>
              <div className="dashboard-sync-label">{fa.dashboard.runsCountLabel}</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SyncSummary;
