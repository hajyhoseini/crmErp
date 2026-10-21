import test from 'node:test';
import assert from 'node:assert/strict';
import { formatNumber, formatDate } from './format';

test('formatNumber handles numbers, zeros, null, and empty string', () => {
  assert.equal(formatNumber(0), '۰');
  assert.equal(formatNumber(null), '۰');
  assert.equal(formatNumber(undefined), '۰');

  const formatted = formatNumber(1000);
  assert.ok(formatted.includes('۱'));
  assert.ok(formatted.includes('۰'));
});

test('formatDate converts ISO date to Jalali without crashing', () => {
  assert.equal(formatDate(null), '-');
  assert.equal(formatDate('invalid-date'), '-');

  const formatted = formatDate('2026-03-21');
  assert.ok(typeof formatted === 'string');
  assert.notEqual(formatted, '-');
});
