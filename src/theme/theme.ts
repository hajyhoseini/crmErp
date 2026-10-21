import type { ThemeConfig } from 'antd';

export const THEME_COLORS = {
  primary: '#2563eb',
  accent1: '#14b8a6',
  accent2: '#f59e0b',
  bgLayout: '#f5f7fb',
  bgCard: '#ffffff',
} as const;

export const VAZIRMATN_FONT = "'Vazirmatn', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif";

export const appTheme: ThemeConfig = {
  token: {
    fontFamily: VAZIRMATN_FONT,
    colorPrimary: THEME_COLORS.primary,
    colorInfo: THEME_COLORS.primary,
    colorSuccess: '#16a34a',
    colorWarning: THEME_COLORS.accent2,
    colorError: '#dc2626',
    colorTextBase: '#0f172a',
    colorTextSecondary: '#475569',
    colorBgBase: THEME_COLORS.bgCard,
    colorBgLayout: THEME_COLORS.bgLayout,
    colorBorder: '#e2e8f0',
    colorBorderSecondary: '#f1f5f9',
    borderRadius: 12,
    borderRadiusSM: 8,
    borderRadiusLG: 12,
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
      borderRadiusLG: 12,
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
      bodyBg: THEME_COLORS.bgLayout,
    },
    Modal: {
      borderRadiusLG: 12,
    },
  },
};
