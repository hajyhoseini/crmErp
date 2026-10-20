import React, { useMemo } from 'react';
import { Card, Row, Col } from 'antd';
import { useNavigate } from 'react-router-dom';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { useAuth } from '../auth/useAuth';
import { useCan } from '../auth/useCan';
import { PageHeader } from '../components/PageHeader';
import { EmptyState } from '../components/EmptyState';
import { fa } from '../i18n/fa';
import { navItems } from '../layouts/navConfig';

export const HomePage: React.FC = () => {
  const { user } = useAuth();
  const can = useCan;
  const navigate = useNavigate();

  const displayName = user?.nickname || user?.username || user?.email || '';
  const welcomeText = displayName
    ? fa.home.welcome.replace('{name}', displayName)
    : fa.home.welcomeDefault;

  const accessibleModules = useMemo(() => {
    return navItems.filter((item) => item.path !== '/' && (!item.snippet || can(item.snippet)));
  }, [can]);

  return (
    <div>
      <PageHeader
        title={welcomeText}
        subtitle={fa.home.quickAccess}
      />

      {accessibleModules.length === 0 ? (
        <Card bordered={false}>
          <EmptyState message={fa.home.noModulesAvailable} />
        </Card>
      ) : (
        <Row gutter={[16, 16]}>
          {accessibleModules.map((item) => (
            <Col xs={24} sm={12} md={8} lg={6} key={item.key}>
              <Card
                hoverable
                onClick={() => navigate(item.path)}
                style={{
                  borderRadius: 10,
                  border: '1px solid #e2e8f0',
                  height: '100%',
                }}
                styles={{
                  body: {
                    padding: 20,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    minHeight: 120,
                  },
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div
                    style={{
                      fontSize: 22,
                      color: '#2563eb',
                      display: 'flex',
                      alignItems: 'center',
                    }}
                  >
                    {item.icon}
                  </div>
                  <span style={{ fontSize: 15, fontWeight: 600, color: '#0f172a' }}>
                    {item.label}
                  </span>
                </div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'flex-end',
                    color: '#64748b',
                    fontSize: 12,
                    marginBlockStart: 12,
                  }}
                >
                  <ArrowLeftOutlined />
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </div>
  );
};
