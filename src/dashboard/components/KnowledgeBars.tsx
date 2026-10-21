import React from 'react';
import { Button, Spin, Empty, Tag } from 'antd';
import { ReloadOutlined, WarningOutlined } from '@ant-design/icons';
import type { KnowledgeCategoryItem, KnowledgeStateData } from '../../api/dashboard';
import { formatPersianNumber, percent } from '../format';
import { fa } from '../../i18n/fa';

export interface KnowledgeBarsProps {
  categories: KnowledgeCategoryItem[];
  state?: KnowledgeStateData | null;
  loading: boolean;
  error?: string | null;
  onRetry?: () => void;
}

const KnowledgeBars: React.FC<KnowledgeBarsProps> = ({
  categories,
  state,
  loading,
  error,
  onRetry,
}) => {
  const isConfigured = state?.configured ?? true;
  const maxMb = state?.maxMegabytes ?? 0;

  return (
    <div className="dashboard-card">
      <div className="dashboard-card-header">
        <div>
          <h2 className="dashboard-card-title">{fa.dashboard.knowledgeTitle}</h2>
          {maxMb > 0 && (
            <div style={{ fontSize: 12, color: '#64748b', marginBlockStart: 2 }}>
              {fa.dashboard.maxMegabytes.replace('{size}', formatPersianNumber(maxMb))}
            </div>
          )}
        </div>
        {!isConfigured && (
          <Tag color="warning" icon={<WarningOutlined />} style={{ borderRadius: 6, margin: 0 }}>
            {fa.dashboard.knowledgeDisabledNotice}
          </Tag>
        )}
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
        ) : categories.length === 0 ? (
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description={fa.dashboard.noCategories}
          />
        ) : (
          <div>
            {categories.map((cat) => {
              const readyPct = percent(cat.ready, cat.documents);

              return (
                <div key={cat.id} className="dashboard-knowledge-row">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 13 }}>
                    <span style={{ fontWeight: 600, color: '#1e293b' }}>{cat.title}</span>
                    <span style={{ color: '#64748b', fontSize: 12 }}>
                      {fa.dashboard.categoryDocumentsRatio
                        .replace('{ready}', formatPersianNumber(cat.ready))
                        .replace('{total}', formatPersianNumber(cat.documents))}{' '}
                      ({formatPersianNumber(readyPct)}٪)
                    </span>
                  </div>
                  <div className="dashboard-knowledge-track">
                    <div
                      className="dashboard-knowledge-fill"
                      style={{ width: `${readyPct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default KnowledgeBars;
