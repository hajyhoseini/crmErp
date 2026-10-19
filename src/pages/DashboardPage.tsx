import React from 'react';
import { Card, Row, Col } from 'antd';
import { PageHeader } from '../components/PageHeader';
import { EmptyState } from '../components/EmptyState';
import { fa } from '../i18n/fa';

export const DashboardPage: React.FC = () => {
  return (
    <div>
      <PageHeader
        title={fa.dashboard.title}
        subtitle={fa.dashboard.subtitle}
      />

      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card bordered={false}>
            <div style={{ fontSize: 13, color: '#64748b' }}>{fa.dashboard.pipelineValue}</div>
            <div style={{ fontSize: 24, fontWeight: 700, color: '#0f172a', marginTop: 8 }}>
              ۰ {fa.deals.irr}
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card bordered={false}>
            <div style={{ fontSize: 13, color: '#64748b' }}>{fa.dashboard.openDeals}</div>
            <div style={{ fontSize: 24, fontWeight: 700, color: '#2563eb', marginTop: 8 }}>
              ۰
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card bordered={false}>
            <div style={{ fontSize: 13, color: '#64748b' }}>{fa.dashboard.wonDeals}</div>
            <div style={{ fontSize: 24, fontWeight: 700, color: '#16a34a', marginTop: 8 }}>
              ۰
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card bordered={false}>
            <div style={{ fontSize: 13, color: '#64748b' }}>{fa.dashboard.pendingActivities}</div>
            <div style={{ fontSize: 24, fontWeight: 700, color: '#d97706', marginTop: 8 }}>
              ۰
            </div>
          </Card>
        </Col>
      </Row>

      <Card bordered={false}>
        <EmptyState
          message={fa.common.empty}
          description={fa.dashboard.phaseNotice}
        />
      </Card>
    </div>
  );
};
