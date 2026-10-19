import React from 'react';
import { Button, Result } from 'antd';
import { ReloadOutlined } from '@ant-design/icons';
import { fa } from '../i18n/fa';

export interface ErrorStateProps {
  message?: React.ReactNode;
  subtitle?: React.ReactNode;
  onRetry?: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  message = fa.errors.default,
  subtitle,
  onRetry,
}) => {
  return (
    <div
      style={{
        padding: '32px 16px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
      role="alert"
    >
      <Result
        status="error"
        title={
          <span style={{ fontSize: 16, fontWeight: 600, color: '#0f172a' }}>
            {message}
          </span>
        }
        subTitle={
          subtitle && (
            <span style={{ fontSize: 13, color: '#64748b' }}>
              {subtitle}
            </span>
          )
        }
        extra={
          onRetry ? (
            <Button
              type="primary"
              icon={<ReloadOutlined />}
              onClick={onRetry}
            >
              {fa.common.retry}
            </Button>
          ) : undefined
        }
      />
    </div>
  );
};
