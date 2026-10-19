import React from 'react';
import { Button, Card } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { PageHeader } from '../components/PageHeader';
import { EmptyState } from '../components/EmptyState';
import { fa } from '../i18n/fa';

export const CompaniesPage: React.FC = () => {
  return (
    <div>
      <PageHeader
        title={fa.companies.title}
        subtitle={fa.companies.subtitle}
        actions={
          <Button type="primary" icon={<PlusOutlined />} disabled>
            {fa.companies.create}
          </Button>
        }
      />

      <Card bordered={false}>
        <EmptyState
          message={fa.companies.emptyMessage}
          description="مدیریت شرکت‌ها در فاز ۲ پیاده‌سازی خواهد شد."
        />
      </Card>
    </div>
  );
};
