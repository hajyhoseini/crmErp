import React from 'react';
import { Card } from 'antd';
import { PageHeader } from '../components/PageHeader';
import { EmptyState } from '../components/EmptyState';
import { fa } from '../i18n/fa';

export interface PlaceholderPageProps {
  title: string;
}

export const PlaceholderPage: React.FC<PlaceholderPageProps> = ({ title }) => {
  return (
    <div>
      <PageHeader title={title} />
      <Card bordered={false}>
        <EmptyState
          message={title}
          description={fa.placeholder.inProgress}
        />
      </Card>
    </div>
  );
};
