import React, { useState, useMemo } from 'react';
import { Input, Button, Tag, Spin, Empty } from 'antd';
import { SearchOutlined, ReloadOutlined, DownOutlined, UpOutlined } from '@ant-design/icons';
import type { ProcessItem } from '../../api/dashboard';
import { formatPersianDate, formatPersianNumber } from '../format';
import { fa } from '../../i18n/fa';

export interface ProcessListProps {
  processes: ProcessItem[];
  loading: boolean;
  error?: string | null;
  onRetry?: () => void;
}

const BORDER_COLORS = ['#2563eb', '#14b8a6', '#f59e0b'];

const ProcessList: React.FC<ProcessListProps> = ({
  processes,
  loading,
  error,
  onRetry,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showAll, setShowAll] = useState(false);

  const sortedProcesses = useMemo(() => {
    return [...processes].sort((a, b) => {
      const timeA = a.updatedAt ? new Date(a.updatedAt).getTime() : 0;
      const timeB = b.updatedAt ? new Date(b.updatedAt).getTime() : 0;
      return timeB - timeA;
    });
  }, [processes]);

  const filteredProcesses = useMemo(() => {
    if (!searchTerm.trim()) return sortedProcesses;
    const term = searchTerm.trim().toLowerCase();
    return sortedProcesses.filter((item) =>
      item.title.toLowerCase().includes(term)
    );
  }, [sortedProcesses, searchTerm]);

  const displayedProcesses = showAll
    ? filteredProcesses
    : filteredProcesses.slice(0, 7);

  return (
    <div className="dashboard-card">
      <div className="dashboard-card-header">
        <h2 className="dashboard-card-title">{fa.dashboard.processesTitle}</h2>
        <Input
          dir="auto"
          placeholder={fa.dashboard.searchProcesses}
          prefix={<SearchOutlined style={{ color: '#94a3b8' }} />}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          allowClear
          style={{ maxWidth: 220, borderRadius: 8 }}
          size="middle"
        />
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
        ) : filteredProcesses.length === 0 ? (
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description={
              searchTerm ? fa.common.empty : fa.dashboard.noProcesses
            }
          />
        ) : (
          <div>
            <div>
              {displayedProcesses.map((process, index) => {
                const borderColor = BORDER_COLORS[index % BORDER_COLORS.length];
                return (
                  <div
                    key={process.id}
                    className="dashboard-process-item"
                    style={{ borderInlineStart: `4px solid ${borderColor}` }}
                  >
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div className="dashboard-process-title">{process.title}</div>
                      <div className="dashboard-process-meta">
                        {formatPersianDate(process.updatedAt)}
                      </div>
                    </div>
                    <div>
                      <Tag color="blue" style={{ borderRadius: 6, margin: 0 }}>
                        {fa.dashboard.versionTag.replace(
                          '{version}',
                          formatPersianNumber(process.currentVersion)
                        )}
                      </Tag>
                    </div>
                  </div>
                );
              })}
            </div>

            {filteredProcesses.length > 7 && (
              <div style={{ textAlign: 'center', marginBlockStart: 12 }}>
                <Button
                  type="link"
                  size="small"
                  icon={showAll ? <UpOutlined /> : <DownOutlined />}
                  onClick={() => setShowAll(!showAll)}
                >
                  {showAll
                    ? fa.dashboard.showLess
                    : fa.dashboard.showAll.replace(
                        '{count}',
                        formatPersianNumber(filteredProcesses.length)
                      )}
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProcessList;
