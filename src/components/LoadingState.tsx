import React from 'react';
import { Spin } from 'antd';
import { fa } from '../i18n/fa';

export interface LoadingStateProps {
  tip?: string;
  minHeight?: number | string;
}

export const LoadingState: React.FC<LoadingStateProps> = ({
  tip = fa.common.loading,
  minHeight = 240,
}) => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight,
        padding: 32,
        gap: 12,
      }}
      role="status"
      aria-live="polite"
    >
      <Spin size="large" />
      {tip && (
        <span style={{ fontSize: 13, color: '#64748b' }}>
          {tip}
        </span>
      )}
    </div>
  );
};
