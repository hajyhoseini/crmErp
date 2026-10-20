import React from 'react';
import {
  HomeOutlined,
  ApartmentOutlined,
  BookOutlined,
  SolutionOutlined,
  SyncOutlined,
  SettingOutlined,
  AudioOutlined,
} from '@ant-design/icons';
import { fa } from '../i18n/fa';

export interface NavItemConfig {
  key: string;
  path: string;
  label: string;
  snippet?: string;
  icon: React.ReactNode;
}

export const navItems: NavItemConfig[] = [
  {
    key: 'home',
    path: '/',
    label: fa.nav.home,
    icon: React.createElement(HomeOutlined),
  },
  {
    key: 'processes',
    path: '/processes',
    label: fa.nav.processes,
    snippet: 'pm.process-designer.use',
    icon: React.createElement(ApartmentOutlined),
  },
  {
    key: 'knowledge',
    path: '/knowledge',
    label: fa.nav.knowledge,
    snippet: 'pm.knowledge.manage',
    icon: React.createElement(BookOutlined),
  },
  {
    key: 'positions',
    path: '/positions',
    label: fa.nav.positions,
    snippet: 'pm.organization.positions',
    icon: React.createElement(SolutionOutlined),
  },
  {
    key: 'external-sync',
    path: '/external-sync',
    label: fa.nav.externalSync,
    snippet: 'pm.external-data.sync',
    icon: React.createElement(SyncOutlined),
  },
  {
    key: 'settings-knowledge',
    path: '/settings/knowledge',
    label: fa.nav.knowledgeSettings,
    snippet: 'pm.knowledge.settings',
    icon: React.createElement(SettingOutlined),
  },
  {
    key: 'speech',
    path: '/speech',
    label: fa.nav.speech,
    snippet: 'pm.speech.settings',
    icon: React.createElement(AudioOutlined),
  },
];
