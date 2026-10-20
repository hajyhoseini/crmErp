import React from 'react';

export interface PageHeaderProps {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  actions?: React.ReactNode;
}

export const PageHeader: React.FC<PageHeaderProps> = ({ title, subtitle, actions }) => {
  return (
    <header
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 16,
        marginBlockEnd: 24,
        paddingBlockEnd: 16,
        borderBottom: '1px solid #e2e8f0',
      }}
    >
      <div>
        <h1
          style={{
            margin: 0,
            fontSize: 20,
            fontWeight: 700,
            color: '#0f172a',
            lineHeight: 1.4,
          }}
        >
          {title}
        </h1>
        {subtitle && (
          <p
            style={{
              marginBlockStart: 4,
              marginBlockEnd: 0,
              fontSize: 13,
              color: '#64748b',
              lineHeight: 1.5,
            }}
          >
            {subtitle}
          </p>
        )}
      </div>

      {actions && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            flexWrap: 'wrap',
          }}
        >
          {actions}
        </div>
      )}
    </header>
  );
};
