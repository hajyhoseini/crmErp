import React from 'react';
import { Button, Card } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { PageHeader } from '../components/PageHeader';
import { EmptyState } from '../components/EmptyState';
import { fa } from '../i18n/fa';

export const DealsPage: React.FC = () => {
  return (
    <div>
      <PageHeader
        title={fa.deals.title}
        subtitle={fa.deals.subtitle}
        actions={
          <Button type="primary" icon={<PlusOutlined />} disabled>
            {fa.deals.create}
          </Button>
        }
      />

      <Card bordered={false}>
        <EmptyState
          message={fa.deals.emptyMessage}
          description="بورد کانبان و جدول معاملات در فاز ۳ پیاده‌سازی خواهد شد."
        />
      </Card>
    </div>
  );
};
