import React from 'react';
import { Empty } from 'antd';
import { fa } from '../i18n/fa';

export interface EmptyStateProps {
  message?: React.ReactNode;
  description?: React.ReactNode;
  action?: React.ReactNode;
  children?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  message = fa.common.empty,
  description,
  action,
  children,
}) => {
  return (
    <div
      style={{
        padding: '48px 24px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
      }}
      role="region"
      aria-label={typeof message === 'string' ? message : fa.common.empty}
    >
      <Empty
        image={Empty.PRESENTED_IMAGE_SIMPLE}
        description={
          <div style={{ marginTop: 8 }}>
            <div style={{ fontSize: 15, fontWeight: 500, color: '#334155' }}>{message}</div>
            {description && (
              <div style={{ fontSize: 13, color: '#94a3b8', marginTop: 4 }}>{description}</div>
            )}
          </div>
        }
      >
        {action && <div style={{ marginTop: 16 }}>{action}</div>}
        {children}
      </Empty>
    </div>
  );
};
