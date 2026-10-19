import React from 'react';
import { Button, Card } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { PageHeader } from '../components/PageHeader';
import { EmptyState } from '../components/EmptyState';
import { fa } from '../i18n/fa';

export const ActivitiesPage: React.FC = () => {
  return (
    <div>
      <PageHeader
        title={fa.activities.title}
        subtitle={fa.activities.subtitle}
        actions={
          <Button type="primary" icon={<PlusOutlined />} disabled>
            {fa.activities.create}
          </Button>
        }
      />

      <Card bordered={false}>
        <EmptyState
          message={fa.activities.emptyMessage}
          description="مدیریت فعالیت‌ها و پیگیری‌ها در فاز ۴ پیاده‌سازی خواهد شد."
        />
      </Card>
    </div>
  );
};
