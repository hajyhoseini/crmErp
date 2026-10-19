import React from 'react';
import { Button, Result } from 'antd';
import { useNavigate } from 'react-router-dom';
import { HomeOutlined } from '@ant-design/icons';
import { fa } from '../i18n/fa';

export const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div
      style={{
        minHeight: '80vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        direction: 'rtl',
      }}
    >
      <Result
        status="404"
        title="۴۰۴"
        subTitle={fa.notFoundPage.subtitle}
        extra={
          <Button
            type="primary"
            icon={<HomeOutlined />}
            onClick={() => navigate('/')}
          >
            {fa.notFoundPage.backHome}
          </Button>
        }
      />
    </div>
  );
};
