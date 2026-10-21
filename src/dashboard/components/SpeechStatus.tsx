import React from 'react';
import { Spin, Tag } from 'antd';
import { fa } from '../../i18n/fa';

export interface SpeechStatusProps {
  available: boolean;
  configured: boolean;
  loading: boolean;
}

const SpeechStatus: React.FC<SpeechStatusProps> = ({
  available,
  configured,
  loading,
}) => {
  return (
    <div className="dashboard-card">
      <div className="dashboard-card-header">
        <h2 className="dashboard-card-title">{fa.dashboard.speechTitle}</h2>
      </div>

      <div className="dashboard-card-body">
        {loading ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: 8 }}>
            <Spin size="small" />
            <span style={{ fontSize: 13, color: '#64748b' }}>{fa.common.loading}</span>
          </div>
        ) : !available ? (
          <div className="dashboard-speech-card-content">
            <Tag color="default" style={{ borderRadius: 6, margin: 0, paddingInline: 12, paddingBlock: 4 }}>
              {fa.dashboard.speechUnavailable}
            </Tag>
          </div>
        ) : (
          <div className="dashboard-speech-card-content">
            <div
              className="dashboard-status-dot"
              style={{ backgroundColor: configured ? '#16a34a' : '#d97706' }}
            />
            <span style={{ fontSize: 14, fontWeight: 500, color: configured ? '#16a34a' : '#d97706' }}>
              {configured ? fa.dashboard.speechActive : fa.dashboard.speechInactive}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default SpeechStatus;
