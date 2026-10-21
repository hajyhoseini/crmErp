import React, { useState, useEffect, useMemo } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Layout, Menu, Button, Drawer, Select, Grid, type MenuProps } from 'antd';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  MenuOutlined,
  LogoutOutlined,
  SafetyCertificateOutlined,
} from '@ant-design/icons';
import { useAuth } from '../auth/useAuth';
import { useCan } from '../auth/useCan';
import { fa } from '../i18n/fa';
import { navItems } from './navConfig';
import { ADMIN_PANEL_URL } from '../config';

const { Header, Sider, Content } = Layout;
const { useBreakpoint } = Grid;

export const AppLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const screens = useBreakpoint();
  const isMobile = screens.md === false;

  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout, isRoot, activeRole, switchRole } = useAuth();
  const can = useCan;

  useEffect(() => {
    setMobileDrawerOpen(false);
  }, [location.pathname]);

  const accessibleNavItems = useMemo(() => {
    return navItems.filter((item) => !item.snippet || can(item.snippet));
  }, [can]);

  const menuItems: MenuProps['items'] = useMemo(() => {
    return accessibleNavItems.map((item) => ({
      key: item.path,
      icon: item.icon,
      label: item.label,
      onClick: () => navigate(item.path),
    }));
  }, [accessibleNavItems, navigate]);

  const selectedKey = useMemo(() => {
    const current = accessibleNavItems.find((item) => {
      if (item.path === '/') {
        return location.pathname === '/';
      }
      return location.pathname === item.path || location.pathname.startsWith(`${item.path}/`);
    });
    return current ? current.path : location.pathname;
  }, [accessibleNavItems, location.pathname]);

  const hasMultipleRoles = Boolean(user?.roles && user.roles.length > 1);

  const brandHeader = (
    <div
      style={{
        height: 64,
        display: 'flex',
        alignItems: 'center',
        paddingInline: 16,
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
        S
      </div>
      {(!collapsed || isMobile) && (
        <span
          style={{
            fontWeight: 700,
            fontSize: 16,
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
    <Layout style={{ minHeight: '100vh' }}>
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
            insetBlockStart: 0,
            height: '100vh',
            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)',
            zIndex: 10,
          }}
        >
          {brandHeader}
          <div style={{ paddingBlock: 12, paddingInline: 8 }}>
            <Menu
              mode="inline"
              selectedKeys={[selectedKey]}
              items={menuItems}
              style={{ border: 'none', background: 'transparent' }}
            />
          </div>
        </Sider>
      )}

      {isMobile && (
        <Drawer
          title={brandHeader}
          placement="right"
          onClose={() => setMobileDrawerOpen(false)}
          open={mobileDrawerOpen}
          styles={{ body: { paddingBlock: 12, paddingInline: 8 }, header: { padding: 0 } }}
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
        <Header
          style={{
            paddingInline: 20,
            paddingBlock: 0,
            background: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '1px solid #e2e8f0',
            height: 64,
            position: 'sticky',
            insetBlockStart: 0,
            zIndex: 9,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            {isMobile ? (
              <Button
                type="text"
                icon={<MenuOutlined />}
                onClick={() => setMobileDrawerOpen(true)}
                aria-label={fa.nav.home}
                style={{ fontSize: 16, width: 40, height: 40 }}
              />
            ) : (
              <Button
                type="text"
                icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                onClick={() => setCollapsed(!collapsed)}
                aria-label={fa.app.name}
                style={{ fontSize: 16, width: 40, height: 40 }}
              />
            )}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            {hasMultipleRoles && (
              <Select
                value={activeRole || undefined}
                onChange={(val) => switchRole(val)}
                options={user?.roles?.map((r) => ({
                  value: r.name,
                  label: r.title || r.name,
                }))}
                style={{ minWidth: 130 }}
                placeholder={fa.roles.select}
                aria-label={fa.roles.title}
              />
            )}

            {isRoot && (
              <Button
                type="default"
                icon={<SafetyCertificateOutlined />}
                href={ADMIN_PANEL_URL}
                target="_blank"
                rel="noopener noreferrer"
              >
                {fa.nav.adminPanel}
              </Button>
            )}

            <div
              style={{
                fontSize: 14,
                fontWeight: 500,
                color: '#334155',
                paddingInline: 8,
              }}
            >
              {user?.nickname || user?.username || user?.email || fa.auth.userProfile}
            </div>

            <Button
              type="text"
              danger
              icon={<LogoutOutlined />}
              onClick={logout}
              aria-label={fa.auth.logout}
            >
              {fa.auth.logout}
            </Button>
          </div>
        </Header>

        <Content
          style={{
            paddingBlock: isMobile ? 16 : 24,
            paddingInline: isMobile ? 16 : 24,
            minHeight: 280,
            backgroundColor: '#f8fafc',
          }}
        >
          <div
            style={{
              maxWidth: 1200,
              marginInline: 'auto',
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
