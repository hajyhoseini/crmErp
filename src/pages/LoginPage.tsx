import React, { useState } from 'react';
import { useLocation, useNavigate, Navigate } from 'react-router-dom';
import { Form, Input, Button, Card, Alert } from 'antd';
import { LockOutlined, MailOutlined } from '@ant-design/icons';
import { useAuth } from '../auth/useAuth';
import { fa } from '../i18n/fa';
import { ApiError } from '../api/client';

interface LoginFormValues {
  account: string;
  password: string;
}

export const LoginPage: React.FC = () => {
  const [form] = Form.useForm<LoginFormValues>();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const { login, status } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // If already logged in, redirect directly
  const fromLocation = (location.state as { from?: { pathname?: string } })?.from?.pathname || '/';

  if (status === 'authenticated') {
    return <Navigate to={fromLocation} replace />;
  }

  const handleSubmit = async (values: LoginFormValues) => {
    setLoading(true);
    setErrorMessage(null);

    try {
      await login(values.account.trim(), values.password);
      navigate(fromLocation, { replace: true });
    } catch (err: unknown) {
      if (err instanceof ApiError) {
        if (err.status === 400 || err.status === 401) {
          setErrorMessage(fa.auth.invalidCredentials);
        } else if (err.status === 0) {
          setErrorMessage(fa.errors.networkError);
        } else {
          setErrorMessage(err.message || fa.errors.default);
        }
      } else if (err instanceof Error) {
        setErrorMessage(err.message || fa.errors.default);
      } else {
        setErrorMessage(fa.errors.default);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f1f5f9',
        padding: 16,
        direction: 'rtl',
      }}
    >
      <Card
        style={{
          width: '100%',
          maxWidth: 420,
          boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.03)',
          borderRadius: 16,
          border: '1px solid #e2e8f0',
        }}
        styles={{ body: { padding: '36px 28px' } }}
      >
        {/* Brand and Logo Header */}
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div
            style={{
              width: 52,
              height: 52,
              borderRadius: 12,
              backgroundColor: '#2563eb',
              color: '#ffffff',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 800,
              fontSize: 20,
              marginBottom: 12,
              boxShadow: '0 4px 12px rgba(37, 99, 235, 0.25)',
            }}
          >
            {fa.app.shortName}
          </div>
          <h1
            style={{
              margin: '0 0 6px 0',
              fontSize: 20,
              fontWeight: 700,
              color: '#0f172a',
            }}
          >
            {fa.auth.loginTitle}
          </h1>
          <p
            style={{
              margin: 0,
              fontSize: 13,
              color: '#64748b',
              lineHeight: 1.5,
            }}
          >
            {fa.auth.loginSubtitle}
          </p>
        </div>

        {/* Error notification alert */}
        {errorMessage && (
          <div style={{ marginBottom: 20 }}>
            <Alert
              message={errorMessage}
              type="error"
              showIcon
              closable
              onClose={() => setErrorMessage(null)}
            />
          </div>
        )}

        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          requiredMark={false}
          autoComplete="off"
        >
          <Form.Item
            name="account"
            label={
              <span style={{ fontWeight: 500, fontSize: 13, color: '#334155' }}>
                {fa.auth.emailOrAccount}
              </span>
            }
            rules={[
              { required: true, message: fa.validation.required },
            ]}
          >
            <Input
              prefix={<MailOutlined style={{ color: '#94a3b8' }} />}
              placeholder={fa.auth.emailOrAccountPlaceholder}
              size="large"
              className="ltr-input"
              autoFocus
            />
          </Form.Item>

          <Form.Item
            name="password"
            label={
              <span style={{ fontWeight: 500, fontSize: 13, color: '#334155' }}>
                {fa.auth.password}
              </span>
            }
            rules={[
              { required: true, message: fa.validation.required },
            ]}
          >
            <Input.Password
              prefix={<LockOutlined style={{ color: '#94a3b8' }} />}
              placeholder={fa.auth.passwordPlaceholder}
              size="large"
              className="ltr-input"
            />
          </Form.Item>

          <Form.Item style={{ marginTop: 24, marginBottom: 0 }}>
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              block
              loading={loading}
              style={{
                height: 44,
                fontWeight: 600,
                fontSize: 15,
              }}
            >
              {loading ? fa.auth.loggingIn : fa.auth.loginSubmit}
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </main>
  );
};
