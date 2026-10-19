import test from 'node:test';
import assert from 'node:assert/strict';
import { formatNumber, formatMoney, formatDate, fullName } from './format.ts';

test('formatNumber handles numbers, zeros, null, and empty string', () => {
  // Test zero / empty
  assert.equal(formatNumber(0), '۰');
  assert.equal(formatNumber(null), '۰');
  assert.equal(formatNumber(undefined), '۰');

  // Test grouping and Persian digits
  const formatted = formatNumber(1000);
  // Persian digits: ۱٬۰۰۰
  assert.ok(formatted.includes('۱'));
  assert.ok(formatted.includes('۰'));
});

test('formatMoney adds IRR currency label by default', () => {
  const result = formatMoney(500000);
  assert.ok(result.endsWith('ریال'));
  assert.ok(result.includes('۵۰۰'));

  const resultCustom = formatMoney(120, 'تومان');
  assert.ok(resultCustom.endsWith('تومان'));
});

test('formatDate converts ISO date to Jalali without crashing', () => {
  assert.equal(formatDate(null), '-');
  assert.equal(formatDate('invalid-date'), '-');

  const formatted = formatDate('2026-03-21');
  assert.ok(typeof formatted === 'string');
  assert.notEqual(formatted, '-');
});

test('fullName properly combines first and last names', () => {
  assert.equal(fullName({ firstName: 'علی', lastName: 'محمدی' }), 'علی محمدی');
  assert.equal(fullName({ firstName: 'سارا' }), 'سارا');
  assert.equal(fullName({ lastName: 'رضایی' }), 'رضایی');
  assert.equal(fullName(null), '-');
  assert.equal(fullName({ firstName: '', lastName: '' }), '-');
});
