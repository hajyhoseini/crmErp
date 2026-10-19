import React, { useState, useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  Layout,
  Menu,
  Button,
  Dropdown,
  Avatar,
  Drawer,
  Grid,
  type MenuProps,
} from 'antd';
import {
  DashboardOutlined,
  BankOutlined,
  TeamOutlined,
  DollarOutlined,
  CheckSquareOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  MenuOutlined,
  UserOutlined,
  LogoutOutlined,
} from '@ant-design/icons';
import { useAuth } from '../auth/useAuth';
import { fa } from '../i18n/fa';

const { Header, Sider, Content } = Layout;
const { useBreakpoint } = Grid;

export const AppLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const screens = useBreakpoint();
  const isMobile = screens.md === false; // < 768px

  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileDrawerOpen(false);
  }, [location.pathname]);

  // Determine current active navigation key
  const selectedKey = React.useMemo(() => {
    const path = location.pathname;
    if (path === '/' || path.startsWith('/dashboard')) return 'dashboard';
    if (path.startsWith('/companies')) return 'companies';
    if (path.startsWith('/contacts')) return 'contacts';
    if (path.startsWith('/deals')) return 'deals';
    if (path.startsWith('/activities')) return 'activities';
    return 'dashboard';
  }, [location.pathname]);

  const menuItems: MenuProps['items'] = [
    {
      key: 'dashboard',
      icon: <DashboardOutlined />,
      label: fa.nav.dashboard,
      onClick: () => navigate('/'),
    },
    {
      key: 'companies',
      icon: <BankOutlined />,
      label: fa.nav.companies,
      onClick: () => navigate('/companies'),
    },
    {
      key: 'contacts',
      icon: <TeamOutlined />,
      label: fa.nav.contacts,
      onClick: () => navigate('/contacts'),
    },
    {
      key: 'deals',
      icon: <DollarOutlined />,
      label: fa.nav.deals,
      onClick: () => navigate('/deals'),
    },
    {
      key: 'activities',
      icon: <CheckSquareOutlined />,
      label: fa.nav.activities,
      onClick: () => navigate('/activities'),
    },
  ];

  const userMenuItems: MenuProps['items'] = [
    {
      key: 'user-info',
      disabled: true,
      label: (
        <div style={{ padding: '4px 0' }}>
          <div style={{ fontWeight: 600, color: '#0f172a' }}>
            {user?.name || user?.nickname || fa.auth.userProfile}
          </div>
          <div style={{ fontSize: 12, color: '#64748b' }} className="ltr-text">
            {user?.email || user?.account || ''}
          </div>
        </div>
      ),
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      danger: true,
      icon: <LogoutOutlined />,
      label: fa.auth.logout,
      onClick: () => {
        logout();
        navigate('/login', { replace: true });
      },
    },
  ];

  const brandHeader = (
    <div
      style={{
        height: 64,
        display: 'flex',
        alignItems: 'center',
        padding: '0 16px',
        borderBottom: '1px solid #f1f5f9',
        gap: 10,
      }}
    >
      <div
        style={{
          width: 34,
          height: 34,
          borderRadius: 8,
          backgroundColor: '#2563eb',
          color: '#ffffff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: 700,
          fontSize: 16,
          flexShrink: 0,
        }}
      >
        {fa.app.shortName}
      </div>
      {(!collapsed || isMobile) && (
        <span
          style={{
            fontWeight: 700,
            fontSize: 14,
            color: '#0f172a',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {fa.app.name}
        </span>
      )}
    </div>
  );

  return (
    <Layout style={{ minHeight: '100vh', direction: 'rtl' }}>
      {/* Desktop RTL Sidebar (Right side in RTL mode) */}
      {!isMobile && (
        <Sider
          collapsible
          collapsed={collapsed}
          onCollapse={(value) => setCollapsed(value)}
          trigger={null}
          width={250}
          collapsedWidth={72}
          theme="light"
          style={{
            borderInlineStart: '1px solid #e2e8f0',
            position: 'sticky',
            top: 0,
            height: '100vh',
            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)',
            zIndex: 10,
          }}
        >
          {brandHeader}
          <div style={{ padding: '12px 8px' }}>
            <Menu
              mode="inline"
              selectedKeys={[selectedKey]}
              items={menuItems}
              style={{ border: 'none', background: 'transparent' }}
            />
          </div>
        </Sider>
      )}

      {/* Mobile Sidebar Drawer */}
      {isMobile && (
        <Drawer
          title={brandHeader}
          placement="right"
          onClose={() => setMobileDrawerOpen(false)}
          open={mobileDrawerOpen}
          styles={{ body: { padding: '12px 8px' }, header: { padding: 0 } }}
          width={260}
        >
          <Menu
            mode="inline"
            selectedKeys={[selectedKey]}
            items={menuItems}
            style={{ border: 'none' }}
          />
        </Drawer>
      )}

      <Layout>
        {/* App Header */}
        <Header
          style={{
            padding: '0 20px',
            background: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '1px solid #e2e8f0',
            height: 64,
            position: 'sticky',
            top: 0,
            zIndex: 9,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            {isMobile ? (
              <Button
                type="text"
                icon={<MenuOutlined />}
                onClick={() => setMobileDrawerOpen(true)}
                aria-label="منوی ناوبری"
                style={{ fontSize: 16, width: 40, height: 40 }}
              />
            ) : (
              <Button
                type="text"
                icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                onClick={() => setCollapsed(!collapsed)}
                aria-label="تغییر وضعیت منو"
                style={{ fontSize: 16, width: 40, height: 40 }}
              />
            )}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <Dropdown menu={{ items: userMenuItems }} placement="bottomLeft" trigger={['click']}>
              <Button
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '4px 10px',
                  borderRadius: 8,
                  height: 38,
                  background: '#f8fafc',
                  borderColor: '#e2e8f0',
                }}
                aria-label={fa.auth.userProfile}
              >
                <Avatar
                  style={{ backgroundColor: '#2563eb' }}
                  icon={<UserOutlined />}
                  size="small"
                />
                <span
                  style={{
                    fontSize: 13,
                    fontWeight: 500,
                    color: '#334155',
                    maxWidth: 140,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {user?.name || user?.nickname || user?.email || fa.auth.userProfile}
                </span>
              </Button>
            </Dropdown>
          </div>
        </Header>

        {/* Content Area with Max Width and Padding */}
        <Content
          style={{
            padding: isMobile ? 16 : 24,
            minHeight: 280,
            backgroundColor: '#f8fafc',
          }}
        >
          <div
            style={{
              maxWidth: 1200,
              margin: '0 auto',
              width: '100%',
            }}
          >
            <Outlet />
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};
