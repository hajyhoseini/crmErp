import type { ThemeConfig } from 'antd';

export const VAZIRMATN_FONT = "'Vazirmatn', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif";

export const appTheme: ThemeConfig = {
  token: {
    fontFamily: VAZIRMATN_FONT,
    colorPrimary: '#2563eb',
    colorInfo: '#2563eb',
    colorSuccess: '#16a34a',
    colorWarning: '#d97706',
    colorError: '#dc2626',
    colorTextBase: '#0f172a',
    colorTextSecondary: '#475569',
    colorBgBase: '#ffffff',
    colorBgLayout: '#f8fafc',
    colorBorder: '#e2e8f0',
    colorBorderSecondary: '#f1f5f9',
    borderRadius: 8,
    borderRadiusSM: 6,
    borderRadiusLG: 10,
    fontSize: 14,
    wireframe: false,
  },
  components: {
    Button: {
      borderRadius: 8,
      controlHeight: 38,
      fontWeight: 500,
    },
    Input: {
      borderRadius: 8,
      controlHeight: 38,
      colorBorder: '#cbd5e1',
    },
    Select: {
      borderRadius: 8,
      controlHeight: 38,
    },
    Card: {
      borderRadiusLG: 10,
      colorBorderSecondary: '#e2e8f0',
    },
    Table: {
      borderRadius: 8,
      headerBg: '#f8fafc',
      headerColor: '#334155',
    },
    Menu: {
      itemBorderRadius: 8,
      itemSelectedBg: '#eff6ff',
      itemSelectedColor: '#1d4ed8',
    },
    Layout: {
      headerBg: '#ffffff',
      siderBg: '#ffffff',
      bodyBg: '#f8fafc',
    },
    Modal: {
      borderRadiusLG: 10,
    },
  },
};
