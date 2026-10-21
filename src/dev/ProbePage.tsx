import React, { useState } from 'react';
import { Card, Table, Button, Tag, Modal, message, Space } from 'antd';
import { PlayCircleOutlined, CopyOutlined, EyeOutlined } from '@ant-design/icons';
import { PageHeader } from '../components/PageHeader';
import { probeEndpoints, type ProbeEndpoint } from './probeEndpoints';
import { runProbe, type ProbeResult } from '../api/probe';
import { fa } from '../i18n/fa';
import { formatNumber } from '../utils/format';

interface TableRecord extends ProbeEndpoint {
  result?: ProbeResult;
  loading: boolean;
}

function getErrorMessage(body: unknown): string | null {
  if (body && typeof body === 'object') {
    const errorBody = body as { errors?: Array<{ message?: string }>; message?: string };
    if (errorBody.errors?.[0]?.message) {
      return errorBody.errors[0].message;
    }
    if (typeof errorBody.message === 'string') {
      return errorBody.message;
    }
  }
  return null;
}

const ProbePage: React.FC = () => {
  const [results, setResults] = useState<Record<string, ProbeResult>>({});
  const [loadingMap, setLoadingMap] = useState<Record<string, boolean>>({});
  const [isRunningAll, setIsRunningAll] = useState(false);
  const [activeModalEndpoint, setActiveModalEndpoint] = useState<ProbeEndpoint | null>(null);
  const [messageApi, contextHolder] = message.useMessage();

  const handleRunAll = async () => {
    setIsRunningAll(true);
    for (const ep of probeEndpoints) {
      setLoadingMap((prev) => ({ ...prev, [ep.path]: true }));
      try {
        const res = await runProbe(ep.path);
        setResults((prev) => ({ ...prev, [ep.path]: res }));
      } finally {
        setLoadingMap((prev) => ({ ...prev, [ep.path]: false }));
      }
    }
    setIsRunningAll(false);
  };

  const handleRunSingle = async (path: string) => {
    setLoadingMap((prev) => ({ ...prev, [path]: true }));
    try {
      const res = await runProbe(path);
      setResults((prev) => ({ ...prev, [path]: res }));
    } finally {
      setLoadingMap((prev) => ({ ...prev, [path]: false }));
    }
  };

  const activeResult = activeModalEndpoint ? results[activeModalEndpoint.path] : null;
  const rawJson = activeResult?.body !== undefined ? JSON.stringify(activeResult.body, null, 2) : '';
  const isTruncated = rawJson.length > 4000;
  const displayedJson = isTruncated
    ? rawJson.slice(0, 4000) + '\n\n... (' + fa.devProbe.continued + ')'
    : rawJson;

  const handleCopyJson = async (text: string) => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(text);
        messageApi.success(fa.devProbe.copySuccess);
      } else {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.opacity = '0';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        const successful = document.execCommand('copy');
        document.body.removeChild(textArea);
        if (successful) {
          messageApi.success(fa.devProbe.copySuccess);
        } else {
          messageApi.error(fa.devProbe.copyFailed);
        }
      }
    } catch {
      messageApi.error(fa.devProbe.copyFailed);
    }
  };

  const dataSource: TableRecord[] = probeEndpoints.map((ep) => ({
    ...ep,
    result: results[ep.path],
    loading: Boolean(loadingMap[ep.path]),
  }));

  const columns = [
    {
      title: fa.devProbe.endpoint,
      dataIndex: 'path',
      key: 'path',
      render: (path: string, record: TableRecord) => (
        <div>
          <div dir="ltr" style={{ fontFamily: 'monospace', fontWeight: 600, color: '#1e293b' }}>
            {path}
          </div>
          <div style={{ fontSize: 12, color: '#64748b', marginBlockStart: 2 }}>
            {record.label}
          </div>
        </div>
      ),
    },
    {
      title: fa.devProbe.status,
      dataIndex: 'result',
      key: 'status',
      width: 220,
      render: (_: unknown, record: TableRecord) => {
        if (record.loading) {
          return <span style={{ color: '#64748b' }}>{fa.devProbe.running}</span>;
        }
        if (!record.result) {
          return <span style={{ color: '#94a3b8' }}>{fa.devProbe.notRunYet}</span>;
        }
        const status = record.result.status;
        const color = status >= 200 && status < 300 ? 'success' : status >= 400 && status < 500 ? 'warning' : 'error';
        const serverMsg = status >= 200 && status < 300 ? null : getErrorMessage(record.result.body);

        return (
          <div>
            <Tag color={color}>{formatNumber(status)}</Tag>
            {serverMsg && (
              <div style={{ fontSize: 12, color: '#dc2626', marginBlockStart: 4, wordBreak: 'break-word' }}>
                {serverMsg}
              </div>
            )}
          </div>
        );
      },
    },
    {
      title: fa.devProbe.errorCode,
      dataIndex: 'result',
      key: 'code',
      width: 140,
      render: (_: unknown, record: TableRecord) => {
        if (!record.result || record.loading) {
          return '-';
        }
        return record.result.code ? (
          <Tag color="volcano">{record.result.code}</Tag>
        ) : (
          '-'
        );
      },
    },
    {
      title: fa.devProbe.duration,
      dataIndex: 'result',
      key: 'duration',
      width: 140,
      render: (_: unknown, record: TableRecord) => {
        if (!record.result || record.loading) {
          return '-';
        }
        return `${formatNumber(record.result.durationMs)} ${fa.devProbe.ms}`;
      },
    },
    {
      title: fa.common.actions,
      key: 'actions',
      width: 180,
      render: (_: unknown, record: TableRecord) => (
        <Space size="small">
          <Button
            size="small"
            type="primary"
            ghost
            icon={<EyeOutlined />}
            disabled={!record.result || record.loading}
            onClick={() => setActiveModalEndpoint(record)}
          >
            {fa.devProbe.showJson}
          </Button>
          <Button
            size="small"
            icon={<PlayCircleOutlined />}
            loading={record.loading}
            disabled={isRunningAll}
            onClick={() => handleRunSingle(record.path)}
          >
            {fa.devProbe.runSingle}
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      {contextHolder}
      <PageHeader
        title={fa.devProbe.title}
        subtitle={fa.devProbe.subtitle}
        actions={
          <Button
            type="primary"
            icon={<PlayCircleOutlined />}
            loading={isRunningAll}
            onClick={handleRunAll}
          >
            {fa.devProbe.runAll}
          </Button>
        }
      />

      <Card bordered={false}>
        <Table
          rowKey="path"
          dataSource={dataSource}
          columns={columns}
          pagination={false}
          size="middle"
        />
      </Card>

      <Modal
        title={
          <div>
            <span>{fa.devProbe.modalTitle}</span>
            {activeModalEndpoint && (
              <div dir="ltr" style={{ fontSize: 13, color: '#64748b', fontFamily: 'monospace', marginBlockStart: 4 }}>
                {activeModalEndpoint.path}
              </div>
            )}
          </div>
        }
        open={Boolean(activeModalEndpoint)}
        onCancel={() => setActiveModalEndpoint(null)}
        width={720}
        footer={[
          <Button key="close" onClick={() => setActiveModalEndpoint(null)}>
            {fa.devProbe.close}
          </Button>,
          <Button
            key="copy"
            type="primary"
            icon={<CopyOutlined />}
            onClick={() => handleCopyJson(rawJson)}
          >
            {fa.devProbe.copyJson}
          </Button>,
        ]}
      >
        {isTruncated && (
          <div
            style={{
              padding: '6px 12px',
              backgroundColor: '#fffbeb',
              border: '1px solid #fef3c7',
              borderRadius: 6,
              color: '#b45309',
              fontSize: 12,
              fontWeight: 500,
              marginBlockEnd: 12,
            }}
          >
            {fa.devProbe.continued}
          </div>
        )}
        <pre
          dir="ltr"
          style={{
            fontFamily: 'monospace, monospace',
            backgroundColor: '#0f172a',
            color: '#f8fafc',
            padding: 16,
            borderRadius: 8,
            maxHeight: 460,
            overflow: 'auto',
            fontSize: 12,
            lineHeight: 1.5,
            margin: 0,
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-all',
          }}
        >
          {displayedJson}
        </pre>
      </Modal>
    </div>
  );
};

export default ProbePage;
