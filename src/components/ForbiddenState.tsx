import React from 'react';
import { Button, Result } from 'antd';
import { useNavigate } from 'react-router-dom';
import { HomeOutlined } from '@ant-design/icons';
import { fa } from '../i18n/fa';

export const ForbiddenState: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div
      style={{
        padding: '32px 16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
      role="alert"
    >
      <Result
        status="403"
        title="۴۰۳"
        subTitle={fa.forbiddenPage.subtitle}
        extra={
          <Button
            type="primary"
            icon={<HomeOutlined />}
            onClick={() => navigate('/')}
          >
            {fa.forbiddenPage.backHome}
          </Button>
        }
      />
    </div>
  );
};
