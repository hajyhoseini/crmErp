import React from 'react';
import { Spin } from 'antd';
import { useCountUp } from '../countUp';
import { formatPersianNumber } from '../format';

export interface KpiTileProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  color?: string;
  loading?: boolean;
  isPercentRing?: boolean;
  percentValue?: number;
}

const KpiTile: React.FC<KpiTileProps> = ({
  title,
  value,
  icon,
  color = '#2563eb',
  loading = false,
  isPercentRing = false,
  percentValue = 0,
}) => {
  const animatedValue = useCountUp(value, 600);
  const animatedPercent = useCountUp(percentValue, 600);

  const radius = 22;
  const strokeWidth = 4;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (animatedPercent / 100) * circumference;

  return (
    <div className="dashboard-card">
      <div className="dashboard-kpi-tile">
        <div style={{ flex: 1, minWidth: 0 }}>
          <div className="dashboard-kpi-label">{title}</div>
          <div className="dashboard-kpi-value" style={{ marginBlockStart: 4 }}>
            {loading ? (
              <Spin size="small" />
            ) : isPercentRing ? (
              <span>
                {formatPersianNumber(animatedPercent)}٪{' '}
                <span style={{ fontSize: 13, fontWeight: 500, color: '#64748b' }}>
                  ({formatPersianNumber(animatedValue)})
                </span>
              </span>
            ) : (
              formatPersianNumber(animatedValue)
            )}
          </div>
        </div>

        {isPercentRing ? (
          <div style={{ position: 'relative', width: 52, height: 52, flexShrink: 0 }}>
            <svg width="52" height="52" style={{ transform: 'rotate(-90deg)' }}>
              <circle
                cx="26"
                cy="26"
                r={radius}
                fill="transparent"
                stroke="#e2e8f0"
                strokeWidth={strokeWidth}
              />
              <circle
                cx="26"
                cy="26"
                r={radius}
                fill="transparent"
                stroke={color}
                strokeWidth={strokeWidth}
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                style={{ transition: 'stroke-dashoffset 0.4s ease' }}
              />
            </svg>
            <div
              style={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color,
                fontSize: 18,
              }}
            >
              {icon}
            </div>
          </div>
        ) : (
          <div
            className="dashboard-kpi-icon-wrapper"
            style={{
              backgroundColor: `${color}14`,
              color,
            }}
          >
            {icon}
          </div>
        )}
      </div>
    </div>
  );
};

export default KpiTile;
