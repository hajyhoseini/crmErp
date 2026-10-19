import React from 'react';
import { Button, Card } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { PageHeader } from '../components/PageHeader';
import { EmptyState } from '../components/EmptyState';
import { fa } from '../i18n/fa';

export const ContactsPage: React.FC = () => {
  return (
    <div>
      <PageHeader
        title={fa.contacts.title}
        subtitle={fa.contacts.subtitle}
        actions={
          <Button type="primary" icon={<PlusOutlined />} disabled>
            {fa.contacts.create}
          </Button>
        }
      />

      <Card bordered={false}>
        <EmptyState
          message={fa.contacts.emptyMessage}
          description="مدیریت مخاطبین در فاز ۲ پیاده‌سازی خواهد شد."
        />
      </Card>
    </div>
  );
};
