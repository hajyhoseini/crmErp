import React from 'react';
import { Modal } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { fa } from '../i18n/fa';

export interface ConfirmDeleteOptions {
  title?: string;
  content?: React.ReactNode;
  onConfirm: () => Promise<void> | void;
  okText?: string;
  cancelText?: string;
}

/**
 * Triggers a Persian RTL confirmation modal for deletion operations.
 */
export function showConfirmDelete(options: ConfirmDeleteOptions): void {
  Modal.confirm({
    title: options.title || fa.confirmDelete.title,
    icon: <ExclamationCircleOutlined style={{ color: '#dc2626' }} />,
    content: options.content || fa.confirmDelete.content,
    okText: options.okText || fa.confirmDelete.okText,
    cancelText: options.cancelText || fa.confirmDelete.cancelText,
    okButtonProps: { danger: true },
    direction: 'rtl',
    onOk: options.onConfirm,
  });
}
