import React from 'react';
import { Collapse, Button, Spin, Empty, Tag } from 'antd';
import { ReloadOutlined } from '@ant-design/icons';
import type { DepartmentPositionGroup } from '../format';
import { formatPersianNumber } from '../format';
import { fa } from '../../i18n/fa';

export interface PositionGroupsProps {
  groups: DepartmentPositionGroup[];
  totalPositions: number;
  loading: boolean;
  error?: string | null;
  onRetry?: () => void;
}

const PositionGroups: React.FC<PositionGroupsProps> = ({
  groups,
  totalPositions,
  loading,
  error,
  onRetry,
}) => {
  return (
    <div className="dashboard-card">
      <div className="dashboard-card-header">
        <h2 className="dashboard-card-title">{fa.dashboard.positionsTitle}</h2>
        <Tag color="cyan" style={{ borderRadius: 6, margin: 0 }}>
          {fa.dashboard.positionsCount.replace(
            '{count}',
            formatPersianNumber(totalPositions)
          )}
        </Tag>
      </div>

      <div className="dashboard-card-body">
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: 32 }}>
            <Spin />
          </div>
        ) : error ? (
          <div style={{ textAlign: 'center', padding: 24 }}>
            <div style={{ color: '#dc2626', fontSize: 13, marginBlockEnd: 12 }}>{error}</div>
            {onRetry && (
              <Button size="small" icon={<ReloadOutlined />} onClick={onRetry}>
                {fa.common.retry}
              </Button>
            )}
          </div>
        ) : groups.length === 0 ? (
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description={fa.dashboard.noPositions}
          />
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {groups.map((group) => {
              const panelHeader = (
                <div style={{ width: '100%', paddingInlineEnd: 8 }}>
                  <div className="dashboard-group-header">
                    <span style={{ fontWeight: 600, color: '#0f172a' }}>
                      {group.departmentTitle}
                    </span>
                    <span style={{ fontSize: 12, color: '#64748b' }}>
                      {formatPersianNumber(group.count)} ({formatPersianNumber(group.percent)}٪)
                    </span>
                  </div>
                  <div className="dashboard-group-bar-track">
                    <div
                      className="dashboard-group-bar-fill"
                      style={{ width: `${group.percent}%` }}
                    />
                  </div>
                </div>
              );

              return (
                <Collapse
                  key={group.departmentTitle}
                  defaultActiveKey={groups.length <= 3 ? ['1'] : []}
                  items={[
                    {
                      key: '1',
                      label: panelHeader,
                      children: (
                        <div>
                          {group.positions.map((pos) => (
                            <div key={pos.id} className="dashboard-position-item">
                              <span style={{ fontWeight: 500, color: '#1e293b' }}>
                                {pos.title}
                              </span>
                              {pos.authority && (
                                <Tag color="geekblue" style={{ borderRadius: 4, margin: 0 }}>
                                  {pos.authority}
                                </Tag>
                              )}
                            </div>
                          ))}
                        </div>
                      ),
                    },
                  ]}
                  style={{
                    backgroundColor: '#ffffff',
                    border: '1px solid #f1f5f9',
                    borderRadius: 8,
                  }}
                />
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default PositionGroups;
