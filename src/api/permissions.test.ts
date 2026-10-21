import test from 'node:test';
import assert from 'node:assert/strict';
import { hasSnippet } from './permissions.ts';

test('hasSnippet grants everything when allowAll is true', () => {
  assert.equal(hasSnippet([], 'pm.anything', true), true);
  assert.equal(hasSnippet(['!pm.*'], 'pm.anything', true), true);
});

test('hasSnippet handles exact matches and wildcards including dots', () => {
  const snippets = ['pm.*', 'ui.user', '!pm.knowledge.settings'];
  assert.equal(hasSnippet(snippets, 'pm.process-designer.use'), true);
  assert.equal(hasSnippet(snippets, 'ui.user'), true);
  assert.equal(hasSnippet(snippets, 'ui.admin'), false);
});

test('hasSnippet ensures negated entries always win', () => {
  const snippets = ['pm.*', '!pm.knowledge.settings'];
  assert.equal(hasSnippet(snippets, 'pm.knowledge.settings'), false);
  assert.equal(hasSnippet(snippets, 'pm.knowledge.manage'), true);

  const snippetsReordered = ['!pm.knowledge.settings', 'pm.*'];
  assert.equal(hasSnippet(snippetsReordered, 'pm.knowledge.settings'), false);
  assert.equal(hasSnippet(snippetsReordered, 'pm.knowledge.manage'), true);
});

test('hasSnippet returns false for empty or unmatching snippets', () => {
  assert.equal(hasSnippet([], 'pm.test'), false);
  assert.equal(hasSnippet(null, 'pm.test'), false);
  assert.equal(hasSnippet(undefined, 'pm.test'), false);
});
