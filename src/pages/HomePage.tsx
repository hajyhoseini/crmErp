import React, { useMemo } from 'react';
import { Row, Col, Card, Empty, Tag } from 'antd';
import {
  ApartmentOutlined,
  TeamOutlined,
  BookOutlined,
  CheckCircleOutlined,
} from '@ant-design/icons';
import { useAuth } from '../auth/useAuth';
import { useDashboardData } from '../dashboard/useDashboardData';
import {
  formatPersianDate,
  percent,
  groupPositionsByDepartment,
} from '../dashboard/format';
import KpiTile from '../dashboard/components/KpiTile';
import ProcessList from '../dashboard/components/ProcessList';
import PositionGroups from '../dashboard/components/PositionGroups';
import KnowledgeBars from '../dashboard/components/KnowledgeBars';
import SyncSummary from '../dashboard/components/SyncSummary';
import SpeechStatus from '../dashboard/components/SpeechStatus';
import { fa } from '../i18n/fa';
import '../styles/dashboard.css';

const HomePage: React.FC = () => {
  const { user, activeRole } = useAuth();
  const {
    canProcesses,
    canPositions,
    canKnowledge,
    canSync,
    canSpeech,
    authQuery,
    rolesQuery,
    processesQuery,
    positionsQuery,
    departmentsQuery,
    knowledgeCategoriesQuery,
    knowledgeStateQuery,
    externalSyncsQuery,
    externalSyncRunsQuery,
    speechQuery,
  } = useDashboardData();

  const nickname = authQuery.data?.nickname || user?.nickname || '';
  const greeting = nickname
    ? fa.dashboard.greeting.replace('{name}', nickname)
    : fa.dashboard.greetingDefault;

  const activeRoleName = rolesQuery.data?.role || activeRole;
  const activeRoleTitle =
    authQuery.data?.roles?.find((r) => r.name === activeRoleName)?.title ||
    user?.roles?.find((r) => r.name === activeRoleName)?.title ||
    activeRoleName ||
    '';

  const currentDateString = useMemo(() => {
    return formatPersianDate(new Date(), false);
  }, []);

  const totalProcesses = processesQuery.data?.length ?? 0;
  const totalPositions = positionsQuery.data?.count ?? 0;

  const knowledgeCategories = knowledgeCategoriesQuery.data ?? [];
  const totalDocuments = knowledgeCategories.reduce(
    (acc, cat) => acc + (cat.documents || 0),
    0
  );
  const totalReady = knowledgeCategories.reduce(
    (acc, cat) => acc + (cat.ready || 0),
    0
  );
  const readyPercent = percent(totalReady, totalDocuments);

  const positionGroups = useMemo(() => {
    return groupPositionsByDepartment(
      positionsQuery.data?.positions ?? [],
      departmentsQuery.data ?? [],
      fa.dashboard.unassignedDepartment
    );
  }, [positionsQuery.data?.positions, departmentsQuery.data]);

  const hasAnyVisibleCard =
    canProcesses || canPositions || canKnowledge || canSync || canSpeech;

  return (
    <div className="dashboard-container">
      <div className="dashboard-header-card">
        <div>
          <h1 className="dashboard-greeting-title">{greeting}</h1>
          <div className="dashboard-greeting-subtitle">
            {activeRoleTitle && (
              <Tag color="blue" style={{ borderRadius: 6, margin: 0 }}>
                {activeRoleTitle}
              </Tag>
            )}
            <span>
              {fa.dashboard.currentDate.replace('{date}', currentDateString)}
            </span>
          </div>
        </div>
      </div>

      {hasAnyVisibleCard && (
        <div className="dashboard-kpi-grid">
          {canProcesses && (
            <KpiTile
              title={fa.dashboard.totalProcesses}
              value={totalProcesses}
              icon={<ApartmentOutlined />}
              color="#2563eb"
              loading={processesQuery.isLoading}
            />
          )}

          {canPositions && (
            <KpiTile
              title={fa.dashboard.totalPositions}
              value={totalPositions}
              icon={<TeamOutlined />}
              color="#14b8a6"
              loading={positionsQuery.isLoading}
            />
          )}

          {canKnowledge && (
            <KpiTile
              title={fa.dashboard.totalDocuments}
              value={totalDocuments}
              icon={<BookOutlined />}
              color="#f59e0b"
              loading={knowledgeCategoriesQuery.isLoading}
            />
          )}

          {canKnowledge && (
            <KpiTile
              title={fa.dashboard.readyRate}
              value={totalReady}
              percentValue={readyPercent}
              isPercentRing
              icon={<CheckCircleOutlined />}
              color="#10b981"
              loading={knowledgeCategoriesQuery.isLoading}
            />
          )}
        </div>
      )}

      {!hasAnyVisibleCard ? (
        <Card bordered={false} className="dashboard-card">
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description={fa.home.noModulesAvailable}
          />
        </Card>
      ) : (
        <Row gutter={[20, 20]}>
          {canProcesses && (
            <Col xs={24} lg={12}>
              <ProcessList
                processes={processesQuery.data ?? []}
                loading={processesQuery.isLoading}
                error={processesQuery.isError ? fa.errors.default : null}
                onRetry={() => processesQuery.refetch()}
              />
            </Col>
          )}

          {canPositions && (
            <Col xs={24} lg={12}>
              <PositionGroups
                groups={positionGroups}
                totalPositions={totalPositions}
                loading={positionsQuery.isLoading || departmentsQuery.isLoading}
                error={
                  positionsQuery.isError || departmentsQuery.isError
                    ? fa.errors.default
                    : null
                }
                onRetry={() => {
                  positionsQuery.refetch();
                  departmentsQuery.refetch();
                }}
              />
            </Col>
          )}

          {canKnowledge && (
            <Col xs={24} lg={12}>
              <KnowledgeBars
                categories={knowledgeCategories}
                state={knowledgeStateQuery.data}
                loading={
                  knowledgeCategoriesQuery.isLoading ||
                  knowledgeStateQuery.isLoading
                }
                error={
                  knowledgeCategoriesQuery.isError ||
                  knowledgeStateQuery.isError
                    ? fa.errors.default
                    : null
                }
                onRetry={() => {
                  knowledgeCategoriesQuery.refetch();
                  knowledgeStateQuery.refetch();
                }}
              />
            </Col>
          )}

          {canSync && (
            <Col xs={24} lg={12}>
              <SyncSummary
                syncsCount={externalSyncsQuery.data?.length ?? 0}
                runsCount={externalSyncRunsQuery.data?.length ?? 0}
                loading={
                  externalSyncsQuery.isLoading ||
                  externalSyncRunsQuery.isLoading
                }
                error={
                  externalSyncsQuery.isError || externalSyncRunsQuery.isError
                    ? fa.errors.default
                    : null
                }
                onRetry={() => {
                  externalSyncsQuery.refetch();
                  externalSyncRunsQuery.refetch();
                }}
              />
            </Col>
          )}

          {canSpeech && (
            <Col xs={24} lg={12}>
              <SpeechStatus
                available={speechQuery.data?.available ?? false}
                configured={speechQuery.data?.configured ?? false}
                loading={speechQuery.isLoading}
              />
            </Col>
          )}
        </Row>
      )}
    </div>
  );
};

export { HomePage };
export default HomePage;
